# Documentation & Guides

This folder contains all troubleshooting guides, setup instructions, and fix documentation for the Product Filter Dashboard.

## 📚 Quick Reference

### 🚀 Setup Guides

- **`COMPLETE_SETUP_GUIDE.txt`** - ⭐ Complete setup for wishlist + cart
- **`WISHLIST_SETUP.txt`** - Wishlist feature setup
- **`CART_SETUP.txt`** - Shopping cart setup
- **`ADMIN_SETUP.md`** - Admin user setup guide
- **`ADMIN_QUICK_GUIDE.txt`** - Quick admin reference

### 🔧 Fix & Troubleshooting

- **`HOW_TO_FIX.md`** - General troubleshooting guide
- **`SIGNUP_FIX.md`** - Signup issues and solutions
- **`WISHLIST_ERROR_FIX.txt`** - "Failed to add to wishlist" fix
- **`EMAIL_LOGIN_FIX_SUMMARY.txt`** - Email confirmation & login fixes
- **`QUICK_FIX_GUIDE.txt`** - Quick fixes for common issues

## 🎯 Common Issues

### "Failed to add to wishlist"

→ See: `WISHLIST_ERROR_FIX.txt`
→ Solution: Run `COMPLETE_SETUP.sql` from `/migrations/`

### "Failed to add to cart"

→ See: `CART_SETUP.txt`
→ Solution: Run `COMPLETE_SETUP.sql` from `/migrations/`

### Signup Database Error

→ See: `SIGNUP_FIX.md`
→ Solution: Run `FIX_SIGNUP_DATABASE_ERROR.sql` from `/migrations/`

### Email Confirmation Issues

→ See: `EMAIL_LOGIN_FIX_SUMMARY.txt`
→ Solution: Check email settings in Supabase

### Need Admin Access

→ See: `ADMIN_SETUP.md` or `ADMIN_QUICK_GUIDE.txt`
→ Solution: Run scripts from `ADMIN_USER_SCRIPTS.sql` in `/migrations/`

## 📖 How to Use These Guides

1. **Identify your issue** from the list above
2. **Open the relevant guide** file
3. **Follow the step-by-step instructions**
4. **Check the `/migrations/` folder** for SQL scripts mentioned

## 🔗 Related Folders

- **`/migrations/`** - SQL migration scripts
- **`/src/`** - Application source code
- **`/.gemini/antigravity/brain/`** - Detailed artifact guides

## 💡 Tips

- Most issues can be solved by running `COMPLETE_SETUP.sql`
- Always refresh your browser after running SQL scripts
- Check browser console (F12) for detailed error messages
- Refer to the artifact guides for comprehensive documentation

---

**Last Updated:** 2025-12-12
