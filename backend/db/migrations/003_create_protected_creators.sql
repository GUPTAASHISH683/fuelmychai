CREATE TABLE IF NOT EXISTS protected_creators (
  id SERIAL PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  protected_usernames JSONB NOT NULL DEFAULT '[]',
  social_url VARCHAR(200),
  category VARCHAR(30) DEFAULT 'creator',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_protected_creators_display_name
ON protected_creators (display_name);

INSERT INTO protected_creators (display_name, protected_usernames, category) VALUES
('Carry Minati', '["carryminati","carry_minati","carryminati_real","carryminatiofficial"]', 'creator'),
('Bhuvan Bam', '["bhuvanbam","bhuvan_bam","bb_ki_vines","bbkivines"]', 'creator'),
('Technical Guruji', '["technicalguruji","technical_guruji","techguruji"]', 'creator'),
('Ashish Chanchlani', '["ashishchanchlani","ashish_chanchlani"]', 'creator'),
('Triggered Insaan', '["triggeredinsaan","triggered_insaan"]', 'creator'),
('Mythpat', '["mythpat","myth_pat"]', 'creator'),
('Razorpay', '["razorpay","razor_pay","razorpayofficial"]', 'brand'),
('PhonePe', '["phonepe","phone_pe","phonepeofficial"]', 'brand'),
('Google Pay', '["googlepay","google_pay","gpay","gpayofficial"]', 'brand'),
('Paytm', '["paytm","paytmofficial","paytm_official"]', 'brand'),
('NPCI', '["npci","npciofficial","upiofficial"]', 'government'),
('RBI', '["rbi","rbiofficial","reservebankindia"]', 'government'),
('Fuelmychai', '["fuelmychai","fuel_my_chai","fuelchai"]', 'brand')
ON CONFLICT (display_name) DO NOTHING;
