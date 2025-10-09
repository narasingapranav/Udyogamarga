const axios = require('axios');

const testExamRetrieval = async () => {
  try {
    console.log('🧪 Testing Exam Retrieval...\n');

    // First, login as employee to get token
    console.log('1. Logging in as employee...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'employee@udyogamarga.com',
      password: 'employee123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Employee login successful');

    // Test getting employee's exams
    console.log('\n2. Testing get my exams...');
    const myExamsResponse = await axios.get('http://localhost:5000/api/employee/my-exams', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (myExamsResponse.data.success) {
      console.log('✅ My exams retrieved successfully!');
      console.log(`📊 Found ${myExamsResponse.data.data.exams.length} exams:`);
      myExamsResponse.data.data.exams.forEach((exam, index) => {
        console.log(`   ${index + 1}. ${exam.title} (${exam.category}) - ${new Date(exam.date).toLocaleDateString()}`);
      });
    }

    // Test getting all exams (public route)
    console.log('\n3. Testing get all exams (public)...');
    const allExamsResponse = await axios.get('http://localhost:5000/api/exams');

    if (allExamsResponse.data.success) {
      console.log('✅ All exams retrieved successfully!');
      console.log(`📊 Found ${allExamsResponse.data.data.exams.length} public exams`);
    }

    // Test admin view
    console.log('\n4. Testing admin view of all exams...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@udyogamarga.com',
      password: 'admin123'
    });

    const adminToken = adminLoginResponse.data.data.token;
    const adminExamsResponse = await axios.get('http://localhost:5000/api/admin/exams', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (adminExamsResponse.data.success) {
      console.log('✅ Admin exams view successful!');
      console.log(`📊 Admin sees ${adminExamsResponse.data.data.exams.length} total exams`);
    }

  } catch (error) {
    console.error('❌ API test error:', error.response?.data || error.message);
  }
};

testExamRetrieval();