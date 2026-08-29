import { NextRequest, NextResponse } from 'next/server';

const MAX_BODY_SIZE_BYTES = 10 * 1024; // 10 KB guard against report spam

export async function POST(req: NextRequest) {
  try {
    // 1. Content-Length guard (reject bodies > 10KB)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE_BYTES) {
      return new NextResponse(null, { status: 413 });
    }

    // 2. Read and verify body length
    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_SIZE_BYTES) {
      return new NextResponse(null, { status: 413 });
    }

    if (!rawBody.trim()) {
      return new NextResponse(null, { status: 204 });
    }

    // 3. Parse JSON report body
    let json: Record<string, unknown> | Array<Record<string, unknown>>;
    try {
      json = JSON.parse(rawBody);
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    // Handle standard "csp-report" format or Reporting API array
    const reports: Array<{
      documentURL?: unknown;
      violatedDirective?: unknown;
      blockedURI?: unknown;
      statusCode?: unknown;
    }> = [];

    if (Array.isArray(json)) {
      // Reporting API array format
      for (const item of json) {
        if (item && typeof item === 'object') {
          const body = (item.body as Record<string, unknown>) || {};
          reports.push({
            documentURL: body.documentURL || item.url,
            violatedDirective: body.violatedDirective || body.effectiveDirective,
            blockedURI: body.blockedURL || body.blockedURI,
            statusCode: body.statusCode,
          });
        }
      }
    } else if (json && typeof json === 'object') {
      const cspReport = (json['csp-report'] as Record<string, unknown>) || json;
      reports.push({
        documentURL: cspReport['document-uri'] || cspReport['documentURL'],
        violatedDirective:
          cspReport['violated-directive'] ||
          cspReport['effective-directive'] ||
          cspReport['effectiveDirective'] ||
          cspReport['violatedDirective'],
        blockedURI:
          cspReport['blocked-uri'] ||
          cspReport['blockedURI'] ||
          cspReport['blockedURL'],
        statusCode: cspReport['status-code'] || cspReport['statusCode'],
      });
    }

    // 4. Log only essentials for observation
    for (const report of reports) {
      console.log('[CSP Report]', {
        documentURL: report.documentURL || 'unknown',
        violatedDirective: report.violatedDirective || 'unknown',
        blockedURI: report.blockedURI || 'unknown',
        statusCode: report.statusCode ?? 'unknown',
      });
    }

    // 5. Always return 204 No Content
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[CSP Report] Collector error:', err);
    return new NextResponse(null, { status: 204 });
  }
}
