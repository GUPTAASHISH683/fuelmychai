CREATE TABLE IF NOT EXISTS review_queue (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content_type VARCHAR(30) NOT NULL,
  content TEXT NOT NULL,
  reason VARCHAR(200) NOT NULL,
  matched_word VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_queue_user_id ON review_queue (user_id);
CREATE INDEX IF NOT EXISTS idx_review_queue_status ON review_queue (status);
