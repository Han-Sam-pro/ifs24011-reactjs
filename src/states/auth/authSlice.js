import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register } from '../../api/authApi';

// 1. IMPORT getAccessToken DITAMBAHKAN DI SINI
import { getAccessToken, putAccessToken, removeAccessToken } from '../../helpers/apiHelper';
import { showSuccessDialog, showErrorDialog } from '../../helpers/toolsHelper';

// --- ASYNC THUNKS ---

// Action Creator untuk Register
export const asyncRegisterUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await register({ name, email, password });
      showSuccessDialog('Registrasi berhasil! Silakan login untuk melanjutkan.');
      return response.data;
    } catch (error) {
      showErrorDialog(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Action Creator untuk Login
export const asyncLoginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await login({ email, password });
      // Ekstraksi token aman (mendukung response.data.token maupun response.token)
      const token = response.data?.token || response.token; 
      
      if (!token) {
        throw new Error('Token tidak ditemukan dalam respon server.');
      }

      putAccessToken(token); // Simpan token ke localStorage
      showSuccessDialog('Login berhasil!');
      return token;
    } catch (error) {
      showErrorDialog(error.message);
      return rejectWithValue(error.message);
    }
  }
);


// --- SLICE REDUCERS ---
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // 2. TOKEN LANGSUNG DIBACA DARI LOCALSTORAGE SAAT REFRESH
    token: getAccessToken() || null,
    isAuthLogin: false,  
    isAuthRegister: false,
  },
  reducers: {
    // Action Creator & Reducer untuk Logout
    isAuthLogout: (state) => {
      state.token = null;
      removeAccessToken();
      showSuccessDialog('Anda telah berhasil logout.');
    },
    // Menyimpan token jika dibutuhkan secara manual
    setAuthToken: (state, action) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Penanganan state saat Login
      .addCase(asyncLoginUser.pending, (state) => {
        state.isAuthLogin = true;
      })
      .addCase(asyncLoginUser.fulfilled, (state, action) => {
        state.isAuthLogin = false;
        state.token = action.payload;
      })
      .addCase(asyncLoginUser.rejected, (state) => {
        state.isAuthLogin = false;
      })
      
      // Penanganan state saat Register
      .addCase(asyncRegisterUser.pending, (state) => {
        state.isAuthRegister = true;
      })
      .addCase(asyncRegisterUser.fulfilled, (state) => {
        state.isAuthRegister = false;
      })
      .addCase(asyncRegisterUser.rejected, (state) => {
        state.isAuthRegister = false;
      });
  }
});

// Export Action Types & Creators
export const { isAuthLogout, setAuthToken } = authSlice.actions;

// Export Reducer Utama
export default authSlice.reducer;