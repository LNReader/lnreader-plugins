import React from 'react';
import './App.css';
import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import Appbar from '@components/Appbar';

function App() {
  const theme = createTheme({
    components: {
      // Name of the component
      MuiButtonBase: {
        defaultProps: {
          // The props to change the default for.
          disableRipple: true, // No more ripple, on the whole application 💣!
        },
      },
    },
  });
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Appbar />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
