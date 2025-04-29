import React from 'react';
import {
  Container,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Paper
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import IndividualLeaderboard from './IndividualLeaderboard';
import FloorLeaderboard from './FloorLeaderboard';
import { useAppContext } from '../../context/AppContext';

const LeaderboardPage: React.FC = () => {
  const { viewMode, setViewMode } = useAppContext();
  
  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: 'individual' | 'floor' | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Energy Savings Leaderboard
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            color="primary"
          >
            <ToggleButton value="individual" aria-label="individual view">
              <PersonIcon sx={{ mr: 1 }} />
              Individual Residents
            </ToggleButton>
            <ToggleButton value="floor" aria-label="floor view">
              <ApartmentIcon sx={{ mr: 1 }} />
              By Floor
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {viewMode === 'individual' 
            ? 'View energy savings rankings for individual residents' 
            : 'View aggregated energy savings by floor'}
        </Typography>
      </Paper>
      
      {viewMode === 'individual' ? (
        <IndividualLeaderboard />
      ) : (
        <FloorLeaderboard />
      )}
    </Container>
  );
};

export default LeaderboardPage;