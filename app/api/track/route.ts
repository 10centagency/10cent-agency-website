import { NextRequest, NextResponse } from 'next/server';
import { sendToCAPI } from '@/lib/capi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventId, eventSourceUrl, fbc, fbp } = body;

    if (!eventName || !eventId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      undefined;

    const userAgent = req.headers.get('user-agent') || undefined;

    await sendToCAPI({
      eventName,
      eventId,
      eventSourceUrl,
      userAgent,
      ipAddress,
      fbc,
      fbp,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
