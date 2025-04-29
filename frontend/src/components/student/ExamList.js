import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  TextField, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  Timer as TimerIcon,
  HelpOutline as QuestionIcon,
  Grade as GradeIcon,
  CheckCircle as PassIcon,
  Cancel as FailIcon
} from '@mui/icons-material';
import { getExams } from '../../store/actions/examActions';
import { getResults } from '../../store/actions/resultActions';
import { formatDate, getExamStatus, truncateText } from '../../utils/helpers';

const ExamList = () => {
  const dispatch = useDispatch();
  const { exams, loading } = useSelector(state => state.exam);
  const { results } = useSelector(state => state.result);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, COMPLETED
  
  useEffect(() => {
    dispatch(getExams());
    dispatch(getResults());
  }, [dispatch]);
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };
  
  // Get completed exam IDs
  const completedExamIds = results.map(result => result.exam.id);
  
  // Filter and search exams
  const filteredExams = exams
    .filter(exam => {
      // Filter by status
      if (filterStatus === 'PENDING' && completedExamIds.includes(exam.id)) {
        return false;
      }
      if (filterStatus === 'COMPLETED' && !completedExamIds.includes(exam.id)) {
        return false;
      }
      
      // Filter by search term
      return (
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter(exam => exam.isActive); // Only show active exams
  
  // Get result for a specific exam
  const getExamResult = (examId) => {
    return results.find(result => result.exam.id === examId);
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Available Exams
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search exams..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="filter-status-label">Status</InputLabel>
            <Select
              labelId="filter-status-label"
              value={filterStatus}
              onChange={handleFilterChange}
              label="Status"
            >
              <MenuItem value="ALL">All Exams</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {loading ? (
          <LinearProgress />
        ) : filteredExams.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="textSecondary">
              {searchTerm || filterStatus !== 'ALL' 
                ? 'No exams match your criteria' 
                : 'No exams are currently available'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredExams.map(exam => {
              const examResult = getExamResult(exam.id);
              const examStatus = getExamStatus(exam.isActive, exam.startDate, exam.endDate);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={exam.id}>
                  <Card 
                    variant="outlined" 
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
                    {examResult && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 12, 
                          right: 12, 
                          zIndex: 1 
                        }}
                      >
                        <Chip 
                          icon={examResult.passed ? <PassIcon /> : <FailIcon />}
                          label={examResult.passed ? 'Passed' : 'Failed'}
                          color={examResult.passed ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    )}
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {exam.title}
                      </Typography>
                      
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                        {truncateText(exam.description, 120)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip 
                          icon={<TimerIcon />} 
                          label={`${exam.durationMinutes} mins`} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          icon={<GradeIcon />} 
                          label={`${exam.totalMarks} marks`} 
                          size="small"
                          variant="outlined"
                        />
                        <Chip 
                          icon={<QuestionIcon />} 
                          label={`Pass: ${exam.passingPercentage}%`} 
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      
                      {examResult ? (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Your Score
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={examResult.percentage} 
                                color={examResult.passed ? 'success' : 'error'}
                                sx={{ height: 10, borderRadius: 5 }}
                              />
                            </Box>
                            <Box minWidth={35}>
                              <Typography variant="body2" color="text.secondary">
                                {examResult.percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {examResult.obtainedMarks} / {examResult.totalMarks} marks
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ mt: 2 }}>
                          <Chip 
                            label={examStatus.label} 
                            color={examStatus.color}
                            size="small"
                          />
                          {(exam.startDate || exam.endDate) && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {exam.startDate && `Start: ${formatDate(exam.startDate)}`}
                              {exam.startDate && exam.endDate && <br />}
                              {exam.endDate && `End: ${formatDate(exam.endDate)}`}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                    
                    <CardActions>
                      {examResult ? (
                        <Button 
                          component={Link} 
                          to={`/student/results/${examResult.id}`} 
                          size="small" 
                          color="primary"
                        >
                          View Result
                        </Button>
                      ) : (
                        <Button 
                          component={Link} 
                          to={`/student/exams/${exam.id}`} 
                          size="small" 
                          color="primary"
                          disabled={examStatus.label !== 'Active'}
                        >
                          Take Exam
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default ExamList;
