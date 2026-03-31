// Simple in-memory rate limiter for production-level API protection
// Note: In a large-scale production app, use Redis for this.

const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

export function rateLimit(ip: string, limit: number = 5, windowMs: number = 900000) { // Default: 5 requests per 15 mins
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

  // Reset if window has passed
  if (now - userData.lastRequest > windowMs) {
    userData.count = 1;
    userData.lastRequest = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);

  return {
    success: userData.count <= limit,
    remaining: Math.max(0, limit - userData.count),
  };
}
