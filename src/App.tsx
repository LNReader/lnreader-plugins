import React from 'react';
import './App.css';
import {
  Container,
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import Appbar from '@components/Appbar';
import AppProvider from './provider';
import PopularNovels from '@components/accordions/PopularNovels';
import SearchNovels from '@components/accordions/SearchNovels';
import ParseNovel from '@components/accordions/ParseNovel';
import ParseChapter from '@components/accordions/ParseChapter';
import HeadersSection from '@components/accordions/Headers';

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
        <Container
          sx={{
            mt: 6,
            width: { sm: 500, md: 1024, lg: '90vw' },
          }}
        >
          <HeadersSection />
          <PopularNovels />
          <SearchNovels />
          <ParseNovel />
          <ParseChapter />
        </Container>
        <AppProvider />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
