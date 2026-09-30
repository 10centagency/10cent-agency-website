export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import type { Metadata } from 'sharp';
import { verifyAdmin } from '@/lib/supabase-admin';
import { verifySameOrigin } from '@/lib/csrf';
import { isAllowedBucket, ALLOWED_STORAGE_BUCKETS } from '@/lib/storage-config';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_DIMENSION = 4096; // 4096px
const MAX_INPUT_PIXELS = 16777216; // 16 Megapixels (4096 x 4096)

export async function POST(req: NextRequest) {
  // 1. Same-origin CSRF verification
  const csrf = verifySameOrigin(req);
  if (!csrf.allowed) {
    return csrf.response!;
  }

  // 2. Admin authorization
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return auth.response;
  }

  const { supabaseAdmin } = auth;

  // 3. Early Content-Length check (before reading body)
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 6 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'Payload exceeds maximum upload limit of 5MB' },
      { status: 413 }
    );
  }

  // 4. Parse multipart form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data payload' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const bucket = formData.get('bucket') as string | null;

  if (!file || !bucket) {
    return NextResponse.json({ error: 'File and bucket parameters are required' }, { status: 400 });
  }

  // 5. Bucket allowlist verification
  if (!isAllowedBucket(bucket)) {
    return NextResponse.json(
      { error: `Invalid bucket. Allowed buckets: ${ALLOWED_STORAGE_BUCKETS.join(', ')}` },
      { status: 400 }
    );
  }

  // 6. File size verification
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'File size exceeds maximum limit of 5MB' },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 7. Reject SVG, HTML, scripts, or executables by checking magic bytes / header
  const headerSlice = buffer.subarray(0, 1024).toString('utf8').toLowerCase();
  if (
    headerSlice.includes('<svg') ||
    headerSlice.includes('<?xml') ||
    headerSlice.includes('<!doctype') ||
    headerSlice.includes('<html') ||
    headerSlice.includes('<?php') ||
    (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) || // Windows PE (MZ)
    (buffer.length >= 4 && buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) // ELF
  ) {
    return NextResponse.json(
      { error: 'Vector (SVG), HTML, executable, and unknown file formats are strictly prohibited.' },
      { status: 400 }
    );
  }

  // 8. Image decoding, decompression-bomb defense & metadata validation using sharp
  let metadata: Metadata;
  try {
    const sharpInstance = sharp(buffer, {
      failOn: 'error',
      limitInputPixels: MAX_INPUT_PIXELS,
    });
    metadata = await sharpInstance.metadata();
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Corrupted or invalid image data.' },
      { status: 400 }
    );
  }

  if (!metadata.format || !['jpeg', 'png', 'webp', 'heif', 'gif'].includes(metadata.format)) {
    return NextResponse.json(
      { error: 'Unsupported image format. Allowed formats: JPEG, PNG, WebP, AVIF, GIF.' },
      { status: 400 }
    );
  }

  if (!metadata.width || !metadata.height || metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
    return NextResponse.json(
      { error: `Image dimensions exceed maximum allowed limits of ${MAX_DIMENSION}x${MAX_DIMENSION}px.` },
      { status: 400 }
    );
  }

  // Animated GIF policy: Animated GIFs (multi-page/frame) are rejected to prevent resource exhaustion
  // and frame-based polyglot attacks; static single-frame GIFs are safely re-encoded to WebP.
  if (metadata.format === 'gif' && metadata.pages && metadata.pages > 1) {
    return NextResponse.json(
      { error: 'Animated GIFs are not supported. Please upload static images or video.' },
      { status: 400 }
    );
  }

  // 9. Re-encode image to strip unsafe metadata (EXIF/IPTC/XMP) and normalize output
  let outputBuffer: Buffer;
  let canonicalExt: string;
  let contentType: string;

  try {
    if (metadata.format === 'jpeg') {
      outputBuffer = await sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
      canonicalExt = 'jpg';
      contentType = 'image/jpeg';
    } else if (metadata.format === 'png') {
      outputBuffer = await sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS })
        .png({ compressionLevel: 8 })
        .toBuffer();
      canonicalExt = 'png';
      contentType = 'image/png';
    } else if (metadata.format === 'heif') {
      outputBuffer = await sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS })
        .avif({ quality: 80 })
        .toBuffer();
      canonicalExt = 'avif';
      contentType = 'image/avif';
    } else {
      // Re-encode static GIF and WebP to clean WebP
      outputBuffer = await sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS })
        .webp({ quality: 85 })
        .toBuffer();
      canonicalExt = 'webp';
      contentType = 'image/webp';
    }
  } catch (err: any) {
    console.error('[Admin Upload API] Image re-encoding failed:', err);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }

  // 10. Generate cryptographically random UUID filename with verified canonical extension
  const path = `${crypto.randomUUID()}.${canonicalExt}`;

  // 11. Upload normalized buffer with upsert: false and derived content type
  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, outputBuffer, {
      contentType,
      cacheControl: '31536000',
      upsert: false,
    });

  if (uploadError) {
    console.error('[Admin Upload API] Storage upload failed:', uploadError);
    return NextResponse.json({ error: 'Failed to upload image to storage' }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path);

  return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 201 });
}
