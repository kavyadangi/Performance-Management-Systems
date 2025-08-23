import axios from 'axios';
import { AnalysisRequest, AnalysisResult, UploadResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for large file processing
});

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Add any authentication headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const analyzeData = async (request: AnalysisRequest): Promise<AnalysisResult> => {
  const response = await api.post('/analyze', request);
  return response.data;
};

export const getAnalysisStatus = async (jobId: string): Promise<{ status: string; progress: number }> => {
  const response = await api.get(`/status/${jobId}`);
  return response.data;
};

export const downloadResults = async (filename: string): Promise<Blob> => {
  const response = await api.get(`/download/${filename}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getSystemInfo = async (): Promise<{ version: string; status: string }> => {
  const response = await api.get('/info');
  return response.data;
};

export default api;
