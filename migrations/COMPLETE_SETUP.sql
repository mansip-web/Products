-- ============================================================
-- COMPLETE SETUP: Wishlist + Cart Tables
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PART 1: WISHLIST TABLE
-- ============================================================

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

-- ============================================================
-- PART 2: CART TABLE
-- ============================================================

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

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Verify both tables were created
SELECT 
  'Setup Complete! ✅' as status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'wishlist') as wishlist_created,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'cart') as cart_created;

-- Show all policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('wishlist', 'cart')
ORDER BY tablename, policyname;
