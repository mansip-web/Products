-- ============================================================
-- ADMIN USER SETUP - Quick Scripts
-- ============================================================

-- ============================================================
-- STEP 1: Make a User Admin
-- ============================================================
-- Replace 'YOUR_ADMIN_EMAIL' with the actual admin email address

INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL'),
  'admin'
)
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';

-- Example:
-- INSERT INTO user_roles (user_id, role)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'admin@yopmail.com'),
--   'admin'
-- )
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';


-- ============================================================
-- STEP 2: Verify Admin Role
-- ============================================================
-- Check if the user has admin role

SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'YOUR_ADMIN_EMAIL';


-- ============================================================
-- STEP 3: View All Users and Roles
-- ============================================================
-- See all users in your system with their roles

SELECT 
  u.email,
  COALESCE(ur.role, 'user') as role,
  u.created_at,
  u.confirmed_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;


-- ============================================================
-- ADDITIONAL SCRIPTS
-- ============================================================

-- Make Multiple Users Admin
-- ------------------------------------------------------------
INSERT INTO user_roles (user_id, role)
VALUES 
  ((SELECT id FROM auth.users WHERE email = 'admin1@example.com'), 'admin'),
  ((SELECT id FROM auth.users WHERE email = 'admin2@example.com'), 'admin'),
  ((SELECT id FROM auth.users WHERE email = 'admin3@example.com'), 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';


-- Change Admin Back to Regular User
-- ------------------------------------------------------------
UPDATE user_roles
SET role = 'user'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL');


-- Make a User Regular (Ensure they have 'user' role)
-- ------------------------------------------------------------
INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'YOUR_USER_EMAIL'),
  'user'
)
ON CONFLICT (user_id) 
DO UPDATE SET role = 'user';


-- Delete User Role Entry (User will default to user dashboard)
-- ------------------------------------------------------------
DELETE FROM user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL');


-- Check Specific User's Role
-- ------------------------------------------------------------
SELECT 
  u.email,
  u.id as user_id,
  ur.role,
  ur.id as role_id
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'YOUR_EMAIL';


-- List All Users (No Roles)
-- ------------------------------------------------------------
SELECT 
  email, 
  id, 
  created_at,
  confirmed_at
FROM auth.users 
ORDER BY created_at DESC;


-- Count Users by Role
-- ------------------------------------------------------------
SELECT 
  COALESCE(ur.role, 'no role') as role,
  COUNT(*) as count
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY ur.role
ORDER BY count DESC;


-- ============================================================
-- USAGE INSTRUCTIONS
-- ============================================================
-- 1. Open Supabase Dashboard: https://app.supabase.com/project/qhgiqtowtgmreekgipud
-- 2. Go to SQL Editor
-- 3. Copy the script you need
-- 4. Replace 'YOUR_ADMIN_EMAIL' or 'YOUR_EMAIL' with actual email
-- 5. Click RUN
-- 6. Verify the result
-- ============================================================
