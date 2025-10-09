const axios = require('axios');

const testAdminAPI = async () => {
  try {
    console.log('🧪 Testing Admin API...\n');

    // First, login as admin to get token
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@udyogamarga.com',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Admin login failed:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Admin login successful');

    // Test getting all users
    console.log('\n2. Testing get all users API...');
    const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (usersResponse.data.success) {
      console.log('✅ Users API successful');
      console.log(`📊 Found ${usersResponse.data.data.users.length} users:`);
      usersResponse.data.data.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
    } else {
      console.log('❌ Users API failed:', usersResponse.data.message);
    }

    // Test dashboard stats
    console.log('\n3. Testing dashboard stats API...');
    const statsResponse = await axios.get('http://localhost:5000/api/admin/dashboard-stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (statsResponse.data.success) {
      console.log('✅ Dashboard stats API successful');
      const stats = statsResponse.data.data;
      console.log(`📊 Stats: ${stats.totalUsers} users, ${stats.totalJobs} jobs, ${stats.totalExams} exams`);
    } else {
      console.log('❌ Dashboard stats API failed:', statsResponse.data.message);
    }

  } catch (error) {
    console.error('❌ API test error:', error.response?.data || error.message);
  }
};

testAdminAPI();