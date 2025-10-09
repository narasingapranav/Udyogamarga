// Test script to verify API fixes
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test credentials (you'll need to update these)
const testUser = {
  email: 'test@example.com',
  password: 'test123'
};

let authToken = '';

async function loginUser() {
  try {
    console.log('🔐 Logging in test user...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testUser);
    authToken = response.data.token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    console.log('💡 You may need to register a test user first');
    return false;
  }
}

async function testExamRegistration(examId) {
  try {
    console.log(`\n📝 Testing exam registration for ID: ${examId}`);
    const response = await axios.post(
      `${BASE_URL}/exams/${examId}/register`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✅ Exam registration successful:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Exam registration failed:', error.response?.data?.message || error.message);
    console.log('Full error:', error.response?.data);
    return false;
  }
}

async function testJobApplication(jobId) {
  try {
    console.log(`\n💼 Testing job application for ID: ${jobId}`);
    const response = await axios.post(
      `${BASE_URL}/jobs/${jobId}/apply`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✅ Job application successful:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Job application failed:', error.response?.data?.message || error.message);
    console.log('Full error:', error.response?.data);
    return false;
  }
}

async function getExams() {
  try {
    console.log('\n📚 Fetching available exams...');
    const response = await axios.get(`${BASE_URL}/exams`);
    const exams = response.data.data;
    console.log(`Found ${exams.length} exams`);
    
    if (exams.length > 0) {
      console.log('First exam:', {
        id: exams[0]._id,
        title: exams[0].title,
        registrationDeadline: exams[0].registrationDeadline
      });
      return exams[0]._id;
    }
    return null;
  } catch (error) {
    console.log('❌ Failed to fetch exams:', error.response?.data?.message || error.message);
    return null;
  }
}

async function getJobs() {
  try {
    console.log('\n💼 Fetching available jobs...');
    const response = await axios.get(`${BASE_URL}/jobs`);
    const jobs = response.data.data;
    console.log(`Found ${jobs.length} jobs`);
    
    if (jobs.length > 0) {
      console.log('First job:', {
        id: jobs[0]._id,
        title: jobs[0].title,
        applicationDeadline: jobs[0].applicationDeadline
      });
      return jobs[0]._id;
    }
    return null;
  } catch (error) {
    console.log('❌ Failed to fetch jobs:', error.response?.data?.message || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Test login
  const loginSuccess = await loginUser();
  if (!loginSuccess) {
    console.log('\n💡 To run full tests, please:');
    console.log('1. Create a test user account');
    console.log('2. Update testUser credentials in this script');
    console.log('3. Make sure backend server is running');
    return;
  }
  
  // Test fetching data
  const examId = await getExams();
  const jobId = await getJobs();
  
  // Test exam registration if we have an exam
  if (examId) {
    await testExamRegistration(examId);
  } else {
    console.log('\n⚠️  No exams found to test registration');
  }
  
  // Test job application if we have a job
  if (jobId) {
    await testJobApplication(jobId);
  } else {
    console.log('\n⚠️  No jobs found to test application');
  }
  
  console.log('\n🏁 Tests completed!');
}

// Run the tests
runTests().catch(console.error);