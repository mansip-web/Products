-- Create a view to show user emails with their roles
-- Run this in Supabase SQL Editor

CREATE OR REPLACE VIEW user_list AS
SELECT 
  ur.id,
  ur.user_id,
  ur.role,
  ur.created_at,
  au.email,
  au.last_sign_in_at,
  au.created_at as auth_created_at
FROM user_roles ur
LEFT JOIN auth.users au ON ur.user_id = au.id;

-- Grant access to authenticated users
GRANT SELECT ON user_list TO authenticated;

-- Verify the view
SELECT * FROM user_list;
