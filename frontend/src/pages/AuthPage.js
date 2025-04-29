import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure } from '../store/slices/authSlice';
import '../styles/auth.css';

const AuthPage = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: ''
  });

  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoginForm) {
      // Login logic
      dispatch(loginStart());
      try {
        // Mock authentication (temporary until backend is connected)
        // In a real app, this would call the API endpoint
        setTimeout(() => {
          // Simulate successful login
          const mockUserData = {
            id: 1,
            username: formData.username,
            token: 'mock-jwt-token',
            role: 'STUDENT'
          };
          
          // Store in localStorage to persist between refreshes
          localStorage.setItem('token', mockUserData.token);
          
          dispatch(loginSuccess({ token: mockUserData.token, user: mockUserData }));
        }, 1000); // Simulate network delay
        
      } catch (error) {
        dispatch(loginFailure(error.message));
      }
    } else {
      // Register logic
      dispatch(registerStart());
      try {
        // Mock registration (temporary until backend is connected)
        // In a real app, this would call the API endpoint
        setTimeout(() => {
          // Simulate successful registration
          const mockUserData = {
            id: Date.now(), // Generate a unique ID
            username: formData.username,
            email: formData.email,
            fullName: formData.fullName,
            token: 'mock-jwt-token',
            role: 'STUDENT'
          };
          
          // Store in localStorage to persist between refreshes
          localStorage.setItem('token', mockUserData.token);
          
          dispatch(registerSuccess({ token: mockUserData.token, user: mockUserData }));
        }, 1000); // Simulate network delay
      } catch (error) {
        dispatch(registerFailure(error.message));
      }
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>{isLoginForm ? 'Login' : 'Register'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          {!isLoginForm && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Processing...' : isLoginForm ? 'Login' : 'Register'}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>
            {isLoginForm ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLoginForm(!isLoginForm)}
              className="switch-button"
            >
              {isLoginForm ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
      
      <div className="auth-hero">
        <div className="hero-content">
          <h1>Online Examination System</h1>
          <p>Take exams, track your progress, and improve your skills with our comprehensive examination platform.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;