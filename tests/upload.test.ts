import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { POST } from '@/app/api/admin/upload/route';
import * as adminAuth from '@/lib/supabase-admin';

describe('Admin Upload API & Image Processing (app/api/admin/upload/route.ts)', () => {
  const mockStorageUpload = vi.fn();
  const mockGetPublicUrl = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();

    mockStorageUpload.mockResolvedValue({ data: { path: 'test.webp' }, error: null });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://test-project.supabase.co/storage/v1/object/public/blog-featured/test.webp' },
    });

    vi.spyOn(adminAuth, 'verifyAdmin').mockResolvedValue({
      authorized: true,
      user: { id: 'admin-123', email: 'admin@10centagency.com' } as any,
      supabaseAdmin: {
        storage: {
          from: vi.fn().mockReturnValue({
            upload: mockStorageUpload,
            getPublicUrl: mockGetPublicUrl,
          }),
        },
      } as any,
    });
  });

  it('rejects foreign origin with 403 Forbidden', async () => {
    const formData = new FormData();
    formData.append('bucket', 'blog-featured');
    formData.append('file', new File(['content'], 'test.jpg', { type: 'image/jpeg' }));

    const req = new NextRequest('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        origin: 'https://attacker.com',
      },
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('rejects unauthenticated requests with 401 Unauthorized', async () => {
    vi.spyOn(adminAuth, 'verifyAdmin').mockResolvedValueOnce({
      authorized: false,
      response: new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }) as any,
    });

    const formData = new FormData();
    formData.append('bucket', 'blog-featured');
    formData.append('file', new File(['content'], 'test.jpg', { type: 'image/jpeg' }));

    const req = new NextRequest('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthorized or unknown buckets with 400 Bad Request', async () => {
    const formData = new FormData();
    formData.append('bucket', 'malicious-or-private-bucket');
    formData.append('file', new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' }));

    const req = new NextRequest('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Invalid bucket');
  });

  it('rejects SVG files with 400 Bad Request', async () => {
    const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    const formData = new FormData();
    formData.append('bucket', 'blog-featured');
    formData.append('file', new File([svgContent], 'image.svg', { type: 'image/svg+xml' }));

    const req = new NextRequest('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Vector (SVG)');
  });

  it('rejects HTML and executable files with 400 Bad Request', async () => {
    const htmlContent = '<!DOCTYPE html><html><body><script>alert("xss")</script></body></html>';
    const formData = new FormData();
    formData.append('bucket', 'blog-featured');
    formData.append('file', new File([htmlContent], 'fake-image.jpg', { type: 'image/jpeg' }));

    const req = new NextRequest('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('HTML');
  });

  it('processes and safely re-encodes a legitimate image (PNG -> normalized)', async () => {
    // Generate a valid 50x50 PNG buffer using sharp
    const validPngBuffer = await sharp({
      create: {
        width: 50,
        height: 50,
        channels: 4,
        background: { r: 47, g: 133, b: 243, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const formData = new FormData();
    formData.append('bucket', 'blog-featured');
    formData.append('file', new File([validPngBuffer], 'valid-test.png', { type: 'image/png' }));

    const req = new NextRequest('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.url).toBeDefined();
    expect(mockStorageUpload).toHaveBeenCalledTimes(1);

    // Verify upload options: upsert must be false
    const uploadCallArgs = mockStorageUpload.mock.calls[0];
    expect(uploadCallArgs[2].upsert).toBe(false);
    expect(uploadCallArgs[2].contentType).toBe('image/png');
  });

  it('rejects oversized images (>4096px dimension)', async () => {
    const hugeImageBuffer = await sharp({
      create: {
        width: 4097,
        height: 10,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .jpeg()
      .toBuffer();

    const formData = new FormData();
    formData.append('bucket', 'blog-featured');
    formData.append('file', new File([hugeImageBuffer], 'huge.jpg', { type: 'image/jpeg' }));

    const req = new NextRequest('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('dimensions exceed maximum');
  });
});
