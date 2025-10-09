# UdyogaMarga - System Requirements Document

## 📋 Overview

This document outlines all the system requirements, dependencies, and setup instructions needed to run the UdyogaMarga Job and Exam Portal application successfully.

## 🖥️ System Requirements

### Operating System Support
- **Windows**: Windows 10/11 (recommended), Windows 8.1+
- **macOS**: macOS 10.14+ (Mojave or newer)
- **Linux**: Ubuntu 18.04+, CentOS 7+, or any modern Linux distribution

### Hardware Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 2GB free space for dependencies and development
- **CPU**: Any modern x64 processor (Intel/AMD)
- **Network**: Stable internet connection for package installation and MongoDB Atlas (if used)

## 🛠️ Core Software Dependencies

### 1. Node.js Runtime Environment
- **Required Version**: Node.js >= 14.0.0 (as specified in root package.json)
- **Recommended Version**: Node.js 18.x LTS or 20.x LTS
- **Download**: [https://nodejs.org/](https://nodejs.org/)
- **Verification Command**: `node --version`

### 2. NPM Package Manager
- **Required Version**: npm >= 6.0.0 (as specified in root package.json)
- **Recommended Version**: npm 9.x+ (comes with Node.js 18+)
- **Alternative**: Can use Yarn as package manager
- **Verification Command**: `npm --version`

### 3. MongoDB Database
Choose **ONE** of the following options:

#### Option A: MongoDB Atlas (Cloud - Recommended)
- **Type**: Cloud-hosted MongoDB service
- **Cost**: Free tier available (512MB storage)
- **Setup**: Create account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Advantages**: No local installation, automatic backups, scalable
- **Connection**: Requires internet connection

#### Option B: MongoDB Community Server (Local)
- **Required Version**: MongoDB 4.4+ (recommended 6.0+)
- **Download**: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **Storage**: Requires local disk space for database
- **Service**: Must run as a system service
- **Verification Command**: `mongod --version`

## 📦 Application Dependencies

### Root Project Dependencies
```json
{
  "devDependencies": {
    "concurrently": "^8.2.2"  // For running frontend and backend simultaneously
  }
}
```

### Backend Dependencies (Node.js/Express)
```json
{
  "dependencies": {
    "axios": "^1.12.2",           // HTTP client for API requests
    "bcryptjs": "^2.4.3",        // Password hashing
    "cors": "^2.8.5",            // Cross-Origin Resource Sharing
    "dotenv": "^16.3.1",         // Environment variables management
    "express": "^4.18.2",        // Web application framework
    "express-rate-limit": "^7.1.5", // Rate limiting middleware
    "express-validator": "^7.0.1",  // Input validation
    "helmet": "^7.1.0",          // Security headers
    "jsonwebtoken": "^9.0.2",    // JWT token authentication
    "mongoose": "^8.0.0"         // MongoDB object modeling
  },
  "devDependencies": {
    "nodemon": "^3.0.1"          // Development server auto-restart
  }
}
```

### Frontend Dependencies (React)
```json
{
  "dependencies": {
    "@testing-library/dom": "^10.4.1",      // Testing utilities
    "@testing-library/jest-dom": "^6.8.0",  // Jest DOM matchers
    "@testing-library/react": "^16.3.0",    // React testing utilities
    "@testing-library/user-event": "^13.5.0", // User interaction testing
    "axios": "^1.12.2",                     // HTTP client
    "react": "^19.1.1",                     // React library
    "react-dom": "^19.1.1",                 // React DOM renderer
    "react-scripts": "5.0.1",               // React build tools
    "web-vitals": "^2.1.4"                  // Performance metrics
  }
}
```

## 🔧 Environment Configuration

### Required Environment Variables (.env file)
Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/udyogamarga
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/udyogamarga

# Server Configuration
PORT=5000
NODE_ENV=development

# Client Configuration
CLIENT_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Security (Optional but recommended)
SESSION_SECRET=your-session-secret-here
```

### Environment Variable Descriptions
- **MONGODB_URI**: MongoDB connection string (local or Atlas)
- **PORT**: Backend server port (default: 5000)
- **NODE_ENV**: Environment mode (development/production)
- **CLIENT_URL**: Frontend application URL for CORS
- **JWT_SECRET**: Secret key for JWT token signing (must be secure in production)
- **JWT_EXPIRE**: JWT token expiration time
- **SESSION_SECRET**: Secret for session management (if implemented)

## 🚀 Installation Steps

### 1. System Prerequisites Installation

#### Install Node.js and npm
1. Download Node.js LTS from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation:
   ```bash
   node --version  # Should show v18.x.x or higher
   npm --version   # Should show 9.x.x or higher
   ```

#### Setup MongoDB
Choose your preferred option:

**Option A: MongoDB Atlas (Recommended)**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with read/write permissions
4. Whitelist your IP address or use 0.0.0.0/0 for development
5. Get connection string and update `.env` file

**Option B: Local MongoDB**
1. Download MongoDB Community Server
2. Install following the platform-specific instructions
3. Start MongoDB service:
   - **Windows**: Start as Windows service or run `mongod`
   - **macOS**: `brew services start mongodb-community` (if using Homebrew)
   - **Linux**: `sudo systemctl start mongod`

### 2. Project Setup

#### Quick Setup (Recommended)
```bash
# Clone or download the project
cd udyogamarga

# Install all dependencies (root, backend, frontend)
npm run install-all

# Start both frontend and backend
npm run dev
```

#### Manual Setup
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration
```bash
# Create environment file in backend directory
cd backend
cp .env.example .env  # If example exists, otherwise create new .env
# Edit .env file with your configuration
```

### 4. Database Setup (Optional)
```bash
# Run database seeder to populate sample data
cd backend
node seedData.js
```

## 🔍 Verification Steps

### 1. Verify Node.js Installation
```bash
node --version  # Expected: v14.0.0 or higher
npm --version   # Expected: v6.0.0 or higher
```

### 2. Verify Dependencies Installation
```bash
# Check if node_modules exists in all directories
ls node_modules          # Root dependencies
ls backend/node_modules  # Backend dependencies
ls frontend/node_modules # Frontend dependencies
```

### 3. Verify Database Connection
```bash
# Start backend server
cd backend
npm run dev

# Look for this message in console:
# ✅ Connected to MongoDB successfully
```

### 4. Verify Application Startup
```bash
# Start full application
npm run dev

# Expected output:
# - Backend: Server running on port 5000
# - Frontend: Compiled successfully! Opens http://localhost:3000
```

## 🌐 Network Requirements

### Development Ports
- **Frontend**: Port 3000 (React development server)
- **Backend**: Port 5000 (Express API server)
- **MongoDB**: Port 27017 (if running locally)

### Firewall Configuration
Ensure the following ports are not blocked:
- Port 3000 (React dev server)
- Port 5000 (Express API)
- Port 27017 (MongoDB, if local)

### Internet Requirements
- Required for package installation (npm install)
- Required for MongoDB Atlas connection
- Required for initial package downloads (~500MB+)

## 🔒 Security Considerations

### Development Environment
- Use strong JWT secrets (minimum 32 characters)
- Never commit `.env` files to version control
- Use HTTPS in production
- Regularly update dependencies

### Production Environment
- Use environment-specific `.env` files
- Enable MongoDB authentication
- Configure proper CORS origins
- Use process managers (PM2, Docker)
- Set up proper logging and monitoring

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution**: Ensure all dependencies are installed
```bash
npm run install-all
```

### Issue: MongoDB connection timeout
**Solutions**:
- Verify MongoDB service is running (local)
- Check MongoDB Atlas IP whitelist (cloud)
- Verify connection string format
- Check network connectivity

### Issue: Port already in use
**Solutions**:
- Change PORT in backend `.env` file
- Kill existing processes on ports 3000/5000
- Use different ports for development

### Issue: CORS errors in browser
**Solutions**:
- Verify CLIENT_URL in backend `.env`
- Ensure backend server is running
- Check browser network tab for API calls

## 📋 Development Tools (Optional)

### Recommended IDEs/Editors
- **Visual Studio Code** (with extensions: ES7+ React/Redux/React-Native snippets, Prettier, ESLint)
- **WebStorm**
- **Sublime Text**

### Useful Browser Extensions
- **React Developer Tools**
- **Redux DevTools** (if Redux is added later)
- **JSON Formatter**

### Database Management Tools
- **MongoDB Compass** (GUI for MongoDB)
- **Robo 3T** (Alternative MongoDB GUI)
- **MongoDB Atlas Web Interface** (for cloud databases)

## 📊 Performance Recommendations

### Development
- Use SSD storage for faster dependency installation
- Allocate sufficient RAM (8GB+ recommended)
- Close unnecessary applications during development

### Production
- Use Node.js 18+ LTS for better performance
- Enable compression middleware
- Configure proper caching headers
- Use CDN for static assets
- Monitor memory usage and performance metrics

## 🔄 Update & Maintenance

### Regular Maintenance Tasks
- Update Node.js to latest LTS version periodically
- Run `npm audit` to check for security vulnerabilities
- Update dependencies: `npm update` (be cautious with major version changes)
- Monitor MongoDB storage usage
- Backup database regularly

### Version Compatibility
- Test application after any Node.js major version updates
- Verify React compatibility when updating
- Check MongoDB driver compatibility with database version

---

## ✅ Quick Checklist

Before running the application, ensure:

- [ ] Node.js >= 14.0.0 installed
- [ ] npm >= 6.0.0 installed
- [ ] MongoDB (local or Atlas) accessible
- [ ] All dependencies installed (`npm run install-all`)
- [ ] `.env` file configured in backend directory
- [ ] Ports 3000 and 5000 available
- [ ] Internet connection available (for Atlas or package installs)

## 📞 Support

If you encounter issues not covered in this document:

1. Check the troubleshooting section in `README.md`
2. Verify all requirements are met
3. Check console logs for specific error messages
4. Ensure all environment variables are properly configured

---

**Last Updated**: October 2025
**Version**: 1.0.0