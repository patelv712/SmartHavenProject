import React from 'react';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import DeviceControls from './DeviceControls';
import TimeIntervalSelector from './TimeIntervalSelector';
import EnergySavingsSummary from './EnergySavingsSummary';

const RealTimeControlPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom mb={5}>
        Real‑Time Monitoring & Control
      </Typography>

      <Grid container spacing={3} justifyContent={"center"}>
        {/* Left column: timer + device controls */}
          <TimeIntervalSelector />
          <DeviceControls />
          <EnergySavingsSummary />
        </Grid>
    </Container>
  );
};

export default RealTimeControlPage;
