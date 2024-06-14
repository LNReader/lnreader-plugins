import { createSlice } from '@reduxjs/toolkit';

const initialState = true;

export const loadingSlice = createSlice({
  name: 'dialog',
  initialState: initialState,
  reducers: {
    showLoading(state) {
      state = true;
    },
    hideLoading(state) {
      state = false;
    },
  },
});

export const { showLoading, hideLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
