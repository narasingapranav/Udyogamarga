const mongoose = require('mongoose');
const User = require('./src/models/User');
const Job = require('./src/models/Job');
const Exam = require('./src/models/Exam');
require('dotenv').config();

// Sample data
const sampleJobs = [
  {
    title: "Software Engineer",
    company: "Tech Corp",
    location: "Bangalore",
    jobType: "Full-time",
    category: "Technology",
    description: "We are looking for a skilled Software Engineer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.",
    requirements: "Bachelor's degree in Computer Science, 2+ years experience in JavaScript, React, Node.js. Strong problem-solving skills.",
    experienceLevel: "Mid Level",
    salary: { min: 800000, max: 1200000, currency: "INR" },
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    contactEmail: "hr@techcorp.com"
  },
  {
    title: "Data Analyst",
    company: "Data Insights",
    location: "Hyderabad",
    jobType: "Full-time",
    category: "Technology",
    description: "Join our data team to analyze complex datasets and provide insights that drive business decisions.",
    requirements: "Bachelor's degree in Statistics, Mathematics, or related field. Experience with Python, SQL, and data visualization tools.",
    experienceLevel: "Entry Level",
    salary: { min: 500000, max: 800000, currency: "INR" },
    skills: ["Python", "SQL", "Excel", "Tableau"],
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    contactEmail: "careers@datainsights.com"
  },
  {
    title: "Web Developer",
    company: "Creative Studio",
    location: "Remote",
    jobType: "Remote",
    category: "Technology",
    description: "Remote position for a creative web developer to build stunning websites and web applications.",
    requirements: "Experience with HTML, CSS, JavaScript, and modern frameworks. Portfolio required.",
    experienceLevel: "Mid Level",
    salary: { min: 600000, max: 1000000, currency: "INR" },
    skills: ["HTML", "CSS", "JavaScript", "React", "WordPress"],
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    contactEmail: "jobs@creativestudio.com"
  }
];

const sampleExams = [
  {
    name: "Graduate Aptitude Test in Engineering",
    shortName: "GATE 2025",
    description: "GATE is a national level examination for admission to postgraduate programs in engineering and technology.",
    category: "Engineering",
    conductingBody: "Indian Institute of Technology",
    eligibility: {
      education: "Bachelor's degree in Engineering/Technology or currently in final year",
      ageLimit: { min: 18, max: 35 },
      nationality: "Indian"
    },
    examDates: {
      registrationStart: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      registrationEnd: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      resultDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
    },
    applicationFee: {
      general: 1800,
      obc: 1800,
      scst: 900
    },
    examPattern: {
      mode: "Online",
      duration: "3 hours",
      totalMarks: 100,
      subjects: ["Mathematics", "General Aptitude", "Engineering Subject"],
      negativeMarking: true
    },
    syllabus: "Mathematics: Linear Algebra, Calculus, Differential Equations, Probability and Statistics. General Aptitude: Verbal Ability, Numerical Ability. Engineering Subject: Based on the discipline chosen.",
    officialWebsite: "https://gate.iitr.ac.in"
  },
  {
    name: "Staff Selection Commission Combined Graduate Level Exam",
    shortName: "SSC CGL",
    description: "SSC CGL is conducted for recruitment to various Group B and Group C posts in government departments and ministries.",
    category: "SSC",
    conductingBody: "Staff Selection Commission",
    eligibility: {
      education: "Bachelor's degree from a recognized university",
      ageLimit: { min: 18, max: 32 },
      nationality: "Indian"
    },
    examDates: {
      registrationStart: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      registrationEnd: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      examDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
      resultDate: new Date(Date.now() + 130 * 24 * 60 * 60 * 1000)
    },
    applicationFee: {
      general: 100,
      obc: 100,
      scst: 0
    },
    examPattern: {
      mode: "Online",
      duration: "4 hours (across 4 tiers)",
      totalMarks: 200,
      subjects: ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English Comprehension"],
      negativeMarking: true
    },
    syllabus: "Tier-1: General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension. Tier-2: Mathematics, English Language & Comprehension, Statistics, General Studies.",
    officialWebsite: "https://ssc.nic.in"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create admin user
    const adminUser = await User.findOne({ email: 'admin@udyogamarga.com' });
    let admin;
    
    if (!adminUser) {
      admin = new User({
        name: 'Admin User',
        email: 'admin@udyogamarga.com',
        password: 'admin123',
        role: 'admin',
        location: 'India'
      });
      await admin.save();
      console.log('Admin user created');
    } else {
      admin = adminUser;
      console.log('Admin user already exists');
    }

    // Clear existing jobs and exams
    await Job.deleteMany({});
    await Exam.deleteMany({});
    console.log('Cleared existing data');

    // Add sample jobs
    const jobs = sampleJobs.map(job => ({
      ...job,
      postedBy: admin._id
    }));
    
    await Job.insertMany(jobs);
    console.log(`${jobs.length} sample jobs created`);

    // Add sample exams
    const exams = sampleExams.map(exam => ({
      ...exam,
      createdBy: admin._id
    }));
    
    await Exam.insertMany(exams);
    console.log(`${exams.length} sample exams created`);

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: admin@udyogamarga.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();