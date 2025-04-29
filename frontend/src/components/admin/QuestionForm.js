import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  FormHelperText,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getExams } from '../../store/actions/examActions';
import { 
  createQuestion, 
  getQuestionById, 
  updateQuestion 
} from '../../store/actions/examActions';

const QuestionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { exams } = useSelector(state => state.exam);
  const { question } = useSelector(state => state.exam);
  
  // Get examId from query params if available
  const queryParams = new URLSearchParams(location.search);
  const examIdFromQuery = queryParams.get('examId');
  
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'MCQ',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 1,
    examId: examIdFromQuery || ''
  });
  
  const [error, setError] = useState('');
  
  useEffect(() => {
    dispatch(getExams());
    
    if (id) {
      dispatch(getQuestionById(id));
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (id && question) {
      setFormData({
        questionText: question.questionText || '',
        questionType: question.questionType || 'MCQ',
        options: question.options?.length > 0 ? question.options : ['', '', '', ''],
        correctAnswer: question.correctAnswer || '',
        marks: question.marks || 1,
        examId: question.exam?.id || ''
      });
    }
  }, [id, question]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: updatedOptions
    }));
  };
  
  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };
  
  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const updatedOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: updatedOptions,
        correctAnswer: prev.correctAnswer === prev.options[index] ? '' : prev.correctAnswer
      }));
    }
  };
  
  const validateForm = () => {
    if (!formData.questionText.trim()) {
      setError('Question text is required');
      return false;
    }
    
    if (!formData.examId) {
      setError('Please select an exam');
      return false;
    }
    
    if (formData.questionType === 'MCQ') {
      // Check if at least 2 options are provided
      const validOptions = formData.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        setError('At least 2 options are required for MCQ');
        return false;
      }
      
      // Check if correct answer is among the options
      if (!formData.options.includes(formData.correctAnswer)) {
        setError('Correct answer must be one of the options');
        return false;
      }
    } else if (formData.questionType === 'TRUE_FALSE') {
      if (formData.correctAnswer !== 'True' && formData.correctAnswer !== 'False') {
        setError('Correct answer must be either True or False');
        return false;
      }
    } else if (!formData.correctAnswer.trim()) {
      setError('Correct answer is required');
      return false;
    }
    
    if (formData.marks <= 0) {
      setError('Marks must be greater than 0');
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
    
    // Prepare data for submission
    const questionData = { ...formData };
    
    // For TRUE_FALSE, we don't need options
    if (formData.questionType === 'TRUE_FALSE') {
      questionData.options = ['True', 'False'];
    }
    
    // Filter out empty options for other question types
    if (formData.questionType !== 'TRUE_FALSE') {
      questionData.options = formData.options.filter(opt => opt.trim() !== '');
    }
    
    try {
      if (id) {
        await dispatch(updateQuestion(id, questionData));
      } else {
        await dispatch(createQuestion(questionData));
      }
      
      // Navigate back to exam questions or admin dashboard
      if (formData.examId) {
        navigate(`/admin/exams/${formData.examId}`);
      } else {
        navigate('/admin/exams');
      }
    } catch (err) {
      setError(err.response?.data || 'Something went wrong');
    }
  };
  
  // Render question type specific forms
  const renderQuestionTypeFields = () => {
    switch (formData.questionType) {
      case 'MCQ':
        return (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Options
            </Typography>
            <List>
              {formData.options.map((option, index) => (
                <ListItem 
                  key={index}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => removeOption(index)}
                      disabled={formData.options.length <= 2}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemText>
                    <TextField
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      fullWidth
                      margin="dense"
                      label={`Option ${index + 1}`}
                      variant="outlined"
                      required
                    />
                  </ListItemText>
                </ListItem>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addOption}
                disabled={formData.options.length >= 10}
                sx={{ mt: 1 }}
              >
                Add Option
              </Button>
            </List>
          </Grid>
        );
      
      case 'TRUE_FALSE':
        return (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="correct-answer-label">Correct Answer</InputLabel>
              <Select
                labelId="correct-answer-label"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                label="Correct Answer"
              >
                <MenuItem value="True">True</MenuItem>
                <MenuItem value="False">False</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        );
      
      case 'SHORT_ANSWER':
        return (
          <Grid item xs={12}>
            <TextField
              name="correctAnswer"
              label="Correct Answer"
              value={formData.correctAnswer}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormHelperText>
              Enter the expected short answer
            </FormHelperText>
          </Grid>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Edit Question' : 'Create New Question'}
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
              <FormControl fullWidth required>
                <InputLabel id="exam-label">Select Exam</InputLabel>
                <Select
                  labelId="exam-label"
                  name="examId"
                  value={formData.examId}
                  onChange={handleChange}
                  label="Select Exam"
                >
                  {exams.map(exam => (
                    <MenuItem key={exam.id} value={exam.id}>
                      {exam.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="questionText"
                label="Question Text"
                value={formData.questionText}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="question-type-label">Question Type</InputLabel>
                <Select
                  labelId="question-type-label"
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleChange}
                  label="Question Type"
                >
                  <MenuItem value="MCQ">Multiple Choice</MenuItem>
                  <MenuItem value="TRUE_FALSE">True/False</MenuItem>
                  <MenuItem value="SHORT_ANSWER">Short Answer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="marks"
                label="Marks"
                type="number"
                value={formData.marks}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            {renderQuestionTypeFields()}
            
            {formData.questionType === 'MCQ' && (
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="correct-answer-label">Correct Answer</InputLabel>
                  <Select
                    labelId="correct-answer-label"
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                    label="Correct Answer"
                  >
                    {formData.options.map((option, index) => (
                      option.trim() && (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      )
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {id ? 'Update Question' : 'Create Question'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => formData.examId ? 
                    navigate(`/admin/exams/${formData.examId}`) : 
                    navigate('/admin/exams')}
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

export default QuestionForm;
