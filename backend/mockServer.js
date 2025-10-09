const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock users array (for testing without database)
let mockUsers = [];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Registration endpoint (mock)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, location } = req.body;
    
    console.log('Registration attempt:', { name, email, location });
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create mock user
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      location: location || '',
      role: 'user',
      createdAt: new Date()
    };
    
    mockUsers.push({ ...newUser, password }); // Store with password for login
    
    // Mock token
    const token = 'mock-jwt-token-' + Date.now();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser, // Don't send password back
        token
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login endpoint (mock)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const userResponse = { ...user };
    delete userResponse.password;
    
    const token = 'mock-jwt-token-' + Date.now();
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log(`📊 Environment: development`);
  console.log(`🌐 Client URL: http://localhost:3000`);
  console.log(`✅ Mock database ready (in-memory)`);
});