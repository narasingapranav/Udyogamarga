const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    maxlength: [100, 'Exam title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Exam description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    enum: ['Government', 'Banking', 'Railway', 'SSC', 'UPSC', 'Engineering', 'Other'],
    required: [true, 'Exam category is required']
  },
  date: {
    type: Date,
    required: [true, 'Exam date is required']
  },
  duration: {
    type: Number,
    required: [true, 'Exam duration is required'],
    min: [30, 'Duration must be at least 30 minutes']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [1, 'Total marks must be at least 1']
  },
  passingMarks: {
    type: Number,
    required: [true, 'Passing marks is required'],
    min: [1, 'Passing marks must be at least 1']
  },
  instructions: {
    type: String,
    maxlength: [2000, 'Instructions cannot be more than 2000 characters']
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Registration deadline is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient searches
examSchema.index({ title: 'text', description: 'text' });
examSchema.index({ category: 1, date: 1 });
examSchema.index({ registrationDeadline: 1, isActive: 1 });

module.exports = mongoose.model('Exam', examSchema);