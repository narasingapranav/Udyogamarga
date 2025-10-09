import api from './api';

export const examService = {
  // Get all exams with filters
  getExams: async (params = {}) => {
    try {
      const response = await api.get('/exams', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch exams' };
    }
  },

  // Get single exam by ID
  getExam: async (id) => {
    try {
      const response = await api.get(`/exams/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch exam' };
    }
  },

  // Create a new exam (Admin only)
  createExam: async (examData) => {
    try {
      const response = await api.post('/exams', examData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create exam' };
    }
  },

  // Update an exam (Admin only)
  updateExam: async (id, examData) => {
    try {
      const response = await api.put(`/exams/${id}`, examData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update exam' };
    }
  },

  // Delete an exam (Admin only)
  deleteExam: async (id) => {
    try {
      const response = await api.delete(`/exams/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete exam' };
    }
  },

  // Register for an exam
  registerForExam: async (id) => {
    try {
      const response = await api.post(`/exams/${id}/register`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to register for exam' };
    }
  },

  // Add notification to exam (Admin only)
  addNotification: async (id, notificationData) => {
    try {
      const response = await api.post(`/exams/${id}/notifications`, notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add notification' };
    }
  }
};