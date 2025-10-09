// Simple test script to verify API connectivity
const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 Testing UdyogaMarga API...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check passed:', healthResponse.data.message);
    
    // Test jobs endpoint
    console.log('\n2. Testing jobs endpoint...');
    const jobsResponse = await axios.get('http://localhost:5000/api/jobs');
    console.log('✅ Jobs endpoint working. Found', jobsResponse.data.data.jobs.length, 'jobs');
    
    // Test exams endpoint
    console.log('\n3. Testing exams endpoint...');
    const examsResponse = await axios.get('http://localhost:5000/api/exams');
    console.log('✅ Exams endpoint working. Found', examsResponse.data.data.exams.length, 'exams');
    
    console.log('\n🎉 All API tests passed! Your backend is working correctly.');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running on port 5000');
      console.log('   Run: npm start (in the backend directory)');
    }
  }
}

testAPI();