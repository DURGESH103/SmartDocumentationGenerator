import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadZip = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE_URL}/upload/zip`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    },
  });
  
  return response.data;
};

export const uploadGithub = async (repoUrl) => {
  const response = await api.post('/upload/github', { repo_url: repoUrl });
  return response.data;
};

export const getDocumentation = async (docId) => {
  const response = await api.get(`/docs/${docId}`);
  return response.data;
};

export const listDocumentations = async () => {
  const response = await api.get('/docs/');
  return response.data;
};

export const downloadReadme = async (projectId, projectName) => {
  await api.post(`/projects/${projectId}/download`);
  window.open(`${API_BASE_URL}/docs/${projectId}/download`, '_blank');
};

// Project APIs
export const getProjects = async (params = {}) => {
  const response = await api.get('/projects/', { params });
  return response.data;
};

export const getProject = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};

export const getUserProjects = async () => {
  const response = await api.get('/projects/user/me');
  return response.data;
};

// Auth APIs
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Advanced Project APIs
export const getProjectDependencies = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/dependencies`);
  return response.data;
};

export const getProjectHealth = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/health`);
  return response.data;
};

export const getProjectInsights = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/insights`);
  return response.data;
};
