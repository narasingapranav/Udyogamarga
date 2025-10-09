const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Exam = require('../models/Exam');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { adminAndEmployee } = require('../middleware/roleAuth');

// Apply authentication and employee/admin authorization to all routes
router.use(auth);
router.use(adminAndEmployee);

// Job Management for Employees

// Create a new job
router.post('/jobs', async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    await job.populate('postedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create job'
    });
  }
});

// Get jobs created by current employee
router.get('/my-jobs', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { postedBy: req.user._id };

    if (status) query.status = status;

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
    console.error('Get employee jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your jobs'
    });
  }
});

// Update job (only own jobs)
router.put('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findOne({ 
      _id: jobId, 
      postedBy: req.user._id 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you do not have permission to edit it'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email');

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job: updatedJob }
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update job'
    });
  }
});

// Delete job (only own jobs)
router.delete('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findOne({ 
      _id: jobId, 
      postedBy: req.user._id 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you do not have permission to delete it'
      });
    }

    await Job.findByIdAndDelete(jobId);

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

// Get applications for employee's jobs
router.get('/job-applications/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Verify employee owns this job
    const job = await Job.findOne({ 
      _id: jobId, 
      postedBy: req.user._id 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you do not have permission to view applications'
      });
    }

    const matchStage = {
      'appliedJobs.job': job._id
    };

    if (status) {
      matchStage['appliedJobs.status'] = status;
    }

    const applications = await User.aggregate([
      { $match: matchStage },
      { $unwind: '$appliedJobs' },
      { $match: { 'appliedJobs.job': job._id } },
      {
        $project: {
          name: 1,
          email: 1,
          location: 1,
          profile: 1,
          appliedAt: '$appliedJobs.appliedAt',
          status: '$appliedJobs.status'
        }
      },
      { $sort: { appliedAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ]);

    const total = await User.countDocuments(matchStage);

    res.json({
      success: true,
      data: {
        job: {
          title: job.title,
          company: job.company
        },
        applications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications'
    });
  }
});

// Update application status
router.put('/applications/:userId/:jobId/status', async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    const { status } = req.body;

    if (!['applied', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Verify employee owns this job
    const job = await Job.findOne({ 
      _id: jobId, 
      postedBy: req.user._id 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you do not have permission'
      });
    }

    const user = await User.findOneAndUpdate(
      { 
        _id: userId,
        'appliedJobs.job': jobId 
      },
      { 
        $set: { 'appliedJobs.$.status': status } 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
});

// Exam Management for Employees

// Create a new exam
router.post('/exams', async (req, res) => {
  try {
    const examData = {
      ...req.body,
      createdBy: req.user._id
    };

    const exam = new Exam(examData);
    await exam.save();

    await exam.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: { exam }
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create exam'
    });
  }
});

// Get exams created by current employee
router.get('/my-exams', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = { createdBy: req.user._id };

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
    console.error('Get employee exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your exams'
    });
  }
});

// Update exam (only own exams)
router.put('/exams/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    
    const exam = await Exam.findOne({ 
      _id: examId, 
      createdBy: req.user._id 
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found or you do not have permission to edit it'
      });
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Exam updated successfully',
      data: { exam: updatedExam }
    });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update exam'
    });
  }
});

// Delete exam (only own exams)
router.delete('/exams/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    
    const exam = await Exam.findOne({ 
      _id: examId, 
      createdBy: req.user._id 
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found or you do not have permission to delete it'
      });
    }

    await Exam.findByIdAndDelete(examId);

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

// Get exam registrations
router.get('/exam-registrations/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify employee owns this exam
    const exam = await Exam.findOne({ 
      _id: examId, 
      createdBy: req.user._id 
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found or you do not have permission to view registrations'
      });
    }

    const registrations = await User.aggregate([
      { $match: { 'registeredExams.exam': exam._id } },
      { $unwind: '$registeredExams' },
      { $match: { 'registeredExams.exam': exam._id } },
      {
        $project: {
          name: 1,
          email: 1,
          location: 1,
          profile: 1,
          registeredAt: '$registeredExams.registeredAt'
        }
      },
      { $sort: { registeredAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ]);

    const total = await User.countDocuments({
      'registeredExams.exam': exam._id
    });

    res.json({
      success: true,
      data: {
        exam: {
          title: exam.title,
          date: exam.date,
          duration: exam.duration
        },
        registrations,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get exam registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exam registrations'
    });
  }
});

module.exports = router;