import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../db/migrations');

async function runMigrations() {
  try {
    const migrationFiles = await fs.readdir(migrationsDir);
    const sqlFiles = migrationFiles.filter((file) => file.endsWith('.sql')).sort();

    for (const file of sqlFiles) {
      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      await pool.query(sql);
      console.log(`Applied migration: ${file}`);
    }
  } finally {
    await pool.end();
  }
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
