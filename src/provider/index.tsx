import React, { ReactNode, useEffect } from 'react';
import DialogProvider from './DialogProvider';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import { loadPlugins } from './plugins';
import { hideLoading } from '@redux/overlaySlice';

export default function AppProvider({ children }: { children: ReactNode }) {
  const loading = useSelector((state: AppState) => state.overlay.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    loadPlugins().then(() => dispatch(hideLoading()));
  }, []);
  return (
    <Box>
      {children}
      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.appBar + 1 }}
      >
        <Box sx={{ p: 4, bgcolor: 'InfoBackground' }}>
          <CircularProgress color="primary" />
        </Box>
      </Backdrop>
      <DialogProvider />
    </Box>
  );
}
