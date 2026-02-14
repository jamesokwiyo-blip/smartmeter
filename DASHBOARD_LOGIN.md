# Dashboard Login Credentials

## ⚠️ No Default Credentials

The dashboard uses **real authentication** with MongoDB. There are **no default username/password**.

## How to Access the Dashboard

### Option 1: Create a New Account (Recommended)

1. Go to: `http://localhost:8082` (or whatever port Vite is using)
2. Click **"Create Account"** or **"Sign Up"**
3. Fill in the form:
   - **Full Name**: Your name
   - **Email**: Your email address
   - **Phone Number**: Your phone number
   - **Password**: At least 8 characters
4. Submit the form
5. You'll be automatically logged in and redirected to the dashboard

### Option 2: Use Existing Account (If You Have One)

If you previously created an account, use:
- **Email**: The email you registered with
- **Password**: The password you set

## Existing Users in Database

The database may have these users (but passwords are hashed, so we can't tell you what they are):

1. **AMANI Alain**
   - Email: `amanialaindrin7@gmail.com`
   - Phone: `0737772282`

2. **Janvier Mariba**
   - Email: `janvmariba@gmail.com`
   - Phone: `0788512118`

3. **Kubwimana Erneste**
   - Email: `kubwimana@gmail.com`
   - Phone: `0784734734`

**Note**: We don't know the passwords for these accounts as they are hashed in the database.

## Quick Test Account Creation

To quickly test the dashboard:

1. Navigate to: `http://localhost:8082/create-account`
2. Enter:
   - **Full Name**: Test User
   - **Email**: test@example.com
   - **Phone**: 0781234567
   - **Password**: test1234 (or any password 8+ characters)
3. Click "Create Account"
4. You'll be logged in automatically

## Login Page

Once you have an account:
1. Go to: `http://localhost:8082/login`
2. Enter your email and password
3. Click "Sign In"

## Troubleshooting

### "Invalid email or password"
- Make sure you're using the correct email
- Check that the password is correct
- If you forgot, create a new account

### "Email already registered"
- That email is already in use
- Use a different email or try logging in with that email

### Can't access dashboard
- Make sure backend server is running on port 5000
- Check browser console (F12) for errors
- Verify MongoDB connection is working

## Summary

**There are NO default credentials.** You must:
1. ✅ Create a new account, OR
2. ✅ Use an existing account (if you know the password)

The easiest way is to create a new test account!
