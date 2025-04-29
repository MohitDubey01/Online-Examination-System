import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import examReducer from './reducers/examReducer';
import resultReducer from './reducers/resultReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    result: resultReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;