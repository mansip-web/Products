-- QUICK FIX: Disable Email Confirmation for Testing
-- Run this in Supabase SQL Editor to allow signup without email confirmation

-- This is a Supabase setting, but we can verify the current state
-- You need to disable email confirmation in the Supabase Dashboard

-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard: https://app.supabase.com/project/qhgiqtowtgmreekgipud
-- 2. Navigate to: Authentication → Providers → Email
-- 3. Find "Confirm email" toggle
-- 4. DISABLE the "Confirm email" toggle
-- 5. Click "Save"

-- After disabling email confirmation:
-- - Users can login immediately after signup
-- - No need to click confirmation link
-- - Perfect for testing with Yopmail

-- Verify auth settings
SELECT 'Please disable email confirmation in Dashboard: Authentication → Providers → Email' AS instruction;
