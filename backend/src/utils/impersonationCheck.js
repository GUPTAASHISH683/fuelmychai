import { distance } from 'fastest-levenshtein';

import { query } from '../db/pool.js';

function getSimilarity(first, second) {
  const maxLen = Math.max(first.length, second.length);

  if (maxLen === 0) {
    return 1;
  }

  return 1 - distance(first, second) / maxLen;
}

function normaliseSeparators(value) {
  return String(value || '').replace(/[-_]/g, '');
}

export async function checkImpersonationRisk(username, db = { query }) {
  const protectedCreators = await db.query(
    `SELECT protected_usernames
     FROM protected_creators`
  );

  const normalisedInput = normaliseSeparators(username);

  for (const row of protectedCreators.rows) {
    const protectedUsernames = Array.isArray(row.protected_usernames)
      ? row.protected_usernames
      : [];

    for (const protectedUsername of protectedUsernames) {
      const protectedValue = String(protectedUsername || '');
      const normalisedProtected = normaliseSeparators(protectedValue);

      if (username === protectedValue) {
        return { risky: true, reason: 'exact_protected_name' };
      }

      if (normalisedInput === normalisedProtected) {
        return { risky: true, reason: 'normalised_protected_name' };
      }

      const similarity = getSimilarity(username, protectedValue);
      if (similarity > 0.8 && username !== protectedValue) {
        return { risky: true, reason: 'similar_protected_name' };
      }
    }
  }

  const existingUsers = await db.query(
    `SELECT username
     FROM users
     WHERE username IS NOT NULL`
  );

  for (const row of existingUsers.rows) {
    const existingUsername = String(row.username || '');
    const similarity = getSimilarity(username, existingUsername);

    if (similarity > 0.85 && username !== existingUsername) {
      return { risky: true, reason: 'similar_existing_username' };
    }
  }

  return { risky: false };
}
