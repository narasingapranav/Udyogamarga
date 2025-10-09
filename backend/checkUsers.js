const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

const checkUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/udyogamarga');
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('-password');
    console.log(`📊 Total users in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n👥 Users found:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    } else {
      console.log('❌ No users found in database');
    }

    // Check admin user specifically
    const adminUser = await User.findOne({ email: 'admin@udyogamarga.com' });
    if (adminUser) {
      console.log('\n👑 Admin user found:', {
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        id: adminUser._id
      });
    } else {
      console.log('\n❌ Admin user not found');
    }

  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
};

checkUsers();