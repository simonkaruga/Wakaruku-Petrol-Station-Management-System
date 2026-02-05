/**
 * Authentication utility functions
 */

/**
 * Store authentication token in localStorage
 * @param {string} token - JWT token to store
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} true if user has a valid token
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Decode JWT token to get payload
 * @param {string} token - JWT token to decode
 * @returns {object|null} decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} true if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get user role from token
 * @returns {string|null} user role or null if not found
 */
export const getUserRole = () => {
  const token = getAuthToken();
  const payload = decodeToken(token);
  return payload?.role || null;
};

/**
 * Get user ID from token
 * @returns {string|null} user ID or null if not found
 */
export const getUserId = () => {
  const token = getAuthToken();
  const payload = decodeToken(token);
  return payload?.userId || null;
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} true if user has the specified role
 */
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if user is admin
 * @returns {boolean} true if user is admin
 */
export const isAdmin = () => {
  return hasRole('admin');
};

/**
 * Check if user is manager
 * @returns {boolean} true if user is manager
 */
export const isManager = () => {
  return hasRole('manager');
};

/**
 * Check if user is staff
 * @returns {boolean} true if user is staff
 */
export const isStaff = () => {
  return hasRole('staff');
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  removeAuthToken();
};

/**
 * Refresh token (if refresh endpoint is available)
 * @returns {Promise<boolean>} true if refresh successful
 */
export const refreshAuthToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem('refreshToken')
      })
    });

    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

/**
 * Logout user and clear all auth data
 */
export const logout = () => {
  clearAuthData();
  // Redirect to login page
  window.location.href = '/login';
};