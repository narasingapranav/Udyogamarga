const axios = require('axios');

const testExamCreation = async () => {
  try {
    console.log('🧪 Testing Exam Creation...\n');

    // First, login as employee to get token
    console.log('1. Logging in as employee...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'employee@udyogamarga.com',
      password: 'employee123'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Employee login failed:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Employee login successful');

    // Test creating an exam
    console.log('\n2. Testing exam creation...');
    const examData = {
      title: "Sample Government Exam",
      description: "This is a test exam for government job preparation",
      category: "Government",
      date: "2025-12-01T09:00:00.000Z",
      duration: 120,
      totalMarks: 100,
      passingMarks: 40,
      instructions: "Please read all questions carefully before answering.",
      registrationDeadline: "2025-11-15T23:59:59.000Z"
    };

    const createResponse = await axios.post('http://localhost:5000/api/employee/exams', examData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (createResponse.data.success) {
      console.log('✅ Exam created successfully!');
      console.log('📋 Exam details:', {
        title: createResponse.data.data.exam.title,
        category: createResponse.data.data.exam.category,
        date: createResponse.data.data.exam.date,
        duration: createResponse.data.data.exam.duration
      });
    } else {
      console.log('❌ Exam creation failed:', createResponse.data.message);
    }

  } catch (error) {
    console.error('❌ API test error:', error.response?.data || error.message);
  }
};

testExamCreation();