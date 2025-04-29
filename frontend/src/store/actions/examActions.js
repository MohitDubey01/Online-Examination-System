import api from '../../utils/api';
import {
  setLoading,
  getExams as getExamsAction,
  getExam as getExamAction,
  createExam as createExamAction,
  updateExam as updateExamAction,
  deleteExam as deleteExamAction,
  getQuestions as getQuestionsAction,
  getQuestion as getQuestionAction,
  createQuestion as createQuestionAction,
  updateQuestion as updateQuestionAction,
  deleteQuestion as deleteQuestionAction,
  setError
} from '../reducers/examReducer';

// Get all exams
export const getExams = () => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.get('/exams');
    dispatch(getExamsAction(res.data));
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error fetching exams'));
  }
};

// Get exam by ID
export const getExamById = (id) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.get(`/exams/${id}`);
    dispatch(getExamAction(res.data));
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error fetching exam'));
  }
};

// Create new exam
export const createExam = (formData) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.post('/exams', formData);
    dispatch(createExamAction(res.data));
    
    return res.data;
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error creating exam'));
    throw err;
  }
};

// Update exam
export const updateExam = (id, formData) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.put(`/exams/${id}`, formData);
    dispatch(updateExamAction(res.data));
    
    return res.data;
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error updating exam'));
    throw err;
  }
};

// Delete exam
export const deleteExam = (id) => async dispatch => {
  try {
    await api.delete(`/exams/${id}`);
    dispatch(deleteExamAction(id));
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error deleting exam'));
    throw err;
  }
};

// Get questions by exam ID
export const getQuestionsByExamId = (examId) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.get(`/exams/${examId}/questions`);
    dispatch(getQuestionsAction(res.data));
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error fetching questions'));
  }
};

// Get question by ID
export const getQuestionById = (id) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.get(`/questions/${id}`);
    dispatch(getQuestionAction(res.data));
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error fetching question'));
  }
};

// Create new question
export const createQuestion = (formData) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.post('/questions', formData);
    dispatch(createQuestionAction(res.data));
    
    return res.data;
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error creating question'));
    throw err;
  }
};

// Update question
export const updateQuestion = (id, formData) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.put(`/questions/${id}`, formData);
    dispatch(updateQuestionAction(res.data));
    
    return res.data;
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error updating question'));
    throw err;
  }
};

// Delete question
export const deleteQuestion = (id) => async dispatch => {
  try {
    await api.delete(`/questions/${id}`);
    dispatch(deleteQuestionAction(id));
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error deleting question'));
    throw err;
  }
};