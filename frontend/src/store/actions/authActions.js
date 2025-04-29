import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { setAuthToken } from '../../utils/api';
import { 
  loginRequest, 
  userLoaded, 
  loginSuccess, 
  registerRequest, 
  registerSuccess, 
  authError, 
  loginFail, 
  registerFail, 
  logout as logoutAction 
} from '../reducers/authReducer';

// Load User
export const getCurrentUser = () => async dispatch => {
  try {
    const res = await api.get('/user');
    dispatch(userLoaded(res.data));
  } catch (err) {
    dispatch(authError(err.response?.data || 'Authentication Error'));
  }
};

// Register User
export const register = (formData) => async dispatch => {
  try {
    dispatch(registerRequest());
    
    const res = await api.post('/register', formData);
    
    dispatch(registerSuccess({
      token: res.data.token,
      user: res.data
    }));
    
    setAuthToken(res.data.token);
  } catch (err) {
    const errorMessage = err.response?.data || 'Registration failed';
    
    dispatch(registerFail(errorMessage));
    throw new Error(errorMessage);
  }
};

// Login User
export const login = (username, password) => async dispatch => {
  try {
    dispatch(loginRequest());
    
    const res = await api.post('/login', { username, password });
    
    dispatch(loginSuccess({
      token: res.data.token,
      user: res.data
    }));
    
    setAuthToken(res.data.token);
  } catch (err) {
    const errorMessage = err.response?.data || 'Invalid credentials';
    
    dispatch(loginFail(errorMessage));
    throw new Error(errorMessage);
  }
};

// Logout
export const logout = () => dispatch => {
  // Call the API to invalidate the session
  try {
    api.post('/logout');
  } catch (err) {
    console.error('Logout error:', err);
  }
  
  setAuthToken(null);
  dispatch(logoutAction());
};