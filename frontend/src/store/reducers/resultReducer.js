import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  results: [],
  result: null,
  loading: false,
  error: null
};

const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    
    getResults: (state, action) => {
      state.results = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    getResult: (state, action) => {
      state.result = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    submitExam: (state, action) => {
      state.results = [action.payload, ...state.results];
      state.result = action.payload;
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
  getResults,
  getResult,
  submitExam,
  setError
} = resultSlice.actions;

export default resultSlice.reducer;