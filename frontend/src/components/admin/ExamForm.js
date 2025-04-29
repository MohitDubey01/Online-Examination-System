import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createExam, getExamById, updateExam } from '../../store/actions/examActions';

const ExamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { exam } = useSelector(state => state.exam);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    totalMarks: 100,
    passingPercentage: 40,
    startDate: null,
    endDate: null,
    isActive: true
  });
  
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      dispatch(getExamById(id));
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (id && exam) {
      setFormData({
        title: exam.title || '',
        description: exam.description || '',
        durationMinutes: exam.durationMinutes || 60,
        totalMarks: exam.totalMarks || 100,
        passingPercentage: exam.passingPercentage || 40,
        startDate: exam.startDate ? new Date(exam.startDate) : null,
        endDate: exam.endDate ? new Date(exam.endDate) : null,
        isActive: exam.isActive || true
      });
    }
  }, [id, exam]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.durationMinutes <= 0) {
      setError('Duration must be greater than 0');
      return false;
    }
    if (formData.totalMarks <= 0) {
      setError('Total marks must be greater than 0');
      return false;
    }
    if (formData.passingPercentage <= 0 || formData.passingPercentage > 100) {
      setError('Passing percentage must be between 1 and 100');
      return false;
    }
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      setError('End date must be after start date');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (id) {
        await dispatch(updateExam(id, formData));
      } else {
        await dispatch(createExam(formData));
      }
      navigate('/admin/exams');
    } catch (err) {
      setError(err.response?.data || 'Something went wrong');
    }
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Edit Exam' : 'Create New Exam'}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Exam Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Exam Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="durationMinutes"
                label="Duration (minutes)"
                type="number"
                value={formData.durationMinutes}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="totalMarks"
                label="Total Marks"
                type="number"
                value={formData.totalMarks}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="passingPercentage"
                label="Passing Percentage"
                type="number"
                value={formData.passingPercentage}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Start Date & Time (Optional)"
                  value={formData.startDate}
                  onChange={(newValue) => handleDateChange('startDate', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="End Date & Time (Optional)"
                  value={formData.endDate}
                  onChange={(newValue) => handleDateChange('endDate', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </LocalizationProvider>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Exam Active"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {id ? 'Update Exam' : 'Create Exam'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/admin/exams')}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ExamForm;
