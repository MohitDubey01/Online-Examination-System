import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import { 
  PieChart, 
  LibraryBooks, 
  People, 
  Assessment,
  Add
} from '@mui/icons-material';
import ExamForm from './ExamForm';
import ExamList from './ExamList';
import QuestionForm from './QuestionForm';
import ResultAnalytics from './ResultAnalytics';
import { getExams } from '../../store/actions/examActions';
import { getResults } from '../../store/actions/resultActions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { exams } = useSelector(state => state.exam);
  const { results } = useSelector(state => state.result);
  
  useEffect(() => {
    dispatch(getExams());
    dispatch(getResults());
  }, [dispatch]);
  
  // Dashboard statistics
  const totalExams = exams.length;
  const activeExams = exams.filter(exam => exam.isActive).length;
  const totalStudents = [...new Set(results.map(r => r.user.id))].length;
  const totalSubmissions = results.length;
  
  return (
    <Routes>
      <Route path="/" element={
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          
          <Grid container spacing={3}>
            {/* Statistics Cards */}
            <Grid item xs={12} md={3}>
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
                  <LibraryBooks color="primary" sx={{ mr: 1 }} />
                  <Typography component="h2" variant="h6" color="primary">
                    Exams
                  </Typography>
                </Box>
                <Typography component="p" variant="h4">
                  {totalExams}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  {activeExams} active
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3}>
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
                  <People color="success" sx={{ mr: 1 }} />
                  <Typography component="h2" variant="h6" color="success.main">
                    Students
                  </Typography>
                </Box>
                <Typography component="p" variant="h4">
                  {totalStudents}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Registered students
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3}>
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
                  <Assessment color="warning" sx={{ mr: 1 }} />
                  <Typography component="h2" variant="h6" color="warning.main">
                    Submissions
                  </Typography>
                </Box>
                <Typography component="p" variant="h4">
                  {totalSubmissions}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Total exam submissions
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  bgcolor: '#fce4ec',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PieChart color="secondary" sx={{ mr: 1 }} />
                  <Typography component="h2" variant="h6" color="secondary.main">
                    Pass Rate
                  </Typography>
                </Box>
                <Typography component="p" variant="h4">
                  {results.length > 0 
                    ? Math.round((results.filter(r => r.passed).length / results.length) * 100) 
                    : 0}%
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Overall passing rate
                </Typography>
              </Paper>
            </Grid>
            
            {/* Quick Actions */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        Create New Exam
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Set up a new examination with custom questions
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<Add />} 
                        component={Link} 
                        to="/admin/exams/create"
                      >
                        Create Exam
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        Manage Exams
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        View, edit or delete existing examinations
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={Link} 
                        to="/admin/exams"
                      >
                        View Exams
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        Add Questions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create questions for an existing exam
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={Link} 
                        to="/admin/questions/create"
                      >
                        Add Questions
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        View Results
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Analyze student performance and results
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={Link} 
                        to="/admin/results"
                      >
                        View Analytics
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      } />
      <Route path="/exams" element={<ExamList />} />
      <Route path="/exams/create" element={<ExamForm />} />
      <Route path="/exams/edit/:id" element={<ExamForm />} />
      <Route path="/questions/create" element={<QuestionForm />} />
      <Route path="/questions/edit/:id" element={<QuestionForm />} />
      <Route path="/results" element={<ResultAnalytics />} />
      <Route path="/results/:examId" element={<ResultAnalytics />} />
    </Routes>
  );
};

export default Dashboard;
