import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  QuestionAnswer as ExamIcon,
  PersonAdd as RegisterIcon,
  Login as LoginIcon,
  CheckCircle as CheckIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import examSvg from '../assets/exam.svg';

const HomePage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const features = [
    {
      title: "Various Question Types",
      description: "Support for multiple choice, true/false, and short answer questions"
    },
    {
      title: "Timed Examinations",
      description: "Configurable time limits with automatic submission when time expires"
    },
    {
      title: "Instant Grading",
      description: "Get your results immediately after submitting the exam"
    },
    {
      title: "Performance Analytics",
      description: "Track your progress and analyze your performance"
    }
  ];
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          bgcolor: 'primary.main',
          color: 'white',
          mb: 4,
          p: { xs: 3, md: 6 },
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: { md: 'absolute' },
            top: 0,
            right: 0,
            bottom: 0,
            width: { md: '50%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}
        >
          <Box 
            component="img"
            src={examSvg} 
            alt="Online Examination" 
            sx={{ 
              maxWidth: '100%', 
              maxHeight: 300,
              display: { xs: 'none', md: 'block' }
            }} 
          />
        </Box>
        <Box sx={{ maxWidth: { md: '50%' }, position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Online Examination System
          </Typography>
          <Typography variant="h6" paragraph>
            A modern platform for creating, administering, and taking exams online.
          </Typography>
          {isAuthenticated ? (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={user && user.role === 'ADMIN' ? '/admin' : '/student'}
              size="large"
              startIcon={<DashboardIcon />}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/auth"
                size="large"
                startIcon={<LoginIcon />}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                to="/auth"
                size="large"
                startIcon={<RegisterIcon />}
                sx={{ borderColor: 'white' }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Key Features
        </Typography>
        <Divider sx={{ mb: 4, maxWidth: 100, mx: 'auto' }} />
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ExamIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h3">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* How It Works Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          How It Works
        </Typography>
        <Divider sx={{ mb: 4, maxWidth: 100, mx: 'auto' }} />
        
        <Paper sx={{ p: 3 }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <RegisterIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 1: Register an Account" 
                secondary="Create a new account to get started with the system."
              />
            </ListItem>
            
            <Divider component="li" />
            
            <ListItem>
              <ListItemIcon>
                <LoginIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 2: Log In" 
                secondary="Log in to access your dashboard and available exams."
              />
            </ListItem>
            
            <Divider component="li" />
            
            <ListItem>
              <ListItemIcon>
                <ExamIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 3: Take an Exam" 
                secondary="Browse available exams and start taking them within the specified time limits."
              />
            </ListItem>
            
            <Divider component="li" />
            
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 4: Get Results" 
                secondary="Receive immediate feedback and detailed results after submission."
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
      
      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ready to Get Started?
        </Typography>
        
        {isAuthenticated ? (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={user && user.role === 'ADMIN' ? '/admin' : '/student'}
            size="large"
            sx={{ mt: 2 }}
          >
            Go to Dashboard
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/auth"
            size="large"
            sx={{ mt: 2 }}
          >
            Sign Up Now
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
