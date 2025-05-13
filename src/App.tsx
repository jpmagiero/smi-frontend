import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import SideBar from './presentation/components/shared/SideBar';
import DemandsPage from './presentation/pages/DemandsPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F05225',
    },
    secondary: {
      main: '#1C1C1C',
    },
    background: {
      default: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#F05225',
          color: 'white',
          '&:hover': {
            backgroundColor: '#F36E38',
          },
        },
      },
    },
  },
});

function App() {
  const [activeSection, setActiveSection] = useState<string>('demands');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="layout">
        <SideBar activeItem={activeSection} onNavigate={handleNavigate} />
        <main className="content">
          {activeSection === 'demands' && <DemandsPage />}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App; 