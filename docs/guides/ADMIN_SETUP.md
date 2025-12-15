# Admin Setup Instructions

## Quick Setup (3 Steps)

### Step 1: Run the SQL Script in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own role
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Auto-assign 'user' role on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

5. Click **Run**

### Step 2: Sign Up Your Admin User

1. Go to your app: `http://localhost:5173`
2. Click "Create one" to sign up
3. Enter your admin email and password
4. Sign up (you'll be redirected to user dashboard for now)

### Step 3: Make User Admin Using SQL

Go back to Supabase SQL Editor and run:

```sql
-- Replace 'your-admin@email.com' with your actual email
INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-admin@email.com'),
  'admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

**That's it!** Now when you login with that email, you'll be routed to Admin Dashboard automatically! 🎉

## How It Works

### Automatic Routing

The `Login.jsx` component now:

1. Checks the user's role in `user_roles` table
2. If role is `'admin'` → redirects to `/admin-dashboard`
3. If role is `'user'` or no role → redirects to `/user-dashboard`

### New Users

- All new signups automatically get `'user'` role
- They are routed to User Dashboard
- Only users you manually set as admin get Admin Dashboard access

## Testing

1. **Test Admin Login:**

   - Login with admin email
   - Should redirect to Admin Dashboard
   - Can access Product Management

2. **Test Regular User:**
   - Sign up a new user
   - Should redirect to User Dashboard
   - Cannot access Admin Dashboard

## Make Another User Admin

```sql
INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'another-admin@email.com'),
  'admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## View All Users and Roles

```sql
SELECT
  u.email,
  COALESCE(ur.role, 'user') as role,
  u.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
```

## Remove Admin Role

```sql
UPDATE user_roles
SET role = 'user'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@email.com');
```

---

**Note:** The `npm run setup-admin` script is available but requires Service Role Key. The SQL method above is simpler and recommended.
