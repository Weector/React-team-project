import storage from 'redux-persist/lib/storage';
import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { dailyRate, dailyRateById } from './dailtyRateOperations';
import { addProduct, getInfoForDay } from 'redux/products/productsOperations';

const initialState = {
  dailyRate: null,
  notAllowedProducts: [],
  summaries: [],
  loading: false,
  error: '',
};

const handlePending = state => {
  state.dailyRate = null;
  state.notAllowedProducts = [];
  state.summaries = [];
  state.loading = true;
  state.error = '';
};
const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const dailyRateSlice = createSlice({
  name: 'dailyRate',
  initialState,
  extraReducers: builder => {
    // Without id user
    builder
      .addCase(dailyRate.pending, handlePending)
      .addCase(dailyRate.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.dailyRate = payload.dailyRate;
        state.notAllowedProducts = payload.notAllowedProducts;
      })
      .addCase(dailyRate.rejected, handleRejected);

    // With id user
    builder
      .addCase(dailyRateById.pending, handlePending)
      .addCase(dailyRateById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.dailyRate = payload.dailyRate;
        state.notAllowedProducts = payload.notAllowedProducts;
        state.summaries = payload.summaries;
      })
      .addCase(dailyRateById.rejected, handleRejected);
    builder.addCase(getInfoForDay.fulfilled, (state, action) => {
      // state.summaries = state.summaries.map(item => {
      //   if (item.date === action.payload.daySummary.date) {
      //     return action.payload.daySummary;
      //   }
      //   return item;
      // });
      state.summaries.push(action.payload.daySummary);
    });
  },
});

const persistConfig = {
  key: 'watermelon/slimMom/dailyRate',
  storage,
  whitelist: ['dailyRate', 'notAllowedProducts'],
};

export const persistedDailyRateReducer = persistReducer(
  persistConfig,
  dailyRateSlice.reducer
);
