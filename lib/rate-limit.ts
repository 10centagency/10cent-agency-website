import { getSupabaseAdmin } from './supabase-admin';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function checkMemoryRateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowSeconds * 1000;
    memoryStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetTime: resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetAt };
}

/**
 * Distributed rate limiter.
 * Supports Upstash Redis REST if configured, with an automatic database-backed fallback
 * and memory store fallback for test/offline resilience.
 */
export async function checkRateLimit(
  identifier: string,
  limit = 5,
  windowSeconds = 600
): Promise<RateLimitResult> {
  const key = `ratelimit:contact:${identifier}`;

  if (process.env.NODE_ENV === 'test') {
    return checkMemoryRateLimit(key, limit, windowSeconds);
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Try Upstash Redis if configured
  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['TTL', key],
        ]),
      });

      if (res.ok) {
        const data = await res.json();
        const count = data[0]?.result ?? 1;
        let ttl = data[1]?.result ?? -1;

        if (ttl === -1) {
          // Set expiry on first increment
          await fetch(`${upstashUrl}/expire/${key}/${windowSeconds}`, {
            headers: { Authorization: `Bearer ${upstashToken}` },
          });
          ttl = windowSeconds;
        }

        const allowed = count <= limit;
        return {
          allowed,
          remaining: Math.max(0, limit - count),
          resetTime: Date.now() + ttl * 1000,
        };
      }
    } catch (err) {
      console.warn('[RateLimit] Upstash Redis check failed, falling back to database:', err);
    }
  }

  // 2. Database-backed fallback rate limiter
  try {
    const admin = getSupabaseAdmin();
    const dbKey = `contact:${identifier}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

    // Call database rate check/upsert
    const { data, error } = await admin
      .from('rate_limits' as any)
      .select('count, reset_at')
      .eq('key', dbKey)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('[RateLimit] Database rate limit query error:', error.message);
      return checkMemoryRateLimit(key, limit, windowSeconds);
    }

    const record = data as { count: number; reset_at: string } | null;

    if (!record || new Date(record.reset_at) < now) {
      // Create new window
      await (admin as any).from('rate_limits').upsert({
        key: dbKey,
        count: 1,
        reset_at: expiresAt.toISOString(),
      });
      return { allowed: true, remaining: limit - 1, resetTime: expiresAt.getTime() };
    }

    if (record.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(record.reset_at).getTime(),
      };
    }

    // Increment count
    await (admin as any).from('rate_limits').update({
      count: record.count + 1,
    }).eq('key', dbKey);

    return {
      allowed: true,
      remaining: Math.max(0, limit - (record.count + 1)),
      resetTime: new Date(record.reset_at).getTime(),
    };
  } catch (err) {
    console.warn('[RateLimit] Fallback rate limiter error:', err);
    return checkMemoryRateLimit(key, limit, windowSeconds);
  }
}
