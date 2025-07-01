// Bimi Admin Dashboard API Utilities
// Handles authentication and dataset management

import axios from 'axios';
import { createAuthApi } from './authFetch';

// Use local proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.DEV ? '' : 'https://bimixapi.budgit.org';

// This will be set up at runtime from AuthContext
let authApi = null;

export function setupAuthApi({ getAccessToken, getRefreshToken, updateTokens, logout, refreshTokenApi }) {
  authApi = createAuthApi({
    getAccessToken,
    getRefreshToken,
    updateTokens,
    logout,
    refreshTokenApi,
    apiBaseUrl: API_BASE_URL,
  });
}

// --- AUTH ---
export const login = async (email, password) => {
  const res = await axios.post(`${API_BASE_URL}/api/accounts/login/`, { email, password });
  // Return only the inner data object, so frontend expects { access_token, ... }
  return res.data.data;
};

export const refreshToken = async (refresh_token) => {
  const res = await axios.post(`${API_BASE_URL}/api/accounts/refresh-token/`, { refresh_token });
  return res.data;
};

// --- UPLOADS ---
export const listUploads = async () => {
  if (!authApi) {
    throw new Error('Auth API not initialized. Please login first.');
  }
  const res = await authApi.get('/api/uploads/files');
  return res.data;
};

export const uploadFile = async (file, data_description, table_name) => {
  if (!authApi) {
    throw new Error('Auth API not initialized. Please login first.');
  }
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data_description', data_description);
  formData.append('table_name', table_name);
  const res = await authApi.post('/api/uploads/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getUpload = async (upload_id) => {
  if (!authApi) {
    throw new Error('Auth API not initialized. Please login first.');
  }
  const res = await authApi.get(`/api/uploads/files/${upload_id}`);
  return res.data;
};

export const deleteUpload = async (upload_id) => {
  if (!authApi) {
    throw new Error('Auth API not initialized. Please login first.');
  }
  const res = await authApi.delete(`/api/uploads/files/${upload_id}`);
  return res.data;
};

export const updateUpload = async (upload_id, file, data_description, table_name) => {
  if (!authApi) {
    throw new Error('Auth API not initialized. Please login first.');
  }
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (data_description) formData.append('data_description', data_description);
  if (table_name) formData.append('table_name', table_name);
  const res = await authApi.patch(`/api/uploads/files/${upload_id}/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const approveOrRejectUpload = async (upload_id, status, review_comment) => {
  if (!authApi) {
    throw new Error('Auth API not initialized. Please login first.');
  }
  const body = { status };
  if (review_comment) body.review_comment = review_comment;
  const res = await authApi.patch(`/api/uploads/files/${upload_id}/status`, body);
  return res.data;
};

export const getUploadColumns = async (upload_id) => {
  if (!authApi) {
    throw new Error('Auth API not initialized. Please login first.');
  }
  const res = await authApi.get(`/api/uploads/files/${upload_id}/columns`);
  return res.data;
};

export const addUploadColumn = async (upload_id, column) => {
  if (!authApi) {
    throw new Error('Auth API not initialized. Please login first.');
  }
  const res = await authApi.post(`/api/uploads/files/${upload_id}/columns`, column);
  return res.data;
};
