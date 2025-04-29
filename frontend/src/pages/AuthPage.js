import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Tabs, 
  Tab, 
  Alert, 
  InputAdornment, 
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  LockOutlined as LockIcon,
  PersonOutline as PersonIcon,
  EmailOutlined as EmailIcon
} from '@mui/icons-material';
import { login, register } from '../store/actions/authActions';
import authSvg from '../assets/auth.svg';

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  });
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({});
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setValidationErrors({});
  };
  
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginForm.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!loginForm.password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateRegisterForm = () => {
    const errors = {};
    
    if (!registerForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!registerForm.username.trim()) {
      errors.username = 'Username is required';
    } else if (registerForm.username.length < 4) {
      errors.username = 'Username must be at least 4 characters';
    }
    
    if (!registerForm.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerForm.email)) {
        errors.email = 'Invalid email format';
      }
    }
    
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateLoginForm()) {
      return;
    }
    
    try {
      await dispatch(login(loginForm.username, loginForm.password));
    } catch (err) {
      setError(err.response?.data || 'Invalid username or password');
    }
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateRegisterForm()) {
      return;
    }
    
    try {
      const { confirmPassword, ...registerData } = registerForm;
      await dispatch(register(registerData));
    } catch (err) {
      setError(
        err.response?.data || 
        'Registration failed. Please try again with different credentials.'
      );
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Grid container component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Form Section */}
        <Grid item xs={12} md={6} sx={{ p: 4 }}>
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {activeTab === 0 ? 'Sign In' : 'Create Account'}
            </Typography>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Login Form */}
          {activeTab === 0 && (
            <Box component="form" onSubmit={handleLoginSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={loginForm.username}
                onChange={handleLoginChange}
                error={!!validationErrors.username}
                helperText={validationErrors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={handleLoginChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Button 
                    onClick={() => setActiveTab(1)} 
                    sx={{ textTransform: 'none' }}
                  >
                    Register
                  </Button>
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Register Form */}
          {activeTab === 1 && (
            <Box component="form" onSubmit={handleRegisterSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={registerForm.name}
                onChange={handleRegisterChange}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                error={!!validationErrors.username}
                helperText={validationErrors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={registerForm.role}
                  label="Role"
                  onChange={handleRegisterChange}
                >
                  <MenuItem value="STUDENT">Student</MenuItem>
                  <MenuItem value="ADMIN">Administrator</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Button 
                    onClick={() => setActiveTab(0)} 
                    sx={{ textTransform: 'none' }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
        
        {/* Hero Section */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            p: 4, 
            display: { xs: 'none', md: 'flex' }, 
            flexDirection: 'column',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'white'
          }}
        >
          <Box 
            component="img" 
            src={authSvg} 
            alt="Authentication"
            sx={{ maxWidth: '100%', height: 'auto', mb: 4 }}
          />
          
          <Typography variant="h4" gutterBottom>
            Welcome to Online Exam System
          </Typography>
          
          <Typography variant="body1" paragraph>
            A comprehensive platform for creating, managing, and taking online examinations.
          </Typography>
          
          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
          
          <Typography variant="body1">
            {activeTab === 0 
              ? 'Sign in to access your exams and track your progress.' 
              : 'Create an account to start taking exams and evaluating your knowledge.'}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthPage;
