import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
        import api from '../services/api'; // Use the configured axios instance

        export const AuthContext = createContext();

        export const AuthProvider = ({ children }) => {
          const [user, setUser] = useState(null);
          const [token, setToken] = useState(localStorage.getItem('token') || null);
          const [loading, setLoading] = useState(true); // Start loading until checked

          // Configure axios to use the token
          useEffect(() => {
              if (token) {
                  localStorage.setItem('token', token);
                  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              } else {
                  localStorage.removeItem('token');
                  delete api.defaults.headers.common['Authorization'];
              }
          }, [token]);

          // Function to check user status on initial load or token change
          const checkUserStatus = useCallback(async () => {
              if (!token) {
                  setLoading(false);
                  setUser(null);
                  return;
              }
              try {
                  setLoading(true);
                  api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Ensure header is set
                  const response = await api.get('/auth/me'); // Use '/auth/me' endpoint
                  if (response.data.success) {
                      setUser(response.data.data);
                  } else {
                      // Invalid token case
                      setToken(null);
                      setUser(null);
                  }
              } catch (error) {
                  console.error('Failed to fetch user:', error);
                  // Token might be expired or invalid
                  setToken(null);
                  setUser(null);
              } finally {
                  setLoading(false);
              }
          }, [token]); // Depend on token

          // Check user status on mount
          useEffect(() => {
              checkUserStatus();
          }, [checkUserStatus]);

          const login = useCallback(async (email, password) => {
              try {
                  setLoading(true);
                  const response = await api.post('/auth/login', { email, password });
                  if (response.data.success && response.data.token) {
                      setToken(response.data.token); // This triggers the useEffect to set localStorage and axios header
                      setUser(response.data); // Set user info (excluding token here if preferred)
                      // Optionally re-fetch user data using /auth/me if login doesn't return full user object
                      // await checkUserStatus(); // Or just trust the login response
                      return { success: true };
                  } else {
                       return { success: false, message: response.data.message || 'Login failed' };
                  }
              } catch (error) {
                  console.error('Login error:', error.response ? error.response.data : error.message);
                   return { success: false, message: error.response?.data?.message || 'An error occurred during login' };
              } finally {
                setLoading(false);
              }
          }, []); // No dependencies needed here if checkUserStatus is separate

          const register = useCallback(async (username, email, password) => {
             try {
                setLoading(true);
                const response = await api.post('/auth/register', { username, email, password });
                if (response.data.success && response.data.token) {
                   setToken(response.data.token);
                   setUser(response.data);
                   return { success: true };
                } else {
                    return { success: false, message: response.data.message || 'Registration failed' };
                }
             } catch (error) {
                 console.error('Registration error:', error.response ? error.response.data : error.message);
                  return { success: false, message: error.response?.data?.message || 'An error occurred during registration' };
             } finally {
                setLoading(false);
             }
          }, []);

          const logout = useCallback(() => {
              setUser(null);
              setToken(null); // This triggers the useEffect to clear localStorage and axios header
          }, []);

          // Memoize context value
          const value = useMemo(() => ({
              user,
              token,
              loading, // Provide loading state
              login,
              register,
              logout,
              isAuthenticated: !!user // Simple boolean flag
          }), [user, token, loading, login, register, logout]);

          return (
              <AuthContext.Provider value={value}>
                  {!loading ? children : <div className="loading-spinner" style={{margin: '50px auto'}}></div> /* Show spinner during initial auth check */}
              </AuthContext.Provider>
          );
        };
