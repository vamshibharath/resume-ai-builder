import axios from 'axios';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeResume = async (resumeText: string, jobDescription: string, companyName?: string) => {
  const response = await apiClient.post('/analyze', {
    resume_text: resumeText,
    job_description: jobDescription,
    company_name: companyName || null,
  });
  return response.data;
};

export const optimizeResume = async (resumeText: string, jobDescription: string) => {
  const response = await apiClient.post('/optimize', {
    resume_text: resumeText,
    job_description: jobDescription,
  });
  return response.data;
};

export const extractKeywords = async (jobDescription: string) => {
  const formData = new FormData();
  formData.append('job_description', jobDescription);
  
  const response = await apiClient.post('/keywords/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const parseResume = async (resumeText: string) => {
  const formData = new FormData();
  formData.append('resume_text', resumeText);
  
  const response = await apiClient.post('/parse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const researchCompany = async (companyName: string, industry: string) => {
  const formData = new FormData();
  formData.append('company_name', companyName);
  formData.append('industry', industry);
  
  const response = await apiClient.post('/company/research', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
