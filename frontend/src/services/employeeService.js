import api from './api';

export const employeeService = {
  // Job Management
  createJob: async (jobData) => {
    try {
      const response = await api.post('/employee/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create job' };
    }
  },

  getMyJobs: async (page = 1, limit = 10, status = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      });
      
      const response = await api.get(`/employee/my-jobs?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your jobs' };
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/employee/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update job' };
    }
  },

  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/employee/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete job' };
    }
  },

  getJobApplications: async (jobId, page = 1, limit = 10, status = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      });
      
      const response = await api.get(`/employee/job-applications/${jobId}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job applications' };
    }
  },

  updateApplicationStatus: async (userId, jobId, status) => {
    try {
      const response = await api.put(`/employee/applications/${userId}/${jobId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update application status' };
    }
  },

  // Exam Management
  createExam: async (examData) => {
    try {
      const response = await api.post('/employee/exams', examData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create exam' };
    }
  },

  getMyExams: async (page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      const response = await api.get(`/employee/my-exams?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your exams' };
    }
  },

  updateExam: async (examId, examData) => {
    try {
      const response = await api.put(`/employee/exams/${examId}`, examData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update exam' };
    }
  },

  deleteExam: async (examId) => {
    try {
      const response = await api.delete(`/employee/exams/${examId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete exam' };
    }
  },

  getExamRegistrations: async (examId, page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      const response = await api.get(`/employee/exam-registrations/${examId}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch exam registrations' };
    }
  }
};