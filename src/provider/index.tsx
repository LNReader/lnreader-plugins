import React, { ReactNode } from 'react';
import DialogProvider from './DialogProvider';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';

export default function AppProvider({ children }: { children: ReactNode }) {
  const loading = useSelector((state: AppState) => state.loading);
  console.log(loading);

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
