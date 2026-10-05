import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers } from '../api/userApi';
import { showErrorDialog } from '../../../helpers/toolsHelper';

// Async Thunk untuk mengambil semua pengguna
export const asyncReceiveUsers = createAsyncThunk(
  'users/receiveUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsers();
      return response.data.users; // Asumsi API mereturn { data: { users: [...] } }
    } catch (error) {
      showErrorDialog(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    isUsersLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncReceiveUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(asyncReceiveUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(asyncReceiveUsers.rejected, (state) => {
        state.isUsersLoading = false;
      });
  },
});

export default usersSlice.reducer;  