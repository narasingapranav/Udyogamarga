const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Exam = require('../models/Exam');
const { auth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

// Apply authentication and admin authorization to all routes
router.use(auth);
router.use(adminOnly);

// Get dashboard statistics
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalExams = await Exam.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const upcomingExams = await Exam.countDocuments({ 
      date: { $gt: new Date() } 
    });

    // User role distribution
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Recent applications
    const recentApplications = await User.aggregate([
      { $unwind: '$appliedJobs' },
      { $sort: { 'appliedJobs.appliedAt': -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'jobs',
          localField: 'appliedJobs.job',
          foreignField: '_id',
          as: 'jobDetails'
        }
      },
      {
        $project: {
          userName: '$name',
          userEmail: '$email',
          jobTitle: { $arrayElemAt: ['$jobDetails.title', 0] },
          appliedAt: '$appliedJobs.appliedAt',
          status: '$appliedJobs.status'
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalExams,
        activeJobs,
        upcomingExams,
        usersByRole,
        recentApplications
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// User Management Routes

// Get all users with filtering and pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Update user role
router.put('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'employee', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Job Management Routes

// Get all jobs with applications
router.get('/jobs', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get application counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await User.countDocuments({
          'appliedJobs.job': job._id
        });
        return {
          ...job.toObject(),
          applicationCount
        };
      })
    );

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: {
        jobs: jobsWithCounts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get admin jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
});

// Delete job
router.delete('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Remove job from all users' applied jobs
    await User.updateMany(
      { 'appliedJobs.job': jobId },
      { $pull: { appliedJobs: { job: jobId } } }
    );

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job'
    });
  }
});

// Exam Management Routes

// Get all exams with registrations
router.get('/exams', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const exams = await Exam.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get registration counts for each exam
    const examsWithCounts = await Promise.all(
      exams.map(async (exam) => {
        const registrationCount = await User.countDocuments({
          'registeredExams.exam': exam._id
        });
        return {
          ...exam.toObject(),
          registrationCount
        };
      })
    );

    const total = await Exam.countDocuments(query);

    res.json({
      success: true,
      data: {
        exams: examsWithCounts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get admin exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exams'
    });
  }
});

// Delete exam
router.delete('/exams/:examId', async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findByIdAndDelete(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Remove exam from all users' registered exams
    await User.updateMany(
      { 'registeredExams.exam': examId },
      { $pull: { registeredExams: { exam: examId } } }
    );

    res.json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete exam'
    });
  }
});

module.exports = router;