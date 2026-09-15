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

// Atomic Lua script for Upstash Redis: INCR and set EXPIRE only on the first increment
const UPSTASH_ATOMIC_LUA = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
local ttl = redis.call('TTL', KEYS[1])
return {current, ttl}
`;

/**
 * Distributed rate limiter.
 * Tier 1: Upstash Redis REST using atomic Lua script.
 * Tier 2: Supabase RPC check_rate_limit using atomic row locking upsert.
 * Tier 3 (Test/Dev only): In-memory fallback.
 * Production fails closed if both Tier 1 and Tier 2 are unavailable.
 */
export async function checkRateLimit(
  identifier: string,
  limit = 5,
  windowSeconds = 600
): Promise<RateLimitResult> {
  const key = `ratelimit:contact:${identifier}`;

  // In test environments, use isolated in-memory limiter
  if (process.env.NODE_ENV === 'test') {
    return checkMemoryRateLimit(key, limit, windowSeconds);
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Tier 1: Atomic Upstash Redis EVAL if configured
  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/eval`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: UPSTASH_ATOMIC_LUA,
          keys: [key],
          args: [String(windowSeconds)],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.result) && data.result.length === 2) {
          const count = Number(data.result[0]) || 1;
          const ttl = Number(data.result[1]) > 0 ? Number(data.result[1]) : windowSeconds;

          const allowed = count <= limit;
          return {
            allowed,
            remaining: Math.max(0, limit - count),
            resetTime: Date.now() + ttl * 1000,
          };
        }
      }
    } catch (err) {
      console.warn('[RateLimit] Upstash Redis EVAL check failed, falling back to database:', err);
    }
  }

  // 2. Tier 2: Atomic Supabase Database RPC fallback
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await (admin as any).rpc('check_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (!error && Array.isArray(data) && data.length > 0) {
      const row = data[0] as { allowed?: boolean; remaining?: number; reset_at?: string };
      return {
        allowed: Boolean(row.allowed),
        remaining: typeof row.remaining === 'number' ? row.remaining : 0,
        resetTime: row.reset_at ? new Date(row.reset_at).getTime() : Date.now() + windowSeconds * 1000,
      };
    }

    if (error) {
      console.error('[RateLimit] Supabase check_rate_limit RPC error:', error.message);
    }
  } catch (err) {
    console.error('[RateLimit] Fallback database rate limiter error:', err);
  }

  // 3. Fallback policy
  if (process.env.NODE_ENV === 'development') {
    // Local development allows memory store
    return checkMemoryRateLimit(key, limit, windowSeconds);
  }

  // Production: Fail closed with high priority operational error log
  console.error('[RateLimit CRITICAL] All distributed rate limit backends failed in production. Failing closed.');
  return {
    allowed: false,
    remaining: 0,
    resetTime: Date.now() + 60 * 1000,
  };
}
