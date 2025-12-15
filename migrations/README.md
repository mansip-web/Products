# Database Migrations

This folder contains all SQL migration scripts for the Product Filter Dashboard.

## 📋 Migration Files

### Core Setup

- **`COMPLETE_SETUP.sql`** - ⭐ **Run this first!** Sets up both wishlist and cart tables
- **`supabase_migration.sql`** - Initial products table setup

### Feature-Specific Migrations

- **`WISHLIST_MIGRATION.sql`** - Wishlist table and RLS policies
- **`CART_MIGRATION.sql`** - Cart table with quantity management and RLS policies
- **`user_roles_migration.sql`** - User roles table for admin/user distinction

### Authentication & User Management

- **`FIX_SIGNUP_DATABASE_ERROR.sql`** - Fixes signup trigger and RLS policies
- **`SIMPLE_FIX.sql`** - Alternative fix (removes trigger)
- **`DISABLE_EMAIL_CONFIRMATION.sql`** - Instructions to disable email confirmation
- **`ADMIN_USER_SCRIPTS.sql`** - Scripts to manage admin users

## 🚀 Quick Start

### For New Setup:

1. Run `COMPLETE_SETUP.sql` in Supabase SQL Editor

   - This creates both wishlist and cart tables
   - Sets up all RLS policies
   - Grants necessary permissions

2. If you need user roles:

   - Run `user_roles_migration.sql`
   - Or run `FIX_SIGNUP_DATABASE_ERROR.sql` for the complete fix

3. To make a user admin:
   - Use scripts from `ADMIN_USER_SCRIPTS.sql`

### For Existing Setup:

- If you already have some tables, run individual migration files as needed
- Check which tables exist first: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`

## 📝 Usage

### Running Migrations

1. **Open Supabase Dashboard**

   - Go to your project: https://app.supabase.com
   - Navigate to SQL Editor

2. **Copy SQL Script**

   - Open the migration file you need
   - Copy all the SQL code

3. **Run in SQL Editor**
   - Paste into Supabase SQL Editor
   - Click "RUN"
   - Verify success message

## ⚠️ Important Notes

- **Run migrations in order** if setting up from scratch
- **Backup your database** before running migrations in production
- **Test in development** first
- Some migrations may drop and recreate tables (check comments)

## 🔍 Migration Details

### COMPLETE_SETUP.sql

Creates:

- `wishlist` table
- `cart` table
- RLS policies for both
- Auto-update trigger for cart

### WISHLIST_MIGRATION.sql

Creates:

- `wishlist` table
- RLS policies (view, add, remove)
- Grants permissions

### CART_MIGRATION.sql

Creates:

- `cart` table with quantity field
- RLS policies (view, add, update, remove)
- Auto-update trigger for `updated_at`
- Grants permissions

### user_roles_migration.sql

Creates:

- `user_roles` table
- RLS policies
- Trigger for automatic role assignment
- Default role: 'user'

## 🆘 Troubleshooting

### "Table already exists"

- Use `DROP TABLE IF EXISTS` or skip that migration
- Or modify the script to use `CREATE TABLE IF NOT EXISTS`

### "Permission denied"

- Make sure you're running as the database owner
- Check RLS policies are correct

### "Foreign key violation"

- Ensure referenced tables exist first
- Run migrations in the correct order

## 📚 Related Documentation

- [Wishlist Feature Guide](../WISHLIST_SETUP.txt)
- [Cart Feature Guide](../CART_SETUP.txt)
- [Admin Setup Guide](../ADMIN_QUICK_GUIDE.txt)

---

**Last Updated:** 2025-12-12
