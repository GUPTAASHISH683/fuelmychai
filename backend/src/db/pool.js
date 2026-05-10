import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Database connection will fail until it is configured.');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false
        }
      : undefined
});

export async function query(text, params) {
  return pool.query(text, params);
}

export async function verifyDatabaseConnection() {
  const result = await pool.query('SELECT NOW() AS now');
  console.log(`Database connected at ${result.rows[0].now.toISOString()}`);
}
