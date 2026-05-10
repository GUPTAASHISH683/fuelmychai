ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_hash VARCHAR(64);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_hash ON users (email_hash);
