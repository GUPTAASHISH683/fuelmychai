import { createHash } from 'crypto';

export function hashValue(value) {
  return createHash('sha256').update(String(value)).digest('hex');
}

export function getIpHash(req) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.connection?.remoteAddress ||
    'unknown';

  return hashValue(ip);
}

export async function isBanned(googleId, ipHash, fingerprintHash, db) {
  const result = await db.query(
    `SELECT id
     FROM ban_records
     WHERE google_id = $1
     OR ip_hash = $2
     OR fingerprint_hash = $3
     LIMIT 1`,
    [googleId || null, ipHash || null, fingerprintHash || null]
  );

  return result.rowCount > 0;
}
