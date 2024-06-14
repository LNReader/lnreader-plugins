import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Search, Translate } from '@mui/icons-material';
import { searchPlugins } from '@provider/plugins';

export default function () {
  const [keyword, setKeyword] = React.useState('');
  React.useEffect(() => {
    const plugins = searchPlugins(keyword);
    console.log(plugins.length);
  }, [keyword]);
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" color="inherit" elevation={0}>
        <Toolbar>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Seach plugin"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
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
