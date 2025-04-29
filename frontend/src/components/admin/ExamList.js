import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  QuestionAnswer as QuestionsIcon,
  Assessment as ResultsIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { getExams, deleteExam } from '../../store/actions/examActions';
import { formatDate, getExamStatus } from '../../utils/helpers';

const ExamList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, loading } = useSelector(state => state.exam);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  
  useEffect(() => {
    dispatch(getExams());
  }, [dispatch]);
  
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
  
  const openDeleteDialog = (exam) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteExam = () => {
    if (examToDelete) {
      dispatch(deleteExam(examToDelete.id));
      setDeleteDialogOpen(false);
      setExamToDelete(null);
    }
  };
  
  // Filter exams by search term
  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Paginate the filtered exams
  const paginatedExams = filteredExams
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Manage Exams
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/admin/exams/create"
          >
            Create New Exam
          </Button>
        </Box>
        
        <TextField
          fullWidth
          margin="normal"
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
          sx={{ mb: 2 }}
        />
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="exam table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Total Marks</TableCell>
                <TableCell>Passing %</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">Loading...</TableCell>
                </TableRow>
              ) : paginatedExams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {searchTerm ? 'No exams match your search' : 'No exams found'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedExams.map((exam) => {
                  const status = getExamStatus(exam.isActive, exam.startDate, exam.endDate);
                  
                  return (
                    <TableRow key={exam.id}>
                      <TableCell>{exam.title}</TableCell>
                      <TableCell>{exam.durationMinutes} mins</TableCell>
                      <TableCell>{exam.totalMarks}</TableCell>
                      <TableCell>{exam.passingPercentage}%</TableCell>
                      <TableCell>{formatDate(exam.startDate)}</TableCell>
                      <TableCell>{formatDate(exam.endDate)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={status.label} 
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Edit Exam">
                            <IconButton
                              component={Link}
                              to={`/admin/exams/edit/${exam.id}`}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Manage Questions">
                            <IconButton
                              component={Link}
                              to={`/admin/questions?examId=${exam.id}`}
                              color="info"
                            >
                              <QuestionsIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="View Results">
                            <IconButton
                              component={Link}
                              to={`/admin/results/${exam.id}`}
                              color="success"
                            >
                              <ResultsIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete Exam">
                            <IconButton
                              color="error"
                              onClick={() => openDeleteDialog(exam)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredExams.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the exam "{examToDelete?.title}"? 
            This action cannot be undone and will also delete all associated questions and results.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteExam} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExamList;
