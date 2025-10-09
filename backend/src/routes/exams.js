const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Exam = require('../models/Exam');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/exams
// @desc    Get all exams with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().trim(),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Get exams with pagination
    const exams = await Exam.find(filter)
      .populate('createdBy', 'name email')
      .sort({ 'examDates.examDate': 1 })
      .skip(skip)
      .limit(limit);

    const total = await Exam.countDocuments(filter);

    res.json({
      success: true,
      data: {
        exams,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exams'
    });
  }
});

// @route   GET /api/exams/:id
// @desc    Get single exam by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('registeredCandidates.user', 'name email');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.json({
      success: true,
      data: { exam }
    });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exam'
    });
  }
});

// @route   POST /api/exams
// @desc    Create a new exam
// @access  Private (Admin only)
router.post('/', adminAuth, [
  body('name').trim().notEmpty().withMessage('Exam name is required'),
  body('shortName').trim().notEmpty().withMessage('Short name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['Engineering', 'Banking', 'SSC', 'UPSC', 'State Government', 'Other']).withMessage('Invalid category'),
  body('conductingBody').trim().notEmpty().withMessage('Conducting body is required'),
  body('eligibility.education').trim().notEmpty().withMessage('Education eligibility is required'),
  body('examDates.registrationStart').isISO8601().withMessage('Valid registration start date is required'),
  body('examDates.registrationEnd').isISO8601().withMessage('Valid registration end date is required'),
  body('examDates.examDate').isISO8601().withMessage('Valid exam date is required'),
  body('examPattern.mode').isIn(['Online', 'Offline', 'Both']).withMessage('Invalid exam mode'),
  body('examPattern.duration').trim().notEmpty().withMessage('Exam duration is required'),
  body('examPattern.totalMarks').isInt({ min: 1 }).withMessage('Total marks must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

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
      message: 'Server error while creating exam'
    });
  }
});

// @route   PUT /api/exams/:id
// @desc    Update an exam
// @access  Private (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.json({
      success: true,
      message: 'Exam updated successfully',
      data: { exam }
    });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating exam'
    });
  }
});

// @route   DELETE /api/exams/:id
// @desc    Delete an exam
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting exam'
    });
  }
});

// @route   POST /api/exams/:id/register
// @desc    Register for an exam
// @access  Private
router.post('/:id/register', auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if registration deadline has passed
    if (new Date() > exam.examDates.registrationEnd) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed'
      });
    }

    // Check if user has already registered
    const hasRegistered = exam.registeredCandidates.some(candidate => 
      candidate.user.toString() === req.user._id.toString()
    );

    if (hasRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this exam'
      });
    }

    // Generate application number
    const applicationNumber = `${exam.shortName}${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Add registration to exam
    exam.registeredCandidates.push({
      user: req.user._id,
      registeredAt: new Date(),
      applicationNumber
    });

    // Add exam to user's registered exams
    const user = await User.findById(req.user._id);
    user.registeredExams.push({
      exam: exam._id,
      registeredAt: new Date()
    });

    await Promise.all([exam.save(), user.save()]);

    res.json({
      success: true,
      message: 'Registration successful',
      data: { applicationNumber }
    });
  } catch (error) {
    console.error('Register exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while registering for exam'
    });
  }
});

// @route   POST /api/exams/:id/notifications
// @desc    Add notification to exam
// @access  Private (Admin only)
router.post('/:id/notifications', adminAuth, [
  body('title').trim().notEmpty().withMessage('Notification title is required'),
  body('content').trim().notEmpty().withMessage('Notification content is required'),
  body('isImportant').optional().isBoolean().withMessage('isImportant must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    exam.notifications.push({
      title: req.body.title,
      content: req.body.content,
      isImportant: req.body.isImportant || false,
      date: new Date()
    });

    await exam.save();

    res.json({
      success: true,
      message: 'Notification added successfully',
      data: { exam }
    });
  } catch (error) {
    console.error('Add notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding notification'
    });
  }
});

module.exports = router;