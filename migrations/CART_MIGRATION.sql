-- Create Cart Table for User Dashboard
-- Run this in Supabase SQL Editor

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own cart
DROP POLICY IF EXISTS "Users can view own cart" ON cart;
CREATE POLICY "Users can view own cart"
  ON cart
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can add to their own cart
DROP POLICY IF EXISTS "Users can add to own cart" ON cart;
CREATE POLICY "Users can add to own cart"
  ON cart
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own cart
DROP POLICY IF EXISTS "Users can update own cart" ON cart;
CREATE POLICY "Users can update own cart"
  ON cart
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can remove from their own cart
DROP POLICY IF EXISTS "Users can remove from own cart" ON cart;
CREATE POLICY "Users can remove from own cart"
  ON cart
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON cart TO authenticated;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS cart_updated_at ON cart;
CREATE TRIGGER cart_updated_at
  BEFORE UPDATE ON cart
  FOR EACH ROW
  EXECUTE FUNCTION update_cart_updated_at();

-- Verify setup
SELECT 'Cart table created successfully!' AS status;
