# 🔧 Fix: "Database error saving new user"

## Problem

The error occurs because there's a **database trigger** that tries to insert a user role when someone signs up, but the **Row Level Security (RLS) policies** are blocking it.

---

## ✅ SOLUTION 1: Fix the Trigger (Recommended)

This keeps the role system working.

### Steps:

1. **Go to Supabase Dashboard**

   - URL: https://app.supabase.com/project/qhgiqtowtgmreekgipud
   - Navigate to **SQL Editor**

2. **Run this SQL script**

   - Open the file: `FIX_SIGNUP_DATABASE_ERROR.sql`
   - Copy all the SQL code
   - Paste it in the SQL Editor
   - Click **RUN**

3. **Test Signup**
   - Go to http://localhost:5173/signup
   - Try signing up with a new email
   - Should work now! ✅

### What this does:

- Fixes the RLS policies to allow the trigger to insert user roles
- Adds `SECURITY DEFINER` to the trigger function (runs with admin privileges)
- Adds error handling so signup doesn't fail even if role creation fails

---

## ✅ SOLUTION 2: Remove the Trigger (Simplest)

This removes the role system entirely. All users will be treated as regular users.

### Steps:

1. **Go to Supabase Dashboard**

   - URL: https://app.supabase.com/project/qhgiqtowtgmreekgipud
   - Navigate to **SQL Editor**

2. **Run this SQL**

   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   DROP FUNCTION IF EXISTS public.handle_new_user();
   ```

3. **Update Login.jsx** (optional)
   - Remove the role check code
   - Always redirect to user dashboard

### What this does:

- Removes the problematic trigger
- Signup will work immediately
- No role-based routing (everyone goes to user dashboard)

---

## 🎯 Which Solution to Choose?

### Choose **Solution 1** if:

- ✅ You need admin/user role separation
- ✅ You want admin dashboard access control
- ✅ You're willing to run a SQL script

### Choose **Solution 2** if:

- ✅ You just want signup to work ASAP
- ✅ You don't need role-based access control
- ✅ Everyone can use the same dashboard

---

## 🧪 After Applying the Fix

1. **Clear browser cache** (Ctrl + Shift + Delete)
2. **Try signing up** with a new email
3. **Check for errors** in browser console (F12)
4. If still having issues, check Supabase logs:
   - Dashboard → Logs → Auth Logs

---

## 📝 Why This Happened

The `ADMIN_SETUP.md` file shows that a trigger was set up to automatically assign roles to new users. However, the RLS policies were too restrictive and blocked the trigger from inserting into the `user_roles` table.

The fix adds `SECURITY DEFINER` to the function, which allows it to bypass RLS policies and insert the role successfully.

---

## Need Help?

If you're still seeing errors after applying these fixes:

1. Share the exact error message from the browser console
2. Check Supabase Auth Logs for more details
3. Verify the SQL script ran successfully (no errors in SQL Editor)
