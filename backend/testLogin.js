const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing User Login...\n');
    
    const credentials = {
      email: "test@example.com", 
      password: "password123"
    };
    
    console.log('Sending login request...');
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.data.user.name);
    console.log('Token received:', response.data.data.token ? 'Yes' : 'No');
    
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();