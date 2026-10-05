import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import usersReducer from '../features/users/states/usersSlice';
import profileReducer from '../features/users/states/profileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Reducer lain (misal: lostFounds, users) bisa ditambahkan di sini nanti
  },
});

export default store;