import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon,
  BarChart as ChartIcon,
  AccessTime as TimeIcon,
  HomeOutlined as HomeIcon,
  ListAlt as ExamListIcon
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getResultById, getResults } from '../../store/actions/resultActions';
import { getExamById } from '../../store/actions/examActions';
import { getQuestionsByExamId } from '../../store/actions/examActions';
import { formatDate, formatTime } from '../../utils/helpers';

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend);

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { result, results, loading: resultLoading } = useSelector(state => state.result);
  const { exam, questions, loading: examLoading } = useSelector(state => state.exam);
  
  useEffect(() => {
    if (id) {
      dispatch(getResultById(id));
    } else {
      dispatch(getResults());
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (result && result.exam) {
      dispatch(getExamById(result.exam.id));
      dispatch(getQuestionsByExamId(result.exam.id));
    }
  }, [dispatch, result]);
  
  // Prepare data for the chart
  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [{
      data: [
        result ? result.obtainedMarks : 0, 
        result ? (result.totalMarks - result.obtainedMarks) : 0
      ],
      backgroundColor: ['#4caf50', '#f44336'],
      borderWidth: 0,
    }]
  };
  
  // Render individual result view
  if (id) {
    const loading = resultLoading || (examLoading && result);
    
    if (loading) {
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading result...</Typography>
          </Paper>
        </Container>
      );
    }
    
    if (!result) {
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">
            Result not found. Please check the URL and try again.
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/student/results')} 
            sx={{ mt: 2 }}
          >
            Back to Results
          </Button>
        </Container>
      );
    }
    
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {/* Result Header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h5">
                Exam Result
              </Typography>
              <Chip 
                icon={result.passed ? <CheckIcon /> : <CloseIcon />}
                label={result.passed ? 'PASSED' : 'FAILED'}
                color={result.passed ? 'success' : 'error'}
              />
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {result.exam.title}
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {/* Result Summary */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle1" gutterBottom>
                Result Summary
              </Typography>
              
              <List disablePadding>
                <ListItem divider>
                  <ListItemText primary="Score" />
                  <Typography variant="body1">
                    {result.obtainedMarks} / {result.totalMarks}
                  </Typography>
                </ListItem>
                
                <ListItem divider>
                  <ListItemText primary="Percentage" />
                  <Typography variant="body1">
                    {result.percentage.toFixed(1)}%
                  </Typography>
                </ListItem>
                
                <ListItem divider>
                  <ListItemText primary="Passing Percentage" />
                  <Typography variant="body1">
                    {exam ? exam.passingPercentage : '-'}%
                  </Typography>
                </ListItem>
                
                <ListItem divider>
                  <ListItemText primary="Time Taken" />
                  <Typography variant="body1">
                    {result.timeTakenInSeconds 
                      ? formatTime(result.timeTakenInSeconds) 
                      : 'Not recorded'}
                  </Typography>
                </ListItem>
                
                <ListItem divider>
                  <ListItemText primary="Submitted On" />
                  <Typography variant="body1">
                    {formatDate(result.submittedAt)}
                  </Typography>
                </ListItem>
                
                <ListItem>
                  <ListItemText primary="Result" />
                  <Typography 
                    variant="body1" 
                    color={result.passed ? 'success.main' : 'error.main'}
                    fontWeight="bold"
                  >
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </Typography>
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Box sx={{ height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    position: 'absolute',
                    color: result.percentage >= (exam?.passingPercentage || 0) ? 'success.main' : 'error.main' 
                  }}
                >
                  {result.percentage.toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* Question Details (If questions are available) */}
          {questions && questions.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Question Details
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Question</TableCell>
                      <TableCell>Your Answer</TableCell>
                      <TableCell>Correct Answer</TableCell>
                      <TableCell align="center">Marks</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questions.map((question) => {
                      const userAnswer = result.answers?.[question.id] || 'Not answered';
                      const isCorrect = userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
                      
                      return (
                        <TableRow key={question.id}>
                          <TableCell>{question.questionText}</TableCell>
                          <TableCell>{userAnswer}</TableCell>
                          <TableCell>{question.correctAnswer}</TableCell>
                          <TableCell align="center">{question.marks}</TableCell>
                          <TableCell align="center">
                            {isCorrect ? (
                              <CheckIcon color="success" />
                            ) : (
                              <CloseIcon color="error" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          
          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              startIcon={<ExamListIcon />}
              onClick={() => navigate('/student/results')}
            >
              All Results
            </Button>
            
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/student')}
            >
              Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
  
  // Render all results view
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Your Exam Results
        </Typography>
        
        {resultLoading ? (
          <LinearProgress />
        ) : results.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              You haven't taken any exams yet
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/student/exams')}
            >
              Browse Available Exams
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {results.map(result => (
              <Grid item xs={12} md={6} key={result.id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6">
                        {result.exam.title}
                      </Typography>
                      <Chip 
                        label={result.passed ? 'PASSED' : 'FAILED'}
                        color={result.passed ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Submitted: {formatDate(result.submittedAt)}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ChartIcon sx={{ mr: 1, color: 'action.active' }} />
                          <Typography variant="body2">Score</Typography>
                        </Box>
                        <Typography variant="h6">
                          {result.obtainedMarks} / {result.totalMarks}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TimeIcon sx={{ mr: 1, color: 'action.active' }} />
                          <Typography variant="body2">Time Taken</Typography>
                        </Box>
                        <Typography variant="h6">
                          {result.timeTakenInSeconds 
                            ? `${Math.floor(result.timeTakenInSeconds / 60)}m ${result.timeTakenInSeconds % 60}s` 
                            : 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Percentage: {result.percentage.toFixed(1)}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={result.percentage} 
                        color={result.passed ? 'success' : 'error'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/student/results/${result.id}`)}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Results;
