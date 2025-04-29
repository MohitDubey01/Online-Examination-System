import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import Dashboard from '../components/student/Dashboard';

const StudentPage = () => {
  const { loading } = useSelector(state => state.auth);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Routes>
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
};

export default StudentPage;
