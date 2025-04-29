import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import notFoundSvg from '../assets/not-found.svg';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box 
          component="img" 
          src={notFoundSvg} 
          alt="Page Not Found"
          sx={{ maxWidth: '100%', height: 'auto', maxHeight: 300, mb: 4 }}
        />
        
        <Typography variant="h4" gutterBottom>
          404 - Page Not Found
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
          The page you are looking for doesn't exist or has been moved.
          Let's get you back on track.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          component={Link}
          to="/"
          size="large"
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
