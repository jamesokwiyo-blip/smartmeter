/**
 * Script to check database users
 * Run: node check-database.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alain:drin12345@cluster0.fb45zjg.mongodb.net/smartmeter?retryWrites=true&w=majority';

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({}).select('fullName email phoneNumber createdAt').lean();
    
    console.log('========================================');
    console.log('USERS IN DATABASE:');
    console.log('========================================\n');
    
    if (users.length === 0) {
      console.log('No users found in database.');
      console.log('Create an account at: http://localhost:8082/create-account\n');
    } else {
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  Full Name: ${user.fullName}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Phone: ${user.phoneNumber || 'N/A'}`);
        console.log(`  Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log('');
      });
      
      console.log('========================================');
      console.log(`Total Users: ${users.length}`);
      console.log('========================================\n');
      console.log('⚠️  NOTE: Passwords are hashed and cannot be retrieved.');
      console.log('   If you forgot your password, you can:');
      console.log('   1. Create a new account with a different email');
      console.log('   2. Or implement a password reset feature\n');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
