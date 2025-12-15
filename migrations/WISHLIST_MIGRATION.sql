-- Create Wishlist Table for User Dashboard
-- Run this in Supabase SQL Editor

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own wishlist
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
CREATE POLICY "Users can view own wishlist"
  ON wishlist
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can add to their own wishlist
DROP POLICY IF EXISTS "Users can add to own wishlist" ON wishlist;
CREATE POLICY "Users can add to own wishlist"
  ON wishlist
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove from their own wishlist
DROP POLICY IF EXISTS "Users can remove from own wishlist" ON wishlist;
CREATE POLICY "Users can remove from own wishlist"
  ON wishlist
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON wishlist TO authenticated;

-- Verify setup
SELECT 'Wishlist table created successfully!' AS status;
