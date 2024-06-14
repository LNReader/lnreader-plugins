import React from 'react';
import './App.css';
import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import Appbar from '@components/Appbar';
import { Provider } from 'react-redux';
import store from '@redux/store';
import AppProvider from './provider';

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
    <Provider store={store}>
      <AppProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Appbar />
          </ThemeProvider>
        </StyledEngineProvider>
      </AppProvider>
    </Provider>
  );
}

export default App;
