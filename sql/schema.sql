-- tabel motif_batik
CREATE TABLE IF NOT EXISTS motif_batik (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  provinsi VARCHAR(100) NOT NULL,
  description TEXT,
  occasion TEXT,
  link_shop TEXT,
  link_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lalu tabel scan_histories
CREATE TABLE IF NOT EXISTS scan_histories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  motif_id VARCHAR(100) REFERENCES motif_batik(id),
  motif_name VARCHAR(60) NOT NULL,
  provinsi VARCHAR(30) NOT NULL,
  description TEXT,
  occasion TEXT,
  confidence_score INTEGER,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scan_histories_user_id ON scan_histories(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_histories_created_at ON scan_histories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_motif_batik_provinsi ON motif_batik(provinsi);
CREATE INDEX IF NOT EXISTS idx_motif_batik_name ON motif_batik(name);


-- RLS dan Trigger
-- Enable RLS
ALTER TABLE scan_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE motif_batik ENABLE ROW LEVEL SECURITY;

-- Policy untuk scan_histories
CREATE POLICY "Users can view own scan history" ON scan_histories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan history" ON scan_histories
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Function & Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_motif_batik_updated_at 
  BEFORE UPDATE ON motif_batik 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
