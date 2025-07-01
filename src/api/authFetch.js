// authFetch.js
// Axios instance and wrapper for automatic token refresh/session expiration handling
import axios from 'axios';

// This function must be called from within a React component or hook
// so that it can access the latest tokens and update them via context.
export function createAuthApi({ getAccessToken, getRefreshToken, updateTokens, logout, refreshTokenApi, apiBaseUrl }) {
  const instance = axios.create({
    baseURL: apiBaseUrl,
  });

  // Intercept requests to add the access token
  instance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Intercept responses to handle 401 and refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refresh_token = getRefreshToken();
          if (!refresh_token) throw new Error('No refresh token');
          const refreshRes = await refreshTokenApi(refresh_token);
          updateTokens(refreshRes);
          // Update header and retry
          originalRequest.headers['Authorization'] = `Bearer ${refreshRes.access_token}`;
          return instance(originalRequest);
        } catch (refreshErr) {
          logout();
          return Promise.reject(refreshErr);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
