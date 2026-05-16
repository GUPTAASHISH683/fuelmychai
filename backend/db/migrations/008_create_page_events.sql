CREATE TABLE IF NOT EXISTS page_events (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL,
  referrer_bucket VARCHAR(30) DEFAULT 'direct',
  ip_hash VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_creator ON page_events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_created ON page_events(created_at);
