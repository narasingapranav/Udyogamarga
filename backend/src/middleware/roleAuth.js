const User = require('../models/User');

// Middleware to check if user has required role
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // User is already loaded by auth middleware
      const user = req.user;
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user role is in allowed roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${user.role}`
        });
      }

      // Add user role to request for further use
      req.userRole = user.role;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};

// Pre-defined role combinations
const adminOnly = authorize('admin');
const adminAndEmployee = authorize('admin', 'employee');
const allRoles = authorize('user', 'employee', 'admin');

// Helper function to check if user can access resource
const canAccess = {
  // Admin permissions
  manageUsers: (role) => role === 'admin',
  manageAllJobs: (role) => role === 'admin',
  manageAllExams: (role) => role === 'admin',
  viewAnalytics: (role) => role === 'admin',
  assignRoles: (role) => role === 'admin',
  
  // Employee permissions
  createJobs: (role) => ['admin', 'employee'].includes(role),
  createExams: (role) => ['admin', 'employee'].includes(role),
  viewApplications: (role) => ['admin', 'employee'].includes(role),
  manageOwnContent: (role) => ['admin', 'employee'].includes(role),
  
  // User permissions
  applyForJobs: (role) => ['user', 'employee', 'admin'].includes(role),
  registerForExams: (role) => ['user', 'employee', 'admin'].includes(role),
  viewJobs: (role) => ['user', 'employee', 'admin'].includes(role),
  viewExams: (role) => ['user', 'employee', 'admin'].includes(role)
};

module.exports = {
  authorize,
  adminOnly,
  adminAndEmployee,
  allRoles,
  canAccess
};