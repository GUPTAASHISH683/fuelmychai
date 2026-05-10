import 'dotenv/config';

import { pool } from './pool.js';
import { encryptValue, hashLookupValue } from '../utils/encryption.js';

function isEncrypted(value) {
  return typeof value === 'string' && value.startsWith('enc:v1:');
}

async function backfillSensitiveData() {
  const result = await pool.query('SELECT id, email, upi_id, email_hash FROM users');
  let updatedCount = 0;

  for (const user of result.rows) {
    const fields = [];
    const values = [];

    if (user.email && !isEncrypted(user.email)) {
      values.push(encryptValue(user.email));
      fields.push(`email = $${values.length}`);
    }

    if (user.email && !user.email_hash) {
      values.push(hashLookupValue(user.email));
      fields.push(`email_hash = $${values.length}`);
    }

    if (user.upi_id && !isEncrypted(user.upi_id)) {
      values.push(encryptValue(user.upi_id));
      fields.push(`upi_id = $${values.length}`);
    }

    if (fields.length === 0) {
      continue;
    }

    values.push(user.id);

    await pool.query(
      `UPDATE users
       SET ${fields.join(', ')},
           updated_at = NOW()
       WHERE id = $${values.length}`,
      values
    );
    updatedCount += 1;
  }

  console.log(`Encrypted sensitive data for ${updatedCount} user row(s).`);
}

backfillSensitiveData()
  .catch((error) => {
    console.error('Sensitive data backfill failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
