import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadZip = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_BASE_URL}/upload/zip`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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

export const downloadReadme = (docId, projectName) => {
  window.open(`${API_BASE_URL}/docs/${docId}/download`, '_blank');
};
