import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Divider,
  Alert,
  InputAdornment,
  Card, 
  CardContent
} from '@mui/material';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAppContext } from '../../context/AppContext';
import { calculateEnergyConsumption } from '../../utils/energyCalculations';

const ElectricityRateSettings: React.FC = () => {
  const { electricityRate, setElectricityRate, devices, calculateEnergyCost } = useAppContext();
  const [rate, setRate] = useState(electricityRate.toString());
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState('');

  // Calculate daily, weekly and monthly energy usage and cost
  const calculateAverageUsage = () => {
    // Calculate average daily energy consumption across all devices
    const dailyEnergyTotal = devices.reduce((total, device) => {
      const avgHoursPerDay = device.usage_logs.reduce(
        (sum, log) => sum + log.hours_on, 0
      ) / device.usage_logs.length;
      
      return total + calculateEnergyConsumption(device.watts_per_hour, avgHoursPerDay);
    }, 0);

    return {
      daily: {
        energy: dailyEnergyTotal,
        cost: calculateEnergyCost(dailyEnergyTotal)
      },
      weekly: {
        energy: dailyEnergyTotal * 7,
        cost: calculateEnergyCost(dailyEnergyTotal * 7)
      },
      monthly: {
        energy: dailyEnergyTotal * 30, // Approximation
        cost: calculateEnergyCost(dailyEnergyTotal * 30)
      }
    };
  };

  const usage = calculateAverageUsage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNumber = parseFloat(rate);
    
    if (isNaN(rateNumber) || rateNumber <= 0) {
      setError('Please enter a valid positive number for the electricity rate');
      return;
    }
    
    setElectricityRate(rateNumber);
    setError('');
    setShowSaved(true);
    
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Electricity Rate Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configure your electricity rate to calculate cost savings accurately.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid >
          <Paper sx={{ p: 3, height: '100%' }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="subtitle1" fontWeight="bold">
                Set Your Electricity Rate
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Enter the rate your utility company charges per kilowatt-hour (kWh).
                You can find this on your electricity bill.
              </Typography>
              
              <TextField
                label="Electricity Rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                fullWidth
                margin="normal"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">¢</InputAdornment>,
                  endAdornment: <InputAdornment position="end">per kWh</InputAdornment>,
                  inputProps: { min: 0, step: "0.01" }
                }}
                error={!!error}
                helperText={error || "Enter price in cents (e.g., 12.5)"}
              />
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <Button 
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<ElectricalServicesIcon />}
                >
                  Save Rate
                </Button>
              </Box>
              
              {showSaved && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Electricity rate updated successfully!
                </Alert>
              )}
            </form>
          </Paper>
        </Grid>
        
        <Grid >
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Your Energy Cost Summary
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Based on your current electricity rate of <b>{electricityRate}¢</b> per kWh and average device usage:
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid >
                <Card sx={{ mb: 2, bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid>
                        <Typography variant="subtitle2">Daily Energy:</Typography>
                      </Grid>
                      <Grid  textAlign="right">
                        <Typography variant="h6">{usage.daily.energy.toFixed(2)} kWh</Typography>
                      </Grid>
                      <Grid >
                        <Typography variant="subtitle2">Daily Cost:</Typography>
                      </Grid>
                      <Grid  textAlign="right">
                        <Typography variant="h6">${usage.daily.cost.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Card sx={{ mb: 2, bgcolor: 'secondary.main', color: 'white' }}>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid >
                        <Typography variant="subtitle2">Weekly Energy:</Typography>
                      </Grid>
                      <Grid  textAlign="right">
                        <Typography variant="h6">{usage.weekly.energy.toFixed(2)} kWh</Typography>
                      </Grid>
                      <Grid >
                        <Typography variant="subtitle2">Weekly Cost:</Typography>
                      </Grid>
                      <Grid textAlign="right">
                        <Typography variant="h6">${usage.weekly.cost.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: '#F7A74A', color: 'black' }}>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid>
                        <Typography variant="subtitle2">Monthly Energy:</Typography>
                      </Grid>
                      <Grid textAlign="right">
                        <Typography variant="h6">{usage.monthly.energy.toFixed(2)} kWh</Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="subtitle2">Monthly Cost:</Typography>
                      </Grid>
                      <Grid textAlign="right">
                        <Typography variant="h6">${usage.monthly.cost.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ElectricityRateSettings;