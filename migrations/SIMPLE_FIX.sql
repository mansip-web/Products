-- ALTERNATIVE FIX: Remove the trigger entirely
-- This is the SIMPLEST solution - just remove the problematic trigger
-- Users won't have roles in the database, but the app will still work

-- Step 1: Drop the trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Drop the user_roles table (optional - only if you don't need roles)
-- Uncomment the line below if you want to remove the table completely
-- DROP TABLE IF EXISTS user_roles CASCADE;

-- That's it! Now signup should work without database errors.
-- The app will treat all users as regular users (not admins).

SELECT 'Trigger removed! Signup should work now.' AS status;
