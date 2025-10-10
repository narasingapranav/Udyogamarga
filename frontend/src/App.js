import React, { useState, useEffect } from "react";
import "./App.css";
import { authService } from "./services/authService";
import { jobService } from "./services/jobService";
import { examService } from "./services/examService";
import { adminService } from "./services/adminService";
import { employeeService } from "./services/employeeService";

function App() {
  const [activeSection, setActiveSection] = useState("login");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    const isAuth = authService.isAuthenticated();
    
    if (currentUser && isAuth) {
      setUser(currentUser);
      setIsAuthenticated(true);
      setActiveSection("jobs"); // Show jobs by default for logged in users
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setActiveSection("jobs");
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setActiveSection("login");
  };

  return (
    <div className="app">
      {/* Navbar */}
      <header className="header">
        <div className="header-container">
          <h1 className="header-title">UdyogaMarga</h1>
          <nav className="nav">
            <button
              onClick={() => setActiveSection("jobs")}
              className="nav-button"
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveSection("exams")}
              className="nav-button"
            >
              Exams
            </button>
            {isAuthenticated ? (
              <>
                {/* Admin-only navigation */}
                {user?.role === 'admin' && (
                  <>
                    <button
                      onClick={() => setActiveSection("admin_dashboard")}
                      className="nav-button admin-nav"
                    >
                      Admin Dashboard
                    </button>
                    <button
                      onClick={() => setActiveSection("manage_users")}
                      className="nav-button admin-nav"
                    >
                      Manage Users
                    </button>
                  </>
                )}
                
                {/* Employee and Admin navigation */}
                {(user?.role === 'employee' || user?.role === 'admin') && (
                  <>
                    <button
                      onClick={() => setActiveSection("manage_jobs")}
                      className="nav-button employee-nav"
                    >
                      Manage Jobs
                    </button>
                    <button
                      onClick={() => setActiveSection("manage_exams")}
                      className="nav-button employee-nav"
                    >
                      Manage Exams
                    </button>
                  </>
                )}

                <button
                  onClick={() => setActiveSection("user_info")}
                  className="nav-button"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="nav-button"
                >
                  Logout ({user?.name} - {user?.role})
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveSection("login")}
                  className="nav-button"
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveSection("register")}
                  className="nav-button"
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        {activeSection === "login" && <LoginSection onLogin={handleLogin} />}
        {activeSection === "register" && <RegisterSection onRegister={handleLogin} />}
        {activeSection === "jobs" && <JobsSection isAuthenticated={isAuthenticated} user={user} />}
        {activeSection === "exams" && <ExamsSection isAuthenticated={isAuthenticated} user={user} />}
        {activeSection === "user_info" && isAuthenticated && <UserInfoSection user={user} />}
        
        {/* Admin-only sections */}
        {activeSection === "admin_dashboard" && isAuthenticated && user?.role === 'admin' && <AdminDashboard />}
        {activeSection === "manage_users" && isAuthenticated && user?.role === 'admin' && <ManageUsers />}
        
        {/* Employee and Admin sections */}
        {activeSection === "manage_jobs" && isAuthenticated && (user?.role === 'employee' || user?.role === 'admin') && <ManageJobs user={user} />}
        {activeSection === "manage_exams" && isAuthenticated && (user?.role === 'employee' || user?.role === 'admin') && <ManageExams user={user} />}
      </main>
    </div>
  );
}

/* ----- Components ----- */

function LoginSection({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);
      if (response.success) {
        onLogin(response.data.user);
      }
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-section">
      <h2 className="login-title">Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-input"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button 
          type="submit" 
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

function RegisterSection({ onRegister }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log('Attempting registration with:', formData);
      const response = await authService.register(formData);
      console.log('Registration response:', response);
      if (response.success) {
        onRegister(response.data.user);
      } else {
        setError(response.message || "Registration failed - no success flag");
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        const errorMessage = error.message || error.error || "Registration failed";
        setError(`Registration failed: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-section">
      <h2 className="login-title">Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="form-input"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          className="form-input"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
        />
        <input
          type="text"
          name="location"
          placeholder="Location (optional)"
          className="form-input"
          value={formData.location}
          onChange={handleChange}
        />
        <button 
          type="submit" 
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

function JobsSection({ isAuthenticated }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobs({ limit: 20 });
      if (response.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      alert("Please login to apply for jobs");
      return;
    }

    try {
      const response = await jobService.applyForJob(jobId);
      if (response.success) {
        alert("Application submitted successfully!");
      }
    } catch (error) {
      alert(error.message || "Failed to apply for job");
    }
  };

  if (loading) {
    return (
      <div className="jobs-section">
        <h2 className="section-title">Available Jobs</h2>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-section">
        <h2 className="section-title">Available Jobs</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={fetchJobs} className="primary-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="jobs-section">
      <h2 className="section-title">Available Jobs ({jobs.length})</h2>
      {jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="job-card"
            >
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">{job.company}</p>
              <p className="job-location">{job.location}</p>
              <p className="job-company">{job.jobType} • {job.experienceLevel}</p>
              <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '1rem' }}>
                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
              </p>
              <button 
                className="primary-button"
                onClick={() => handleApply(job._id)}
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? "Apply" : "Login to Apply"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExamsSection({ isAuthenticated }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examService.getExams({ limit: 20 });
      if (response.success) {
        setExams(response.data.exams);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (examId) => {
    if (!isAuthenticated) {
      alert("Please login to register for exams");
      return;
    }

    try {
      const response = await examService.registerForExam(examId);
      if (response.success) {
        alert(`Registration successful! Application Number: ${response.data.applicationNumber}`);
      }
    } catch (error) {
      alert(error.message || "Failed to register for exam");
    }
  };

  if (loading) {
    return (
      <div className="jobs-section">
        <h2 className="section-title">Upcoming Exams</h2>
        <p>Loading exams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-section">
        <h2 className="section-title">Upcoming Exams</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={fetchExams} className="primary-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="jobs-section">
      <h2 className="section-title">Upcoming Exams ({exams.length})</h2>
      {exams.length === 0 ? (
        <p>No exams available at the moment.</p>
      ) : (
        <ul className="exams-list">
          {exams.map((exam) => (
            <li key={exam._id} className="exam-item">
              <h3 className="exam-name">{exam.title}</h3>
              <p className="exam-date">
                Exam Date: {new Date(exam.date).toLocaleDateString()}
              </p>
              <p className="exam-date">
                Registration Ends: {new Date(exam.registrationDeadline).toLocaleDateString()}
              </p>
              <p className="exam-details">{exam.description}</p>
              <p className="exam-details">
                <strong>Category:</strong> {exam.category} | <strong>Duration:</strong> {exam.duration} minutes
              </p>
              <p className="exam-details">
                <strong>Total Marks:</strong> {exam.totalMarks} | <strong>Passing Marks:</strong> {exam.passingMarks}
              </p>
              <button 
                className="primary-button" 
                style={{ marginTop: '1rem' }}
                onClick={() => handleRegister(exam._id)}
                disabled={!isAuthenticated || new Date() > new Date(exam.registrationDeadline)}
              >
                {!isAuthenticated ? "Login to Register" : 
                 new Date() > new Date(exam.registrationDeadline) ? "Registration Closed" : "Register"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UserInfoSection({ user }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    location: user?.location || "",
    profile: {
      education: user?.profile?.education || "",
      experience: user?.profile?.experience || "",
      skills: user?.profile?.skills || [],
      phone: user?.profile?.phone || ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [profileField]: profileField === 'skills' ? value.split(',').map(s => s.trim()) : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.updateProfile(formData);
      if (response.success) {
        alert("Profile updated successfully!");
        setEditing(false);
      }
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <div className="profile-section">
        <h2 className="profile-title">Edit Profile</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Education:</label>
            <textarea
              name="profile.education"
              value={formData.profile.education}
              onChange={handleChange}
              className="form-input"
              rows="3"
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Experience:</label>
            <textarea
              name="profile.experience"
              value={formData.profile.experience}
              onChange={handleChange}
              className="form-input"
              rows="3"
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Skills (comma separated):</label>
            <input
              type="text"
              name="profile.skills"
              value={formData.profile.skills.join(', ')}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone:</label>
            <input
              type="tel"
              name="profile.phone"
              value={formData.profile.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="primary-button"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button 
              type="button" 
              onClick={() => setEditing(false)}
              className="primary-button"
              style={{ flex: 1, backgroundColor: '#6b7280' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <h2 className="profile-title">Profile Information</h2>
      <p className="profile-info"><span className="profile-label">Name:</span> {user?.name || 'Not provided'}</p>
      <p className="profile-info"><span className="profile-label">Email:</span> {user?.email || 'Not provided'}</p>
      <p className="profile-info"><span className="profile-label">Location:</span> {user?.location || 'Not provided'}</p>
      <p className="profile-info"><span className="profile-label">Role:</span> {user?.role || 'User'}</p>
      
      {user?.profile?.education && (
        <p className="profile-info"><span className="profile-label">Education:</span> {user.profile.education}</p>
      )}
      
      {user?.profile?.experience && (
        <p className="profile-info"><span className="profile-label">Experience:</span> {user.profile.experience}</p>
      )}
      
      {user?.profile?.skills && user.profile.skills.length > 0 && (
        <p className="profile-info"><span className="profile-label">Skills:</span> {user.profile.skills.join(', ')}</p>
      )}
      
      {user?.profile?.phone && (
        <p className="profile-info"><span className="profile-label">Phone:</span> {user.profile.phone}</p>
      )}
      
      <p className="profile-info">
        <span className="profile-label">Member since:</span> {new Date(user?.createdAt).toLocaleDateString()}
      </p>
      
      <button 
        className="primary-button"
        onClick={() => setEditing(true)}
      >
        Edit Profile
      </button>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card stat-card--users">
          <h3>Total Users</h3>
          <p className="stat-number">{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card stat-card--jobs">
          <h3>Total Jobs</h3>
          <p className="stat-number">{stats?.totalJobs || 0}</p>
        </div>
        <div className="stat-card stat-card--jobs">
          <h3>Active Jobs</h3>
          <p className="stat-number">{stats?.activeJobs || 0}</p>
        </div>
        <div className="stat-card stat-card--exams">
          <h3>Total Exams</h3>
          <p className="stat-number">{stats?.totalExams || 0}</p>
        </div>
        <div className="stat-card stat-card--exams">
          <h3>Upcoming Exams</h3>
          <p className="stat-number">{stats?.upcomingExams || 0}</p>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Applications</h3>
        <div className="applications-list">
          {stats?.recentApplications?.map((app, index) => (
            <div key={index} className="application-item">
              <span className="applicant-name">{app.userName}</span>
              <span className="job-title">{app.jobTitle}</span>
              <span className="application-date">{new Date(app.appliedAt).toLocaleDateString()}</span>
              <span className={`status ${app.status}`}>{app.status}</span>
            </div>
          )) || <p>No recent applications</p>}
        </div>
      </div>

      <div className="role-distribution">
        <h3>User Role Distribution</h3>
        <div className="roles-list">
          {stats?.usersByRole?.map((role, index) => (
            <div key={index} className="role-item">
              <span className="role-name">{role._id}</span>
              <span className="role-count">{role.count}</span>
            </div>
          )) || <p>No role data available</p>}
        </div>
      </div>
    </div>
  );
}

// Manage Users Component
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(page, 10, roleFilter, search);
      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const response = await adminService.updateUserRole(userId, newRole);
      if (response.success) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      setError(error.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await adminService.deleteUser(userId);
        if (response.success) {
          fetchUsers(); // Refresh the list
        }
      } catch (error) {
        setError(error.message || "Failed to delete user");
      }
    }
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="form-input"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <>
          <div className="users-table">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Location</span>
              <span>Actions</span>
            </div>
            {users.map((user) => (
              <div key={user._id} className="table-row">
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </span>
                <span>{user.location || 'N/A'}</span>
                <span>
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(page + 1)} 
              disabled={page >= totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Manage Jobs Component
function ManageJobs({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let response;
      if (user.role === 'admin') {
        response = await adminService.getAllJobs();
      } else {
        response = await employeeService.getMyJobs();
      }
      if (response.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        let response;
        if (user.role === 'admin') {
          response = await adminService.deleteJob(jobId);
        } else {
          response = await employeeService.deleteJob(jobId);
        }
        if (response.success) {
          fetchJobs();
        }
      } catch (error) {
        setError(error.message || "Failed to delete job");
      }
    }
  };

  return (
    <div className="manage-jobs">
      <div className="section-header">
        <h2>{user.role === 'admin' ? 'All Jobs' : 'My Jobs'}</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="primary-button"
        >
          {showCreateForm ? 'Cancel' : 'Create New Job'}
        </button>
      </div>

      {showCreateForm && <CreateJobForm onJobCreated={fetchJobs} onCancel={() => setShowCreateForm(false)} />}

      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : (
        <div className="jobs-table">
          <div className="table-header">
            <span>Title</span>
            <span>Company</span>
            <span>Location</span>
            <span>Applications</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {jobs.map((job) => (
            <div key={job._id} className="table-row">
              <span>{job.title}</span>
              <span>{job.company}</span>
              <span>{job.location}</span>
              <span>{job.applicationCount || 0}</span>
              <span className={`status ${job.status}`}>{job.status}</span>
              <span>
                <button 
                  onClick={() => handleDeleteJob(job._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Create Job Form Component
function CreateJobForm({ onJobCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    category: "Technology",
    description: "",
    requirements: "",
    experienceLevel: "Mid Level",
    applicationDeadline: "",
    contactEmail: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await employeeService.createJob(formData);
      if (response.success) {
        onJobCreated();
        onCancel();
      }
    } catch (error) {
      setError(error.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-form">
      <h3>Create New Job</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            required
          />
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
        <div className="form-row">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Government">Government</option>
            <option value="Other">Other</option>
          </select>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Executive">Executive</option>
          </select>
        </div>
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows="4"
          required
        />
        <textarea
          name="requirements"
          placeholder="Job Requirements"
          value={formData.requirements}
          onChange={handleChange}
          className="form-textarea"
          rows="4"
          required
        />
        <div className="form-row">
          <input
            type="datetime-local"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email (optional)"
            value={formData.contactEmail}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </button>
          <button type="button" onClick={onCancel} className="secondary-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Manage Exams Component
function ManageExams({ user }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      let response;
      if (user.role === 'admin') {
        response = await adminService.getAllExams();
      } else {
        response = await employeeService.getMyExams();
      }
      if (response.success) {
        setExams(response.data.exams);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        let response;
        if (user.role === 'admin') {
          response = await adminService.deleteExam(examId);
        } else {
          response = await employeeService.deleteExam(examId);
        }
        if (response.success) {
          fetchExams();
        }
      } catch (error) {
        setError(error.message || "Failed to delete exam");
      }
    }
  };

  return (
    <div className="manage-exams">
      <div className="section-header">
        <h2>{user.role === 'admin' ? 'All Exams' : 'My Exams'}</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="primary-button"
        >
          {showCreateForm ? 'Cancel' : 'Create New Exam'}
        </button>
      </div>

      {showCreateForm && <CreateExamForm onExamCreated={fetchExams} onCancel={() => setShowCreateForm(false)} />}

      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading exams...</div>
      ) : (
        <div className="exams-table">
          <div className="table-header">
            <span>Title</span>
            <span>Category</span>
            <span>Date</span>
            <span>Duration</span>
            <span>Registrations</span>
            <span>Actions</span>
          </div>
          {exams.map((exam) => (
            <div key={exam._id} className="table-row">
              <span>{exam.title}</span>
              <span>{exam.category}</span>
              <span>{new Date(exam.date).toLocaleDateString()}</span>
              <span>{exam.duration} minutes</span>
              <span>{exam.registrationCount || 0}</span>
              <span>
                <button 
                  onClick={() => handleDeleteExam(exam._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Create Exam Form Component
function CreateExamForm({ onExamCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Government",
    date: "",
    duration: 120,
    totalMarks: 100,
    passingMarks: 40,
    instructions: "",
    registrationDeadline: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await employeeService.createExam(formData);
      if (response.success) {
        onExamCreated();
        onCancel();
      }
    } catch (error) {
      setError(error.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-exam-form">
      <h3>Create New Exam</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Exam Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., SSC CGL 2025, UPSC Civil Services, Bank PO Exam"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Government">Government</option>
              <option value="Banking">Banking</option>
              <option value="Railway">Railway</option>
              <option value="SSC">SSC</option>
              <option value="UPSC">UPSC</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="form-field">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            placeholder="Provide detailed information about the exam, eligibility criteria, syllabus overview, and important notes for candidates..."
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Exam Date & Time *</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
            <small className="form-help">Select the date and time when the exam will be conducted</small>
          </div>
          <div className="form-field">
            <label className="form-label">Duration (minutes) *</label>
            <input
              type="number"
              name="duration"
              placeholder="e.g., 120 for 2 hours, 180 for 3 hours"
              value={formData.duration}
              onChange={handleChange}
              className="form-input"
              min="30"
              required
            />
            <small className="form-help">Total time allowed for the exam</small>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Total Marks *</label>
            <input
              type="number"
              name="totalMarks"
              placeholder="e.g., 100, 200, 300"
              value={formData.totalMarks}
              onChange={handleChange}
              className="form-input"
              min="1"
              required
            />
            <small className="form-help">Maximum marks for the entire exam</small>
          </div>
          <div className="form-field">
            <label className="form-label">Passing Marks *</label>
            <input
              type="number"
              name="passingMarks"
              placeholder="e.g., 40, 50, 60"
              value={formData.passingMarks}
              onChange={handleChange}
              className="form-input"
              min="1"
              required
            />
            <small className="form-help">Minimum marks required to pass</small>
          </div>
        </div>
        <div className="form-field">
          <label className="form-label">Exam Instructions</label>
          <textarea
            name="instructions"
            placeholder="e.g., Bring photo ID, no mobile phones allowed, report 30 minutes early..."
            value={formData.instructions}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
          />
          <small className="form-help">Important instructions for exam candidates</small>
        </div>
        <div className="form-field">
          <label className="form-label">Registration Deadline *</label>
          <input
            type="datetime-local"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            className="form-input"
            required
          />
          <small className="form-help">Last date and time for exam registration</small>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Creating..." : "Create Exam"}
          </button>
          <button type="button" onClick={onCancel} className="secondary-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
