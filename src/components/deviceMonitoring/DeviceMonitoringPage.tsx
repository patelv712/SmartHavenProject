import React from 'react';
import { Container, Grid, Paper, Box, Typography } from '@mui/material';
import DeviceList from './DeviceList';
import DeviceDetail from './DeviceDetail';

const DeviceMonitoringPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom mb={5}>
        Device Monitoring
      </Typography>
      <Grid container spacing={3} justifyContent={"center"} justifyItems={"center"}>
        <Grid>
          <Paper elevation={2} sx={{ height: '100%' }}>
            <DeviceList />
          </Paper>
        </Grid>
        <Grid>
          <Paper elevation={2}>
            <DeviceDetail />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeviceMonitoringPage;