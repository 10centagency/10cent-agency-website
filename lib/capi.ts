export async function sendToCAPI({
  eventName,
  eventId,
  eventSourceUrl,
  userAgent,
  ipAddress,
  fbc,
  fbp,
  contentName,
}: {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  userAgent?: string;
  ipAddress?: string;
  fbc?: string;
  fbp?: string;
  contentName?: string;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error('[CAPI] Missing PIXEL_ID or ACCESS_TOKEN');
    return;
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: 'website',
        ...(contentName ? { custom_data: { content_name: contentName } } : {}),
        user_data: {
          client_ip_address: ipAddress || null,
          client_user_agent: userAgent || null,
          fbc: fbc || null,
          fbp: fbp || null,
        },
      },
    ],
    test_event_code: process.env.META_TEST_EVENT_CODE || undefined,
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    const json = await res.json();
    if (!res.ok) {
      console.error('[CAPI] Error:', json);
    }
    return json;
  } catch (err) {
    console.error('[CAPI] Fetch failed:', err);
  }
}
