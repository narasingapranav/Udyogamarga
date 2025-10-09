# UdyogaMarga - Job and Exam Portal

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for job seekers and government exam candidates.

## 🚀 Quick Start

### Prerequisites
- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- MongoDB (local installation or MongoDB Atlas)

### Installation & Running

1. **Install all dependencies**
   ```bash
   npm run install-all
   ```

2. **Environment Setup**
   - Update `backend/.env` with your MongoDB URI and other settings

3. **Run both frontend and backend simultaneously**
   ```bash
   npm run dev
   ```
   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Available Scripts

- `npm run dev` - Run both frontend and backend simultaneously ⭐
- `npm run install-all` - Install dependencies for both projects
- `npm run server` - Run only backend
- `npm run client` - Run only frontend
- `npm run build` - Build frontend for production

## 🚀 Features

### Frontend (React)
- ✅ User registration and authentication
- ✅ Job browsing and application
- ✅ Exam browsing and registration
- ✅ User profile management
- ✅ Responsive design with clean CSS
- ✅ Real-time API integration

### Backend (Node.js + Express)
- ✅ REST API with full CRUD operations
- ✅ JWT-based authentication
- ✅ User roles (User, Admin)
- ✅ MongoDB integration with Mongoose
- ✅ Input validation and error handling
- ✅ Security middleware (CORS, Helmet, Rate Limiting)

### Database (MongoDB)
- ✅ User management with profiles
- ✅ Jobs with applications tracking
- ✅ Exams with registration system
- ✅ Optimized schemas with indexes

## 📋 Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one option:
   - **Option A**: Local MongoDB - [Download here](https://www.mongodb.com/try/download/community)
   - **Option B**: MongoDB Atlas (Free cloud database) - [Sign up here](https://www.mongodb.com/cloud/atlas)

## 🛠️ Installation & Setup

### 1. Clone or Download the Project
The project structure should look like:
```
udyogamarga/
├── frontend/     # React application
├── backend/      # Node.js API server
└── README.md
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Configure MongoDB** - Choose one option:

   **Option A: Local MongoDB**
   - Install MongoDB Community Server
   - Start MongoDB service
   - The `.env` file is already configured for local MongoDB

   **Option B: MongoDB Atlas (Recommended)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   - Update `.env` file:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/udyogamarga
     ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   You should see:
   ```
   🚀 Server running on port 5000
   📊 Environment: development
   🌐 Client URL: http://localhost:3000
   ✅ Connected to MongoDB successfully
   ```

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   
   The app will open at: `http://localhost:3000`

### 4. Populate Sample Data (Optional)

To add sample jobs and exams for testing:

```bash
cd backend
node seedData.js
```

This will create:
- An admin user (email: admin@udyogamarga.com, password: admin123)
- 3 sample jobs
- 2 sample exams

## 🎯 Usage

### For Users:
1. **Register**: Create a new account
2. **Browse Jobs**: View available job opportunities
3. **Apply for Jobs**: Submit applications (requires login)
4. **Browse Exams**: View upcoming government exams
5. **Register for Exams**: Register for exams (requires login)
6. **Profile Management**: Update personal information and skills

### For Admins:
- Admin users can create, update, and delete jobs and exams
- Access to user management features
- Add notifications to exams

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Admin only)
- `PUT /api/jobs/:id` - Update job (Admin only)
- `DELETE /api/jobs/:id` - Delete job (Admin only)
- `POST /api/jobs/:id/apply` - Apply for job

### Exams
- `GET /api/exams` - Get all exams (with filters)
- `GET /api/exams/:id` - Get single exam
- `POST /api/exams` - Create exam (Admin only)
- `PUT /api/exams/:id` - Update exam (Admin only)
- `DELETE /api/exams/:id` - Delete exam (Admin only)
- `POST /api/exams/:id/register` - Register for exam

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- CORS protection
- Rate limiting
- Security headers with Helmet
- XSS protection

## 🚧 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB service is running locally, OR
   - Check your MongoDB Atlas connection string
   - Verify network access in Atlas

2. **Frontend API Calls Failing**
   - Ensure backend is running on port 5000
   - Check CORS settings in backend

3. **Port Already in Use**
   - Backend: Change PORT in `.env` file
   - Frontend: React will prompt to use different port

### Development Tips:

1. **Backend Development**:
   ```bash
   cd backend
   npm run dev  # Uses nodemon for auto-restart
   ```

2. **Frontend Development**:
   - Hot reload is enabled by default
   - Check browser console for errors

3. **Database Management**:
   - Use MongoDB Compass for GUI management
   - MongoDB Atlas has built-in browser interface

## 📱 Screenshots

The application includes:
- Clean, responsive design
- Professional job cards
- Detailed exam information
- User-friendly forms
- Profile management interface

## 🔮 Future Enhancements

- [ ] File upload for resumes
- [ ] Advanced job filtering
- [ ] Email notifications
- [ ] Payment integration for exam fees
- [ ] Admin dashboard
- [ ] Real-time chat support
- [ ] Mobile app version

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

## 👥 Support

For support or questions:
- Check the troubleshooting section above
- Review the API documentation
- Ensure all prerequisites are installed correctly

---

**Happy coding! 🎉**