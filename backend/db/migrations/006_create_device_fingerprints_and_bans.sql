CREATE TABLE IF NOT EXISTS device_fingerprints (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  fingerprint_hash VARCHAR(64) NOT NULL,
  ip_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fingerprints_user ON device_fingerprints(user_id);
CREATE INDEX IF NOT EXISTS idx_fingerprints_hash ON device_fingerprints(fingerprint_hash);
CREATE UNIQUE INDEX IF NOT EXISTS idx_fingerprints_user_hash
ON device_fingerprints(user_id, fingerprint_hash);

CREATE TABLE IF NOT EXISTS ban_records (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(100),
  email VARCHAR(200),
  ip_hash VARCHAR(64),
  fingerprint_hash VARCHAR(64),
  reason TEXT NOT NULL,
  banned_by VARCHAR(50) DEFAULT 'system',
  banned_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bans_google ON ban_records(google_id);
CREATE INDEX IF NOT EXISTS idx_bans_ip ON ban_records(ip_hash);
CREATE INDEX IF NOT EXISTS idx_bans_fingerprint ON ban_records(fingerprint_hash);
