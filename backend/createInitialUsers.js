const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/udyogamarga');
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@udyogamarga.com' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email: admin@udyogamarga.com');
      console.log('   Use this account to log in as admin');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'System Administrator',
      email: 'admin@udyogamarga.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      location: 'Head Office',
      role: 'admin'
    };

    const adminUser = new User(adminData);
    await adminUser.save();

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@udyogamarga.com');
    console.log('🔐 Password: admin123');
    console.log('👑 Role: admin');
    console.log('');
    console.log('You can now log in with these credentials to access admin features.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
};

// Also create an employee user for testing
const createEmployeeUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/udyogamarga');
    console.log('✅ Connected to MongoDB');

    // Check if employee user already exists
    const existingEmployee = await User.findOne({ email: 'employee@udyogamarga.com' });
    if (existingEmployee) {
      console.log('❌ Employee user already exists with email: employee@udyogamarga.com');
      return;
    }

    // Create employee user
    const employeeData = {
      name: 'HR Manager',
      email: 'employee@udyogamarga.com',
      password: 'employee123', // This will be hashed by the pre-save hook
      location: 'Mumbai Office',
      role: 'employee'
    };

    const employeeUser = new User(employeeData);
    await employeeUser.save();

    console.log('👔 Employee user created successfully!');
    console.log('📧 Email: employee@udyogamarga.com');
    console.log('🔐 Password: employee123');
    console.log('👤 Role: employee');

  } catch (error) {
    console.error('❌ Error creating employee user:', error.message);
  }
};

// Create both users
const createInitialUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/udyogamarga');
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@udyogamarga.com' });
    if (!existingAdmin) {
      const adminData = {
        name: 'System Administrator',
        email: 'admin@udyogamarga.com',
        password: 'admin123',
        location: 'Head Office',
        role: 'admin'
      };
      const adminUser = new User(adminData);
      await adminUser.save();
      console.log('🎉 Admin user created successfully!');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create employee user
    const existingEmployee = await User.findOne({ email: 'employee@udyogamarga.com' });
    if (!existingEmployee) {
      const employeeData = {
        name: 'HR Manager',
        email: 'employee@udyogamarga.com',
        password: 'employee123',
        location: 'Mumbai Office',
        role: 'employee'
      };
      const employeeUser = new User(employeeData);
      await employeeUser.save();
      console.log('👔 Employee user created successfully!');
    } else {
      console.log('ℹ️ Employee user already exists');
    }

    console.log('');
    console.log('=== LOGIN CREDENTIALS ===');
    console.log('Admin:');
    console.log('  📧 Email: admin@udyogamarga.com');
    console.log('  🔐 Password: admin123');
    console.log('  👑 Role: admin (full access)');
    console.log('');
    console.log('Employee:');
    console.log('  📧 Email: employee@udyogamarga.com');
    console.log('  🔐 Password: employee123');
    console.log('  👤 Role: employee (can create jobs/exams)');
    console.log('');
    console.log('Regular users can register through the frontend.');

  } catch (error) {
    console.error('❌ Error creating users:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
};

createInitialUsers();