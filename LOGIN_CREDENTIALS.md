# Login Credentials - Your Account

## Your Account Details

Based on the database, here is your account:

**Email**: `boyumvuhore@gmail.com`  
**Full Name**: YUMVUHORE  
**Phone**: 0782946444  
**Created**: February 12, 2026

## ⚠️ Password Information

**Passwords are securely hashed** and cannot be retrieved from the database. This is a security feature.

## Options to Login

### Option 1: Use "Forgot Password" Feature
1. Go to: `http://localhost:8082/login`
2. Click **"Forgot Password?"**
3. Enter your email: `boyumvuhore@gmail.com`
4. Copy the reset token shown
5. Go to Reset Password page
6. Enter token and set a new password
7. Login with your new password

### Option 2: Try Common Passwords
If you remember trying some passwords, try:
- Common passwords you might have used
- Check if you saved it in your browser password manager
- Check if you wrote it down somewhere

### Option 3: Create New Account
If you can't remember, you can create a new account with a different email address.

## All Users in Database

Here are all registered users (for reference):

1. **AMANI Alain** - amanialaindrin7@gmail.com
2. **Janvier Mariba** - janvmariba@gmail.com
3. **Kubwimana Erneste** - kubwimana@gmail.com
4. **Cyusa Marine** - marine@gmail.com
5. **Serge Kepler** - serge@gmail.com
6. **Chriss Muneza** - muneza@gmail.com
7. **Mpatswenumugabo Janvier** - janviermpatswenumugabo@gmail.com
8. **YUMVUHORE** - boyumvuhore@gmail.com ⬅️ **YOUR ACCOUNT**

## Network Error Fix

If you're getting "Network Error" when creating an account:

1. **Check Backend Server is Running**:
   ```powershell
   cd smartmeter
   npm run dev:server
   ```

2. **Restart Frontend** (to pick up API changes):
   ```powershell
   cd smartmeter
   npm run dev
   ```

3. **Check Browser Console** (F12):
   - Look for CORS errors
   - Check network tab for failed requests
   - Verify the request is going to `http://localhost:5000/api`

4. **Clear Browser Cache**:
   - Hard refresh: `Ctrl + Shift + R`
   - Or clear cache in browser settings
