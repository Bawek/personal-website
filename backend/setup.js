#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('./models/User');
const Settings = require('./models/Settings');
require('dotenv').config();

async function setup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Create default admin user
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const adminUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // Change this after first login
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin user created:');
      console.log('  Email: admin@example.com');
      console.log('  Password: admin123');
      console.log('  IMPORTANT: Change this password after first login!');
    } else {
      console.log('Admin user already exists');
    }

    // Create default settings
    const settings = await Settings.getSettings();
    console.log('Default settings initialized');

    console.log('\nSetup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the backend: cd backend && npm run dev');
    console.log('2. Start the frontend: cd frontend && npm run dev');
    console.log('3. Visit http://localhost:3000/admin/login');
    console.log('4. Login with admin@example.com / admin123');
    console.log('5. Change the admin password immediately!');

  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

setup();
