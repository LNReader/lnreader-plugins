import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './dialogSlice';
import loadingReducer from './loadingSlice';

const store = configureStore({
  reducer: {
    dialog: dialogReducer,
    loading: loadingReducer,
  },
});

export default store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
