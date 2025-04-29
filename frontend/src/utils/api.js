import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api', // This will use the proxy setting in package.json
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set auth token for requests
export const setAuthToken = token => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Handle global response errors
api.interceptors.response.use(
  response => response,
  error => {
    const { status } = error.response;

    // Handle token expiration
    if (status === 401) {
      setAuthToken(null);
    }

    return Promise.reject(error);
  }
);

export default api;