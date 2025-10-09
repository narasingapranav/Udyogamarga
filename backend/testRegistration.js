const axios = require('axios');

async function testRegistration() {
  try {
    console.log('🧪 Testing User Registration...\n');
    
    const userData = {
      name: "Test User",
      email: "test@example.com", 
      password: "password123",
      location: "Test City"
    };
    
    console.log('Sending registration request...');
    const response = await axios.post('http://localhost:5000/api/auth/register', userData);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    
    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend server might not be running on port 5000');
    }
  }
}

testRegistration();