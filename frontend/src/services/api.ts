import axios from 'axios';
import { AnalysisRequest, AnalysisResult, UploadResponse } from '../types';

const api = axios.create({
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

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const analyzeData = async (request: AnalysisRequest): Promise<AnalysisResult> => {
  const response = await api.post('/api/analyze', request);
  return response.data;
};

export const uploadAndAnalyze = async (file: File, contamination: number = 0.1, randomState: number = 42): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('contamination', contamination.toString());
  formData.append('randomState', randomState.toString());

  const response = await api.post('/api/upload-and-analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 600000, // 10 minutes for large file processing
  });

  return response.data;
};

export const uploadAndAnalyzeSummary = async (file: File, contamination: number = 0.1, randomState: number = 42): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('contamination', contamination.toString());
  formData.append('randomState', randomState.toString());

  const response = await api.post('/api/upload-and-analyze-summary', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 600000, // 10 minutes for large file processing
  });

  return response.data;
};

export const getAnalysisStatus = async (jobId: string): Promise<{ status: string; progress: number }> => {
  const response = await api.get(`/api/status/${jobId}`);
  return response.data;
};

export const downloadResults = async (filename: string): Promise<Blob> => {
  const response = await api.get(`/api/download/${filename}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getSystemInfo = async (): Promise<{ version: string; status: string }> => {
  const response = await api.get('/api/info');
  return response.data;
};

export default api;
