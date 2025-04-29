import { createSlice } from '@reduxjs/toolkit';

// Check if there's a token in localStorage
const token = localStorage.getItem('token');

const initialState = {
  token: token,
  isAuthenticated: !!token, // Convert to boolean - true if token exists
  loading: false,
  user: null,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.error = null;
    }
  }
});

export const { 
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout
} = authSlice.actions;

export default authSlice.reducer;