import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Divider,
  LinearProgress,
  Alert,
  IconButton,
  Stack
} from '@mui/material';
import { 
  NavigateNext as NextIcon, 
  NavigateBefore as PrevIcon,
  Flag as FlagIcon,
  CheckCircle as SubmitIcon
} from '@mui/icons-material';
import Timer from '../common/Timer';
import { getExamById } from '../../store/actions/examActions';
import { getQuestionsByExamId } from '../../store/actions/examActions';
import { submitExam } from '../../store/actions/resultActions';

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { exam, loading: examLoading } = useSelector(state => state.exam);
  const { questions, loading: questionsLoading } = useSelector(state => state.exam);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [timeUpDialogOpen, setTimeUpDialogOpen] = useState(false);
  const [examSubmitting, setExamSubmitting] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      dispatch(getExamById(id));
      dispatch(getQuestionsByExamId(id));
    }
  }, [dispatch, id]);
  
  // Initialize answers object
  useEffect(() => {
    if (questions && questions.length > 0) {
      const initialAnswers = {};
      questions.forEach(question => {
        initialAnswers[question.id] = '';
      });
      setAnswers(initialAnswers);
    }
  }, [questions]);
  
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleJumpToQuestion = (step) => {
    setCurrentStep(step);
  };
  
  const toggleFlagQuestion = (index) => {
    setFlaggedQuestions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  
  const handleTimeUp = useCallback(() => {
    setTimeUpDialogOpen(true);
  }, []);
  
  const handleTimeTick = useCallback((seconds) => {
    setSecondsElapsed(seconds);
  }, []);
  
  const handleSubmitExam = async () => {
    setExamSubmitting(true);
    setError('');
    
    try {
      const submissionData = {
        examId: parseInt(id, 10),
        answers: answers,
        timeTakenInSeconds: secondsElapsed
      };
      
      const result = await dispatch(submitExam(submissionData));
      
      // Navigate to result page
      navigate(`/student/results/${result.id}`);
    } catch (err) {
      setError('Failed to submit exam. Please try again.');
      setExamSubmitting(false);
      setConfirmSubmitOpen(false);
    }
  };
  
  const isExamReady = !examLoading && !questionsLoading && exam && questions && questions.length > 0;
  const currentQuestion = isExamReady && questions[currentStep];
  
  // Count answered questions
  const answeredCount = Object.values(answers).filter(answer => answer.trim() !== '').length;
  
  // Render loading state
  if (examLoading || questionsLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Loading Exam...
          </Typography>
          <LinearProgress />
        </Paper>
      </Container>
    );
  }
  
  // Render error state if exam or questions not found
  if (!exam || !questions || questions.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Alert severity="error">
            Exam not found or no questions available. Please go back and try again.
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/student/exams')} 
            sx={{ mt: 2 }}
          >
            Back to Exams
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Exam Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {exam.title}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          {/* Timer and Progress Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Total Questions: {questions.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Marks: {exam.totalMarks}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Passing Percentage: {exam.passingPercentage}%
              </Typography>
            </Box>
            
            <Box sx={{ width: 200 }}>
              <Timer 
                durationInMinutes={exam.durationMinutes} 
                onTimeUp={handleTimeUp}
                onTick={handleTimeTick}
              />
            </Box>
          </Box>
          
          {/* Question progress */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={(answeredCount / questions.length) * 100} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2">
              {answeredCount} / {questions.length} answered
            </Typography>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Question Navigation - Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }}>
          <Stepper 
            activeStep={currentStep} 
            alternativeLabel
            nonLinear
          >
            {questions.map((question, index) => {
              const isAnswered = answers[question.id] && answers[question.id].trim() !== '';
              const isFlagged = flaggedQuestions.includes(index);
              
              return (
                <Step 
                  key={index} 
                  completed={isAnswered}
                  onClick={() => handleJumpToQuestion(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  <StepLabel
                    optional={isFlagged ? <FlagIcon color="warning" fontSize="small" /> : null}
                    error={isFlagged && !isAnswered}
                  >
                    {`Q${index + 1}`}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
        
        {/* Question Navigation - Mobile */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {questions.map((question, index) => {
            const isAnswered = answers[question.id] && answers[question.id].trim() !== '';
            const isFlagged = flaggedQuestions.includes(index);
            const isActive = index === currentStep;
            
            return (
              <Button
                key={index}
                variant={isActive ? "contained" : "outlined"}
                color={isFlagged ? "warning" : isAnswered ? "success" : "primary"}
                size="small"
                onClick={() => handleJumpToQuestion(index)}
                sx={{ minWidth: 40 }}
              >
                {index + 1}
              </Button>
            );
          })}
        </Box>
        
        {/* Current Question */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Question {currentStep + 1} of {questions.length}
            </Typography>
            <Box>
              <IconButton 
                color={flaggedQuestions.includes(currentStep) ? "warning" : "default"}
                onClick={() => toggleFlagQuestion(currentStep)}
                title={flaggedQuestions.includes(currentStep) ? "Unflag question" : "Flag question for review"}
              >
                <FlagIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            {currentQuestion.questionText}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            ({currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'})
          </Typography>
          
          {/* Question type specific rendering */}
          {currentQuestion.questionType === 'MCQ' && (
            <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
              <FormLabel component="legend">Select one option:</FormLabel>
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          
          {currentQuestion.questionType === 'TRUE_FALSE' && (
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Select True or False:</FormLabel>
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              >
                <FormControlLabel value="True" control={<Radio />} label="True" />
                <FormControlLabel value="False" control={<Radio />} label="False" />
              </RadioGroup>
            </FormControl>
          )}
          
          {currentQuestion.questionType === 'SHORT_ANSWER' && (
            <TextField
              fullWidth
              label="Your Answer"
              variant="outlined"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
          )}
        </Box>
        
        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            startIcon={<PrevIcon />}
          >
            Previous
          </Button>
          
          <Stack direction="row" spacing={2}>
            {currentStep === questions.length - 1 ? (
              <Button
                variant="contained"
                color="success"
                onClick={() => setConfirmSubmitOpen(true)}
                endIcon={<SubmitIcon />}
                disabled={examSubmitting}
              >
                Submit Exam
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<NextIcon />}
              >
                Next
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>
      
      {/* Confirm Submit Dialog */}
      <Dialog
        open={confirmSubmitOpen}
        onClose={() => !examSubmitting && setConfirmSubmitOpen(false)}
      >
        <DialogTitle>Submit Exam</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit your exam?
            <br /><br />
            You have answered {answeredCount} out of {questions.length} questions.
            {answeredCount < questions.length && (
              <Box component="span" fontWeight="bold">
                {" "}There are {questions.length - answeredCount} unanswered questions.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => !examSubmitting && setConfirmSubmitOpen(false)} 
            disabled={examSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitExam} 
            autoFocus 
            variant="contained" 
            color="primary"
            disabled={examSubmitting}
          >
            {examSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Time Up Dialog */}
      <Dialog
        open={timeUpDialogOpen}
        disableEscapeKeyDown
        disableEnforceFocus
      >
        <DialogTitle>Time's Up!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The time allocated for this exam has ended. Your answers will now be submitted automatically.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleSubmitExam} 
            autoFocus 
            variant="contained" 
            color="primary"
            disabled={examSubmitting}
          >
            {examSubmitting ? 'Submitting...' : 'Submit Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TakeExam;
