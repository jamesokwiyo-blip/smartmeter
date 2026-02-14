import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Meter from '../models/Meter.js';
import Purchase from '../models/Purchase.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../db.json');

async function migrateData() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alain:drin12345@cluster0.fb45zjg.mongodb.net/smartmeter?retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Read JSON file
    const jsonData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    console.log('📄 Read db.json successfully');

    // Create a mapping of old user IDs to new MongoDB ObjectIds
    const userIdMap = {};

    // Migrate Users
    console.log('\n🔄 Migrating users...');
    for (const oldUser of jsonData.users) {
      const newUser = await User.create({
        fullName: oldUser.fullName,
        email: oldUser.email,
        phoneNumber: oldUser.phoneNumber,
        passwordHash: oldUser.passwordHash,
        createdAt: new Date(oldUser.createdAt)
      });
      userIdMap[oldUser.id] = newUser._id;
      console.log(`  ✓ Migrated user: ${oldUser.email}`);
    }

    // Migrate Meters
    console.log('\n🔄 Migrating meters...');
    for (const oldMeter of jsonData.meters) {
      await Meter.create({
        userId: userIdMap[oldMeter.userId],
        meterNumber: oldMeter.meterNumber,
        createdAt: new Date(oldMeter.createdAt)
      });
      console.log(`  ✓ Migrated meter: ${oldMeter.meterNumber}`);
    }

    // Migrate Purchases
    console.log('\n🔄 Migrating purchases...');
    for (const oldPurchase of jsonData.purchases) {
      await Purchase.create({
        userId: userIdMap[oldPurchase.userId],
        meterNumber: oldPurchase.meterNumber,
        amountRWF: oldPurchase.amountRWF,
        kwhAmount: oldPurchase.kwhAmount,
        paymentMethod: oldPurchase.paymentMethod,
        mobileNumber: oldPurchase.mobileNumber,
        tokenNumber: oldPurchase.tokenNumber,
        rechargeCode: oldPurchase.rechargeCode,
        status: oldPurchase.status,
        date: oldPurchase.date,
        createdAt: new Date(oldPurchase.createdAt)
      });
      console.log(`  ✓ Migrated purchase: ${oldPurchase.tokenNumber}`);
    }

    console.log('\n✅ Data migration completed successfully!');
    console.log(`   - Users: ${jsonData.users.length}`);
    console.log(`   - Meters: ${jsonData.meters.length}`);
    console.log(`   - Purchases: ${jsonData.purchases.length}`);

    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateData();
