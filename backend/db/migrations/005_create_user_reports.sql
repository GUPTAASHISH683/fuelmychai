CREATE TABLE IF NOT EXISTS user_reports (
  id SERIAL PRIMARY KEY,
  reported_username VARCHAR(30) NOT NULL,
  reporter_email VARCHAR(100),
  reporter_google_id VARCHAR(100),
  reason VARCHAR(50) NOT NULL,
  details TEXT,
  reporter_weight DECIMAL DEFAULT 1.0,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_username ON user_reports(reported_username);
CREATE INDEX IF NOT EXISTS idx_reports_status ON user_reports(status);
