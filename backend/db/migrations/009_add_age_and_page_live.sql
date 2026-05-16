ALTER TABLE users ADD COLUMN IF NOT EXISTS age_confirmed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS page_live BOOLEAN DEFAULT true;

UPDATE users
SET age_confirmed = true
WHERE username IS NOT NULL
AND age_confirmed = false;
