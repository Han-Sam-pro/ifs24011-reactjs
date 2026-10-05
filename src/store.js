import { configureStore } from '@reduxjs/toolkit';

// Reducers dari modul Auth
import authReducer from './states/auth/authSlice';

// Reducers dari modul Users & Profile
import usersReducer from './features/users/states/usersSlice';
import profileReducer from './features/users/states/profileSlice';

// Reducers dari modul Lost & Founds
import lostFoundReducer from './features/lost_and_found/states/lostFoundSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    profile: profileReducer,
    lostFounds: lostFoundReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;