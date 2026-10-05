import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyProfile, updateMyProfile, uploadMyPhoto, changeMyPassword } from '../api/userApi';
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper';

export const asyncReceiveProfile = createAsyncThunk('profile/receive', async (_, { rejectWithValue }) => {
  try {
    const response = await getMyProfile();
    return response.data.user;
  } catch (error) {
    showErrorDialog(error.message);
    return rejectWithValue(error.message);
  }
});

export const asyncUpdateProfile = createAsyncThunk('profile/update', async (payload, { rejectWithValue }) => {
  try {
    const response = await updateMyProfile(payload);
    showSuccessDialog('Profil berhasil diperbarui!');
    return response.data.user;
  } catch (error) {
    showErrorDialog(error.message);
    return rejectWithValue(error.message);
  }
});

export const asyncChangePassword = createAsyncThunk('profile/password', async (payload, { rejectWithValue }) => {
  try {
    await changeMyPassword(payload);
    showSuccessDialog('Kata sandi berhasil diubah!');
  } catch (error) {
    showErrorDialog(error.message);
    return rejectWithValue(error.message);
  }
});

export const asyncChangePhoto = createAsyncThunk('profile/photo', async (file, { rejectWithValue }) => {
  try {
    const response = await uploadMyPhoto(file);
    showSuccessDialog('Foto profil berhasil diperbarui!');
    return response.data.user; // Mengembalikan data profil baru (yg memuat URL foto baru)
  } catch (error) {
    showErrorDialog(error.message);
    return rejectWithValue(error.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    isProfile: false,
    isChangeProfile: false,
    isChangeProfilePhoto: false,
    isChangeProfilePassword: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Receive Profile
      .addCase(asyncReceiveProfile.pending, (state) => { state.isProfile = true; })
      .addCase(asyncReceiveProfile.fulfilled, (state, action) => {
        state.isProfile = false;
        state.profile = action.payload;
      })
      .addCase(asyncReceiveProfile.rejected, (state) => { state.isProfile = false; })
      
      // Update Profile
      .addCase(asyncUpdateProfile.pending, (state) => { state.isChangeProfile = true; })
      .addCase(asyncUpdateProfile.fulfilled, (state, action) => {
        state.isChangeProfile = false;
        if (action.payload) state.profile = action.payload; // Update data di store
      })
      .addCase(asyncUpdateProfile.rejected, (state) => { state.isChangeProfile = false; })

      // Change Password
      .addCase(asyncChangePassword.pending, (state) => { state.isChangeProfilePassword = true; })
      .addCase(asyncChangePassword.fulfilled, (state) => { state.isChangeProfilePassword = false; })
      .addCase(asyncChangePassword.rejected, (state) => { state.isChangeProfilePassword = false; })

      // Change Photo
      .addCase(asyncChangePhoto.pending, (state) => { state.isChangeProfilePhoto = true; })
      .addCase(asyncChangePhoto.fulfilled, (state, action) => {
        state.isChangeProfilePhoto = false;
        if (action.payload) state.profile = action.payload;
      })
      .addCase(asyncChangePhoto.rejected, (state) => { state.isChangeProfilePhoto = false; });
  },
});

export default profileSlice.reducer;