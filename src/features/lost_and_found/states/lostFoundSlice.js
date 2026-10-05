import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getLostFounds, 
  getLostFoundDetail, 
  createLostFound, 
  updateLostFound, 
  uploadLostFoundCover, 
  deleteLostFound,
  getMonthlyStats 
} from '../api/lostFoundApi';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

// Async Thunks
export const asyncReceiveLostFounds = createAsyncThunk(
  'lostFounds/receive',
  async (filterParams = {}, { rejectWithValue }) => {
    try {
      const response = await getLostFounds(filterParams);
      return response.data?.lost_founds || response.data || [];
    } catch (error) {
      showErrorDialog(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncReceiveLostFoundDetail = createAsyncThunk(
  'lostFounds/detail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getLostFoundDetail(id);
      return response.data?.lost_found || response.data;
    } catch (error) {
      showErrorDialog(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncAddLostFound = createAsyncThunk(
  'lostFounds/add',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createLostFound(payload);
      showSuccessDialog('Laporan barang berhasil ditambahkan!');
      return response.data?.lost_found || response.data;
    } catch (error) {
      showErrorDialog(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncChangeLostFound = createAsyncThunk(
  'lostFounds/change',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await updateLostFound(id, payload);
      showSuccessDialog('Laporan barang berhasil diperbarui!');
      return response.data?.lost_found || response.data;
    } catch (error) {
      showErrorDialog(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncChangeCover = createAsyncThunk(
  'lostFounds/changeCover',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const response = await uploadLostFoundCover(id, file);
      showSuccessDialog('Cover barang berhasil diperbarui!');
      return response.data?.lost_found || response.data;
    } catch (error) {
      showErrorDialog(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncDeleteLostFound = createAsyncThunk(
  'lostFounds/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteLostFound(id);
      showSuccessDialog('Laporan barang berhasil dihapus!');
      return id;
    } catch (error) {
      showErrorDialog(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncReceiveStats = createAsyncThunk(
  'lostFounds/stats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMonthlyStats();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const lostFoundSlice = createSlice({
  name: 'lostFounds',
  initialState: {
    lostFounds: [],
    lostFound: null,
    isLostFound: false,

    // Pelacakan proses aksi
    isLostFoundAdd: false,
    isLostFoundAdded: false,

    isLostFoundChange: false,
    isLostFoundChanged: false,

    isLostFoundChangeCover: false,
    isLostFoundChangedCover: false,

    isLostFoundDelete: false,
    isLostFoundDeleted: false,

    // Pelacakan statistik
    lostFoundStats: null,
  },
  reducers: {
    resetLostFoundStatus: (state) => {
      state.isLostFoundAdded = false;
      state.isLostFoundChanged = false;
      state.isLostFoundChangedCover = false;
      state.isLostFoundDeleted = false;
    },
    clearLostFoundDetail: (state) => {
      state.lostFound = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Receive List
      .addCase(asyncReceiveLostFounds.pending, (state) => { state.isLostFound = true; })
      .addCase(asyncReceiveLostFounds.fulfilled, (state, action) => {
        state.isLostFound = false;
        state.lostFounds = action.payload;
      })
      .addCase(asyncReceiveLostFounds.rejected, (state) => { state.isLostFound = false; })

      // Detail
      .addCase(asyncReceiveLostFoundDetail.pending, (state) => { state.isLostFound = true; })
      .addCase(asyncReceiveLostFoundDetail.fulfilled, (state, action) => {
        state.isLostFound = false;
        state.lostFound = action.payload;
      })
      .addCase(asyncReceiveLostFoundDetail.rejected, (state) => { state.isLostFound = false; })

      // Add
      .addCase(asyncAddLostFound.pending, (state) => {
        state.isLostFoundAdd = true;
        state.isLostFoundAdded = false;
      })
      .addCase(asyncAddLostFound.fulfilled, (state) => {
        state.isLostFoundAdd = false;
        state.isLostFoundAdded = true;
      })
      .addCase(asyncAddLostFound.rejected, (state) => {
        state.isLostFoundAdd = false;
        state.isLostFoundAdded = false;
      })

      // Change
      .addCase(asyncChangeLostFound.pending, (state) => {
        state.isLostFoundChange = true;
        state.isLostFoundChanged = false;
      })
      .addCase(asyncChangeLostFound.fulfilled, (state, action) => {
        state.isLostFoundChange = false;
        state.isLostFoundChanged = true;
        if (action.payload) state.lostFound = action.payload;
      })
      .addCase(asyncChangeLostFound.rejected, (state) => {
        state.isLostFoundChange = false;
      })

      // Change Cover
      .addCase(asyncChangeCover.pending, (state) => {
        state.isLostFoundChangeCover = true;
        state.isLostFoundChangedCover = false;
      })
      .addCase(asyncChangeCover.fulfilled, (state, action) => {
        state.isLostFoundChangeCover = false;
        state.isLostFoundChangedCover = true;
        if (action.payload) state.lostFound = action.payload;
      })
      .addCase(asyncChangeCover.rejected, (state) => {
        state.isLostFoundChangeCover = false;
      })

      // Delete
      .addCase(asyncDeleteLostFound.pending, (state) => {
        state.isLostFoundDelete = true;
        state.isLostFoundDeleted = false;
      })
      .addCase(asyncDeleteLostFound.fulfilled, (state, action) => {
        state.isLostFoundDelete = false;
        state.isLostFoundDeleted = true;
        state.lostFounds = state.lostFounds.filter((item) => item.id !== action.payload);
      })
      .addCase(asyncDeleteLostFound.rejected, (state) => {
        state.isLostFoundDelete = false;
      })

      // Stats
      .addCase(asyncReceiveStats.fulfilled, (state, action) => {
        state.lostFoundStats = action.payload;
      });
  }
});

export const { resetLostFoundStatus, clearLostFoundDetail } = lostFoundSlice.actions;
export default lostFoundSlice.reducer;