import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import DeviceMonitoringPage from './components/deviceMonitoring/DeviceMonitoringPage';
import RealTimeControlPage from './components/realTimeControl/RealTimeControlPage';
import LeaderboardPage from './components/leaderboard/LeaderboardPage';
import SettingsPage from './components/settings/SettingsPage';
import './App.css';

// Create a custom theme with Instacart-like colors
const theme = createTheme({
  palette: {
    primary: {
      // Instacart green color
      main: '#0AAD0A',
      light: '#43c543',
      dark: '#007900',
      contrastText: '#ffffff',
    },
    secondary: {
      // Instacart accent color (orange)
      main: '#F7A74A',
      light: '#FFD89B',
      dark: '#C67700',
      contrastText: '#000000',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#343538',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <div className="App">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<DeviceMonitoringPage />} />
                <Route path="/real-time" element={<RealTimeControlPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
