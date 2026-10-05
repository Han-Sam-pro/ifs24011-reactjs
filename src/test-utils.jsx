import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import authReducer from './states/auth/authSlice';
import usersReducer from './features/users/states/usersSlice';
import profileReducer from './features/users/states/profileSlice';
import lostFoundReducer from './features/lost_and_found/states/lostFoundSlice'

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Store terisolasi untuk tiap sesi pengujian
    store = configureStore({
      reducer: {
        auth: authReducer,
        users: usersReducer,
        profile: profileReducer,
        lostFounds: lostFoundReducer,
      },
      preloadedState,
    }),
    initialEntries = ['/'],
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}