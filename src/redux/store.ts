import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './dialogSlice';
import overlaySlice from './overlaySlice';

const store = configureStore({
  reducer: {
    dialog: dialogReducer,
    overlay: overlaySlice,
  },
});

export default store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
