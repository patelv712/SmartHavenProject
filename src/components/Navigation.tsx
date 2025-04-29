import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';

const Navigation: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Device Monitoring', icon: <DashboardIcon /> },
    { path: '/real-time', label: 'Real-Time Control', icon: <SettingsRemoteIcon /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <LeaderboardIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box 
              component="span"
              sx={{ 
                mr: 1, 
                display: 'inline-flex', 
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                p: 0.5,
                borderRadius: 1
              }}
            >
              SH
            </Box>
            {!isMobile && 'SmartHaven'}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                color="inherit"
                sx={{ 
                  mx: isMobile ? 0.5 : 1,
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  borderBottom: isActive(item.path) ? '3px solid white' : 'none',
                  borderRadius: 0,
                  paddingBottom: isActive(item.path) ? '5px' : '8px'
                }}
              >
                {isMobile ? item.icon : (
                  <>
                    {item.icon}
                    <Box component="span" sx={{ ml: 1 }}>
                      {item.label}
                    </Box>
                  </>
                )}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;