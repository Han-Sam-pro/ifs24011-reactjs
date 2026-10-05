import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store';
import App from './App.jsx';
import './index.css';

import { getAccessToken } from './helpers/apiHelper';
import { setAuthToken } from './states/auth/authSlice';

// Rehidrasi auth token dari localStorage saat inisialisasi aplikasi
const token = getAccessToken();
if (token) {
  store.dispatch(setAuthToken(token));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);