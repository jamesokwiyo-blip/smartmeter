# Registration Error Troubleshooting

## Error: "Registration failed. Please try again."

This generic error can have several causes. Here's how to diagnose and fix it:

## Common Causes

### 1. Email Already Exists
**Error**: "Email already registered"

**Solution**: Use a different email address, or use the Forgot Password feature to reset your existing account.

### 2. Database Connection Issue
**Error**: MongoDB connection failed

**Check**:
- Is the backend server running? (`npm run dev:server`)
- Is MongoDB Atlas connection string correct?
- Check server console for connection errors

### 3. Validation Error
**Error**: "All fields are required" or field-specific errors

**Solution**: Make sure all fields are filled:
- Full Name
- Email (valid format)
- Phone Number
- Password (minimum 8 characters)
- Confirm Password (must match)

### 4. Network/CORS Error
**Error**: CORS or network connection failed

**Check**:
- Backend server is running on port 5000
- Frontend is configured to connect to correct API URL
- Check browser console (F12) for CORS errors

## How to Debug

### Step 1: Check Server Console
Look at the backend server terminal for detailed error messages:
```
Register error: [actual error details]
```

### Step 2: Check Browser Console
Open browser DevTools (F12) → Console tab:
- Look for network errors
- Check API request/response

### Step 3: Check Network Tab
Open browser DevTools (F12) → Network tab:
- Find the `/api/auth/register` request
- Check the response status and body
- Look for error details

## Improved Error Handling

I've updated the code to show more specific error messages:

- ✅ "Email already registered" - if email exists
- ✅ Field validation errors - if fields are invalid
- ✅ Detailed errors in development mode
- ✅ Better error logging

## Quick Fixes

### Try a Different Email
If you get "Email already registered", use:
- A different email address
- Or reset password for existing account

### Check Server Status
```powershell
# Make sure backend is running
cd smartmeter
npm run dev:server
```

### Test Registration with curl
```powershell
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test123@example.com",
    "phoneNumber": "0781234567",
    "password": "test1234"
  }'
```

## Next Steps

1. Check the backend server console for the actual error
2. Try registration again with a different email
3. Check browser console (F12) for detailed errors
4. Verify all fields are filled correctly

The improved error handling will now show more specific error messages to help identify the issue.
