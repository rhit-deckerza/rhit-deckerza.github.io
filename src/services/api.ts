import axios, { AxiosRequestConfig } from 'axios';

// Create a simplified API for local storage operations only
const api = {
  baseURL: 'localStorage'
};

// Resume API methods (using localStorage only)
export const resumeApi = {
  saveResume: async (resumeData: any) => {
    try {
      // Store in localStorage
      localStorage.setItem('currentResumeData', JSON.stringify(resumeData));
      return resumeData;
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  },

  getResumes: () => {
    try {
      // Get from localStorage
      const storedData = localStorage.getItem('currentResumeData');
      if (storedData) {
        return JSON.parse(storedData);
      }
      return null;
    } catch (error) {
      console.error('Error getting resumes:', error);
      return null;
    }
  }
};

export default api; 