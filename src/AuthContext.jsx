import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize from localStorage
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('bimi_access_token') || '');
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('bimi_refresh_token') || '');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bimi_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Login: expects { access_token, refresh_token, user }
  const login = ({ access_token, refresh_token, ...userInfo }) => {
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setUser(userInfo);
    localStorage.setItem('bimi_access_token', access_token);
    localStorage.setItem('bimi_refresh_token', refresh_token);
    localStorage.setItem('bimi_user', JSON.stringify(userInfo));
  };

  // Logout: clear all
  const logout = () => {
    setAccessToken('');
    setRefreshToken('');
    setUser(null);
    localStorage.removeItem('bimi_access_token');
    localStorage.removeItem('bimi_refresh_token');
    localStorage.removeItem('bimi_user');
  };

  // Update tokens after refresh
  const updateTokens = ({ access_token, refresh_token }) => {
    if (access_token) {
      setAccessToken(access_token);
      localStorage.setItem('bimi_access_token', access_token);
    }
    if (refresh_token) {
      setRefreshToken(refresh_token);
      localStorage.setItem('bimi_refresh_token', refresh_token);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout, updateTokens }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
