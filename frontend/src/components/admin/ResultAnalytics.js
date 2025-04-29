import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Search as SearchIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { getExamById } from '../../store/actions/examActions';
import { getResultsByExamId, getResults } from '../../store/actions/resultActions';
import { formatDate, calculatePercentage } from '../../utils/helpers';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip, 
  Legend
);

const ResultAnalytics = () => {
  const { examId } = useParams();
  const dispatch = useDispatch();
  
  const { exam } = useSelector(state => state.exam);
  const { results, loading } = useSelector(state => state.result);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('ALL'); // ALL, PASSED, FAILED
  
  useEffect(() => {
    if (examId) {
      dispatch(getExamById(examId));
      dispatch(getResultsByExamId(examId));
    } else {
      dispatch(getResults());
    }
  }, [dispatch, examId]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
    setPage(0);
  };
  
  // Apply filters and search
  const filteredResults = results
    .filter(result => {
      // Apply exam filter if examId is provided
      if (examId && result.exam.id !== parseInt(examId, 10)) {
        return false;
      }
      
      // Apply passed/failed filter
      if (filterBy === 'PASSED' && !result.passed) {
        return false;
      }
      if (filterBy === 'FAILED' && result.passed) {
        return false;
      }
      
      // Apply search filter
      return (
        result.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.exam?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  
  // Paginate the filtered results
  const paginatedResults = filteredResults
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Prepare data for charts
  const prepareChartData = () => {
    if (loading || results.length === 0) {
      return {
        passFailData: {
          labels: ['Passed', 'Failed'],
          datasets: [{
            data: [0, 0],
            backgroundColor: ['#4caf50', '#f44336'],
          }]
        },
        scoreDistributionData: {
          labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
          datasets: [{
            label: 'Students',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
          }]
        }
      };
    }
    
    // Filter results by exam if examId is provided
    const filteredForChart = examId 
      ? results.filter(r => r.exam.id === parseInt(examId, 10))
      : results;
    
    // Pass/Fail data
    const passedCount = filteredForChart.filter(r => r.passed).length;
    const failedCount = filteredForChart.length - passedCount;
    
    // Score distribution data
    const scoreRanges = [0, 0, 0, 0, 0]; // 0-20%, 21-40%, 41-60%, 61-80%, 81-100%
    
    filteredForChart.forEach(result => {
      const percentage = result.percentage;
      
      if (percentage <= 20) scoreRanges[0]++;
      else if (percentage <= 40) scoreRanges[1]++;
      else if (percentage <= 60) scoreRanges[2]++;
      else if (percentage <= 80) scoreRanges[3]++;
      else scoreRanges[4]++;
    });
    
    return {
      passFailData: {
        labels: ['Passed', 'Failed'],
        datasets: [{
          data: [passedCount, failedCount],
          backgroundColor: ['#4caf50', '#f44336'],
        }]
      },
      scoreDistributionData: {
        labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
        datasets: [{
          label: 'Students',
          data: scoreRanges,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        }]
      }
    };
  };
  
  const { passFailData, scoreDistributionData } = prepareChartData();
  
  // Calculate statistics
  const calculateStats = () => {
    if (loading || results.length === 0) {
      return {
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0
      };
    }
    
    // Filter results by exam if examId is provided
    const filteredForStats = examId 
      ? results.filter(r => r.exam.id === parseInt(examId, 10))
      : results;
    
    if (filteredForStats.length === 0) {
      return {
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0
      };
    }
    
    const totalPercentage = filteredForStats.reduce((sum, r) => sum + r.percentage, 0);
    const avgScore = totalPercentage / filteredForStats.length;
    const scores = filteredForStats.map(r => r.percentage);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const passedCount = filteredForStats.filter(r => r.passed).length;
    const passRate = (passedCount / filteredForStats.length) * 100;
    
    return {
      avgScore: Math.round(avgScore * 10) / 10, // Round to 1 decimal place
      highestScore,
      lowestScore,
      passRate: Math.round(passRate)
    };
  };
  
  const stats = calculateStats();
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {examId ? `Results for: ${exam?.title || 'Loading...'}` : 'All Exam Results'}
        </Typography>
        
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Score
                </Typography>
                <Typography variant="h5" component="div">
                  {stats.avgScore}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Highest Score
                </Typography>
                <Typography variant="h5" component="div">
                  {stats.highestScore}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Lowest Score
                </Typography>
                <Typography variant="h5" component="div">
                  {stats.lowestScore}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pass Rate
                </Typography>
                <Typography variant="h5" component="div">
                  {stats.passRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pass/Fail Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Pie data={passFailData} />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Score Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={scoreDistributionData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }} 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Results Table */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            margin="normal"
            placeholder="Search results..."
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
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              value={filterBy}
              onChange={handleFilterChange}
              label="Filter"
            >
              <MenuItem value="ALL">All Results</MenuItem>
              <MenuItem value="PASSED">Passed Only</MenuItem>
              <MenuItem value="FAILED">Failed Only</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="results table">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                {!examId && <TableCell>Exam</TableCell>}
                <TableCell align="center">Marks</TableCell>
                <TableCell align="center">Percentage</TableCell>
                <TableCell align="center">Result</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Time Taken</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={examId ? 6 : 7} align="center">Loading...</TableCell>
                </TableRow>
              ) : paginatedResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={examId ? 6 : 7} align="center">
                    {searchTerm || filterBy !== 'ALL' ? 'No results match your criteria' : 'No results found'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                        {result.user.name}
                      </Box>
                    </TableCell>
                    {!examId && (
                      <TableCell>{result.exam.title}</TableCell>
                    )}
                    <TableCell align="center">
                      {result.obtainedMarks} / {result.totalMarks}
                    </TableCell>
                    <TableCell align="center">
                      {result.percentage.toFixed(1)}%
                    </TableCell>
                    <TableCell align="center">
                      {result.passed ? (
                        <Chip 
                          icon={<CheckIcon />} 
                          label="Passed" 
                          color="success" 
                          size="small" 
                        />
                      ) : (
                        <Chip 
                          icon={<CloseIcon />} 
                          label="Failed" 
                          color="error" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(result.submittedAt)}</TableCell>
                    <TableCell>
                      {result.timeTakenInSeconds 
                        ? `${Math.floor(result.timeTakenInSeconds / 60)}m ${result.timeTakenInSeconds % 60}s` 
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredResults.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ResultAnalytics;
