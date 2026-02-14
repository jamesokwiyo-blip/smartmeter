import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smart-meter-secret-key-2024';

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Normalize email (lowercase)
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await db.getUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create user with normalized email
    const user = await db.createUser(fullName, normalizedEmail, phoneNumber, passwordHash);

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, fullName, email: normalizedEmail, phoneNumber }
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Provide more specific error messages
    if (error.code === 11000) {
      // MongoDB duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return res.status(400).json({ error: 'Email already registered' });
      }
      return res.status(400).json({ error: `${field} already exists` });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    // Generic error with more details in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Registration failed: ${error.message}` 
      : 'Registration failed. Please try again.';
    
    res.status(500).json({ error: errorMessage });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Forgot Password - Request reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await db.getUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists (security best practice)
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email, type: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token to user
    await db.saveResetToken(user._id, resetToken);

    // In production, send email with reset link
    // For now, return token in response (development only)
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    // Always return token unless explicitly in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.json({
      success: true,
      message: 'Password reset token generated',
      // In production, remove this and send email instead
      resetToken: isProduction ? undefined : resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset Password - Set new password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.type !== 'password-reset') {
        return res.status(400).json({ error: 'Invalid reset token' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Find user
    const user = await db.getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify token matches stored token
    if (user.resetToken !== token) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    // Check if token expired
    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    // Update password and clear reset token
    await db.updatePassword(decoded.userId, passwordHash);

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Verify token middleware
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export default router;
