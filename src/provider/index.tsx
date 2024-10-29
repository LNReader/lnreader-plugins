import React from 'react';
import DialogProvider from './DialogProvider';
import { Backdrop, Box, CircularProgress, Container } from '@mui/material';
import { useAppStore } from '@store';

export default function AppProvider() {
  const loading = useAppStore(state => state.loading);
  return (
    <Container sx={{ position: 'absolute' }}>
      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.appBar + 1 }}
      >
        <Box sx={{ p: 4, bgcolor: 'InfoBackground' }}>
          <CircularProgress color="primary" />
        </Box>
      </Backdrop>
      <DialogProvider />
    </Container>
  );
}
