import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  LinearProgress
} from '@mui/material';
import { 
  LibraryBooks as ExamIcon, 
  CheckCircle as CompletedIcon,
  Timer as TimerIcon,
  AssignmentTurnedIn as ResultsIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import ExamList from './ExamList';
import TakeExam from './TakeExam';
import Results from './Results';
import { getExams } from '../../store/actions/examActions';
import { getResults } from '../../store/actions/resultActions';
import { formatDate, calculatePercentage } from '../../utils/helpers';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { exams } = useSelector(state => state.exam);
  const { results } = useSelector(state => state.result);
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(getExams());
    dispatch(getResults());
  }, [dispatch]);
  
  // Dashboard data
  const availableExams = exams.filter(exam => exam.isActive);
  const completedExams = results.map(result => result.exam.id);
  const pendingExams = availableExams.filter(exam => !completedExams.includes(exam.id));
  const userResults = results;
  
  // Recent results (last 5)
  const recentResults = [...userResults]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);
  
  // Calculate overall performance
  const calculateOverallPerformance = () => {
    if (userResults.length === 0) return 0;
    
    const totalPercentage = userResults.reduce((sum, result) => sum + result.percentage, 0);
    return totalPercentage / userResults.length;
  };
  
  const overallPerformance = calculateOverallPerformance();
  
  return (
    <Routes>
      <Route path="/" element={
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Student Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          
          <Grid container spacing={3}>
            {/* Statistics Cards */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  bgcolor: '#e3f2fd',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ExamIcon color="primary" sx={{ mr: 1 }} />
                  <Typography component="h2" variant="h6" color="primary">
                    Available Exams
                  </Typography>
                </Box>
                <Typography component="p" variant="h4">
                  {pendingExams.length}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Exams ready to take
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  bgcolor: '#e8f5e9',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CompletedIcon color="success" sx={{ mr: 1 }} />
                  <Typography component="h2" variant="h6" color="success.main">
                    Completed Exams
                  </Typography>
                </Box>
                <Typography component="p" variant="h4">
                  {results.length}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Total exams completed
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  bgcolor: '#fff8e1',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ResultsIcon color="warning" sx={{ mr: 1 }} />
                  <Typography component="h2" variant="h6" color="warning.main">
                    Overall Performance
                  </Typography>
                </Box>
                <Typography component="p" variant="h4">
                  {overallPerformance.toFixed(1)}%
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Average score across all exams
                </Typography>
              </Paper>
            </Grid>
            
            {/* Upcoming Exams */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pending Exams
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {pendingExams.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      You have completed all available exams. Check back later for new ones.
                    </Typography>
                  ) : (
                    <List>
                      {pendingExams.slice(0, 5).map(exam => (
                        <ListItem key={exam.id} disablePadding>
                          <ListItemButton 
                            component={Link} 
                            to={`/student/exams/${exam.id}`}
                          >
                            <ListItemIcon>
                              <TimerIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={exam.title} 
                              secondary={`${exam.durationMinutes} mins • ${exam.totalMarks} marks`} 
                            />
                            <ArrowForwardIcon color="action" />
                          </ListItemButton>
                        </ListItem>
                      ))}
                      
                      {pendingExams.length > 5 && (
                        <Button 
                          component={Link} 
                          to="/student/exams" 
                          sx={{ mt: 1 }}
                          size="small"
                        >
                          View all {pendingExams.length} exams
                        </Button>
                      )}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Recent Results */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Results
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {recentResults.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      You haven't taken any exams yet. Start by taking an exam from the list.
                    </Typography>
                  ) : (
                    <List>
                      {recentResults.map(result => (
                        <ListItem key={result.id} sx={{ py: 1 }}>
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2">{result.exam.title}</Typography>
                              <Typography variant="subtitle2" color={result.passed ? 'success.main' : 'error.main'}>
                                {result.passed ? 'Passed' : 'Failed'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={result.percentage} 
                                  color={result.passed ? 'success' : 'error'}
                                  sx={{ height: 10, borderRadius: 5 }}
                                />
                              </Box>
                              <Box minWidth={35}>
                                <Typography variant="body2" color="text.secondary">
                                  {result.percentage.toFixed(1)}%
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {formatDate(result.submittedAt)}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                      
                      <Button 
                        component={Link} 
                        to="/student/results" 
                        sx={{ mt: 1 }}
                        size="small"
                      >
                        View all results
                      </Button>
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Quick Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      color="primary"
                      component={Link}
                      to="/student/exams"
                      fullWidth
                      size="large"
                      sx={{ p: 2 }}
                    >
                      Browse All Exams
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      color="success"
                      component={Link}
                      to="/student/results"
                      fullWidth
                      size="large"
                      sx={{ p: 2 }}
                    >
                      View All Results
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      } />
      <Route path="/exams" element={<ExamList />} />
      <Route path="/exams/:id" element={<TakeExam />} />
      <Route path="/results" element={<Results />} />
      <Route path="/results/:id" element={<Results />} />
    </Routes>
  );
};

export default Dashboard;
