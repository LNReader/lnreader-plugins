import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Search, Translate } from '@mui/icons-material';

export default function () {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" color="inherit" elevation={0}>
        <Toolbar>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Seach plugin"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: { md: 250, lg: 434 } }}
          />
          <InputAdornment position="end">
            <Button variant="contained" endIcon={<Translate />}>
              Language
            </Button>
          </InputAdornment>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
