# Signup Database Error - Solutions

## Common Issues and Fixes

### Issue 1: Email Confirmation Required (Most Common)

Supabase by default requires email confirmation. Users must click a link in their email before they can sign in.

**Solution Options:**

#### Option A: Disable Email Confirmation (For Development)

1. Go to your Supabase Dashboard: https://qhgiqtowtgmreekgipud.supabase.co
2. Navigate to **Authentication** → **Providers** → **Email**
3. Scroll down to **"Confirm email"**
4. **Disable** the "Confirm email" toggle
5. Save changes

#### Option B: Handle Email Confirmation in Code (Recommended for Production)

Update the signup flow to inform users about email confirmation.

---

### Issue 2: Missing Users Table / Metadata

If you need to store additional user information (like roles), you need a `users` or `user_roles` table.

**SQL Migration to Run in Supabase:**

```sql
-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own role
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Allow inserts for authenticated users
CREATE POLICY "Allow insert for authenticated users"
  ON user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

### Issue 3: CORS or Network Errors

Check if the Supabase URL and keys are correct.

**Current Configuration:**

- URL: `https://qhgiqtowtgmreekgipud.supabase.co`
- Anon Key: Set in `.env` and `supabaseClient.jsx`

---

## How to Apply the Fix

### Step 1: Check Supabase Dashboard Settings

1. Visit: https://app.supabase.com/project/qhgiqtowtgmreekgipud
2. Go to **Authentication** → **Providers** → **Email**
3. Disable "Confirm email" for testing

### Step 2: Run SQL Migration (If needed)

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste the SQL from "Issue 2" above
3. Click **Run**

### Step 3: Test Signup

1. Clear browser cache/cookies
2. Try signing up with a new email
3. Check for errors in browser console (F12)

---

## Updated Signup Component (With Better Error Handling)

See the updated `SignUp.jsx` file that provides better error messages and handles email confirmation.

---

## Debugging Tips

1. **Check Browser Console**: Press F12 and look at Console tab for errors
2. **Check Network Tab**: Look for failed API requests to Supabase
3. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs → Auth Logs
   - Look for failed signup attempts
4. **Common Error Messages**:
   - "User already registered" - Email is already in use
   - "Invalid email" - Email format is wrong
   - "Password too short" - Password must be at least 6 characters
   - "Email not confirmed" - User hasn't clicked confirmation link

---

## Next Steps

1. Apply the fixes above
2. Test signup with a new email address
3. If still having issues, check the browser console and share the exact error message
