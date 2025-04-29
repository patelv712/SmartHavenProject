import React from 'react';
import {
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box
} from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import { TimeInterval } from '../../types';

const TimeIntervalSelector: React.FC = () => {
  const { timeInterval, setTimeInterval } = useAppContext();
  
  const handleIntervalChange = (
    event: React.MouseEvent<HTMLElement>,
    newInterval: number | null
  ) => {
    if (newInterval !== null) {
      setTimeInterval(newInterval);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Simulation Time Interval
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select the time period for energy savings calculation
      </Typography>
      <Box display="flex" justifyContent="center">
        <ToggleButtonGroup
          value={timeInterval}
          exclusive
          onChange={handleIntervalChange}
          aria-label="time interval"
          color="primary"
          sx={{ mb: 1 }}
        >
          <ToggleButton value={TimeInterval.ONE_HOUR} aria-label="1 hour">
            1h
          </ToggleButton>
          <ToggleButton value={TimeInterval.SIX_HOURS} aria-label="6 hours">
            6h
          </ToggleButton>
          <ToggleButton value={TimeInterval.TWELVE_HOURS} aria-label="12 hours">
            12h
          </ToggleButton>
          <ToggleButton value={TimeInterval.TWENTY_FOUR_HOURS} aria-label="24 hours">
            24h
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
};

export default TimeIntervalSelector;