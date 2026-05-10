CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  username VARCHAR(30) UNIQUE,
  bio VARCHAR(200),
  upi_id VARCHAR(100),
  profile_image VARCHAR,
  chai_amounts INTEGER[] DEFAULT '{30,50,100}',
  visit_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users (google_id);
