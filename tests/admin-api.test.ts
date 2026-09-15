import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as createBlog } from '@/app/api/admin/blog/route';
import { PUT as updateBlog, DELETE as deleteBlog } from '@/app/api/admin/blog/[id]/route';
import { POST as createCategory } from '@/app/api/admin/categories/route';
import { PATCH as updateSubmission, DELETE as deleteSubmission } from '@/app/api/admin/submissions/route';
import * as adminAuth from '@/lib/supabase-admin';

describe('Admin Mutation APIs & Strict Schemas', () => {
  const mockFrom = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockSelect = vi.fn();
  const mockEq = vi.fn();
  const mockSingle = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();

    mockSingle.mockResolvedValue({ data: { id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d' }, error: null });
    mockEq.mockReturnValue({ single: mockSingle, select: mockSelect });
    mockUpdate.mockReturnValue({ eq: mockEq, select: mockSelect });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle, data: [{ id: 'item-1' }], error: null });

    mockFrom.mockReturnValue({
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      select: mockSelect,
    });

    vi.spyOn(adminAuth, 'verifyAdmin').mockResolvedValue({
      authorized: true,
      user: { id: 'admin-123', email: 'admin@10centagency.com' } as any,
      supabaseAdmin: {
        from: mockFrom,
      } as any,
    });
  });

  describe('POST /api/admin/blog', () => {
    it('rejects foreign origin with 403 Forbidden', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'https://evil.com',
        },
        body: JSON.stringify({ title: 'Test Post' }),
      });

      const res = await createBlog(req);
      expect(res.status).toBe(403);
    });

    it('rejects unauthenticated requests with 401', async () => {
      vi.spyOn(adminAuth, 'verifyAdmin').mockResolvedValueOnce({
        authorized: false,
        response: new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }) as any,
      });

      const req = new NextRequest('http://localhost:3000/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({ title: 'Test' }),
      });

      const res = await createBlog(req);
      expect(res.status).toBe(401);
    });

    it('rejects invalid slug format and unknown properties via strict Zod schema', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          title: 'My Valid Title',
          slug: 'INVALID SLUG WITH SPACES',
          category_id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
          unknown_injected_column: 'malicious',
        }),
      });

      const res = await createBlog(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('suppresses raw database error messages on database failure', async () => {
      mockInsert.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({
            data: null,
            error: { message: 'pg_catalog syntax error: relation "blog_posts" table constraint foreign_key violation' },
          }),
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          title: 'Valid Post',
          slug: 'valid-post',
          category_id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        }),
      });

      const res = await createBlog(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      // Ensure raw Postgres table constraint message is NOT leaked to the client
      expect(data.error).not.toContain('pg_catalog');
      expect(data.error).not.toContain('relation');
      expect(data.error).toBe('Failed to create blog post');
    });
  });

  describe('PUT /api/admin/blog/[id]', () => {
    it('rejects non-UUID id route parameter with 400 Bad Request', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/blog/123-not-uuid', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({ title: 'New Title' }),
      });

      const res = await updateBlog(req, { params: Promise.resolve({ id: '123-not-uuid' }) });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('Invalid blog post ID');
    });

    it('rejects empty update payload with 400 Bad Request', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/blog/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({}),
      });

      const res = await updateBlog(req, {
        params: Promise.resolve({ id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d' }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/admin/blog/[id]', () => {
    it('rejects malformed UUID with 400 Bad Request', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/blog/bad-id', {
        method: 'DELETE',
        headers: { origin: 'http://localhost:3000' },
      });

      const res = await deleteBlog(req, { params: Promise.resolve({ id: 'bad-id' }) });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/admin/categories', () => {
    it('rejects invalid category type with 400 Bad Request', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          name: 'SEO',
          slug: 'seo',
          type: 'invalid-type', // only 'portfolio' or 'blog' permitted
        }),
      });

      const res = await createCategory(req);
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH & DELETE /api/admin/submissions', () => {
    it('rejects invalid submission status with 400 Bad Request', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
          status: 'spam-or-invalid', // only 'read' or 'unread' permitted
        }),
      });

      const res = await updateSubmission(req);
      expect(res.status).toBe(400);
    });

    it('rejects deletion with invalid UUID parameter with 400 Bad Request', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/submissions?id=not-a-uuid', {
        method: 'DELETE',
        headers: { origin: 'http://localhost:3000' },
      });

      const res = await deleteSubmission(req);
      expect(res.status).toBe(400);
    });
  });
});
