import api from '../../utils/api';
import {
  setLoading,
  getResults as getResultsAction,
  getResult as getResultAction,
  submitExam as submitExamAction,
  setError
} from '../reducers/resultReducer';

// Get all results for current user
export const getResults = () => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.get('/results');
    dispatch(getResultsAction(res.data));
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error fetching results'));
  }
};

// Get results by exam ID
export const getResultsByExamId = (examId) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.get(`/exams/${examId}/results`);
    dispatch(getResultsAction(res.data));
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error fetching results'));
  }
};

// Get result by ID
export const getResultById = (id) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.get(`/results/${id}`);
    dispatch(getResultAction(res.data));
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error fetching result'));
  }
};

// Submit exam answers
export const submitExam = (submissionData) => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await api.post('/submissions', submissionData);
    dispatch(submitExamAction(res.data));
    
    return res.data;
  } catch (err) {
    dispatch(setError(err.response?.data || 'Error submitting exam'));
    throw err;
  }
};