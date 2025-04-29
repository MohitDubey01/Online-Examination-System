import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  exams: [],
  exam: null,
  questions: [],
  question: null,
  loading: false,
  error: null
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    
    getExams: (state, action) => {
      state.exams = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    getExam: (state, action) => {
      state.exam = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    createExam: (state, action) => {
      state.exams = [action.payload, ...state.exams];
      state.loading = false;
      state.error = null;
    },
    
    updateExam: (state, action) => {
      state.exams = state.exams.map(exam => 
        exam.id === action.payload.id ? action.payload : exam
      );
      state.exam = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    deleteExam: (state, action) => {
      state.exams = state.exams.filter(exam => exam.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    
    getQuestions: (state, action) => {
      state.questions = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    getQuestion: (state, action) => {
      state.question = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    createQuestion: (state, action) => {
      state.questions = [action.payload, ...state.questions];
      state.loading = false;
      state.error = null;
    },
    
    updateQuestion: (state, action) => {
      state.questions = state.questions.map(question => 
        question.id === action.payload.id ? action.payload : question
      );
      state.question = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    deleteQuestion: (state, action) => {
      state.questions = state.questions.filter(question => question.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { 
  setLoading,
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  setError
} = examSlice.actions;

export default examSlice.reducer;