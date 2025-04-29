import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider,
  Stack,
  Grid,
  Chip
} from '@mui/material';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { calculateEnergyConsumption } from '../../utils/energyCalculations';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BoltIcon from '@mui/icons-material/Bolt';

const DeviceDetail: React.FC = () => {
  const { devices, selectedDeviceId, electricityRate, calculateMoneySaved } = useAppContext();
  
  if (!selectedDeviceId) {
    return (
      <Card sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Select a device to view details
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  const device = devices.find(d => d.id === selectedDeviceId);
  
  if (!device) {
    return (
      <Card sx={{ minHeight: 400 }}>
        <CardContent>
          <Typography variant="h6" color="error">
            Device not found
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data - including energy cost
  const chartData = [...device.usage_logs]
    .reverse()
    .map(log => {
      const energy = calculateEnergyConsumption(device.watts_per_hour, log.hours_on);
      const cost = calculateMoneySaved(energy);
      
      return {
        date: log.date.split('-')[2], // Just show the day part
        hours: log.hours_on,
        energy: energy,
        cost: cost
      };
    });
    
  // Calculate total energy consumed in the past 7 days
  const totalEnergyConsumed = device.usage_logs.reduce((sum, log) => {
    return sum + calculateEnergyConsumption(device.watts_per_hour, log.hours_on);
  }, 0);
  
  // Calculate total cost of energy consumed
  const totalCostConsumed = calculateMoneySaved(totalEnergyConsumed);
  
  // Calculate average hours per day
  const averageHoursPerDay = device.usage_logs.reduce((sum, log) => sum + log.hours_on, 0) / device.usage_logs.length;

  // Calculate potential daily savings if usage was reduced by 1 hour
  const potentialDailySavingsEnergy = calculateEnergyConsumption(device.watts_per_hour, 1);
  const potentialDailySavingsMoney = calculateMoneySaved(potentialDailySavingsEnergy);

  // Calculate average daily energy usage
  const averageDailyEnergy = totalEnergyConsumed / device.usage_logs.length;
  const averageDailyCost = calculateMoneySaved(averageDailyEnergy);

  return (
    <Card sx={{ minHeight: 400 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {device.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography color="text.secondary" sx={{ mr: 2 }}>
            {device.watts_per_hour} watts per hour
          </Typography>
          <Chip 
            icon={<BoltIcon />} 
            label={`${(device.watts_per_hour / 1000).toFixed(2)} kWh`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid >
            <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="body2" color="inherit">
                Total Energy (7 Days)
              </Typography>
              <Typography variant="h6" color="inherit">
                {totalEnergyConsumed.toFixed(2)} kWh
              </Typography>
            </Box>
          </Grid>
          <Grid >
            <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'secondary.main', color: 'white' }}>
              <Typography variant="body2" color="inherit">
                Total Cost (7 Days)
              </Typography>
              <Typography variant="h6" color="inherit" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AttachMoneyIcon sx={{ fontSize: '1.25rem', mr: -0.5 }} />
                {totalCostConsumed.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid >
            <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: '#F7A74A', color: 'black' }}>
              <Typography variant="body2" color="inherit">
                Average Daily Usage
              </Typography>
              <Typography variant="h6" color="inherit">
                {averageHoursPerDay.toFixed(1)} hours
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(10, 173, 10, 0.1)', borderRadius: 1, border: '1px dashed', borderColor: 'primary.main' }}>
          <Typography variant="subtitle2" gutterBottom color="primary.dark">
            💡 Money-Saving Insight
          </Typography>
          <Typography variant="body2">
            Reducing usage of this device by just 1 hour per day could save you approximately <strong>${(potentialDailySavingsMoney * 30).toFixed(2)}</strong> per month or <strong>${(potentialDailySavingsMoney * 365).toFixed(2)}</strong> per year.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Usage & Cost History (Last 7 Days)
          </Typography>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Current electricity rate: {electricityRate}¢ per kWh
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Average daily cost: ${averageDailyCost.toFixed(2)}
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" label={{ value: 'Day', position: 'bottom', offset: 0 }} />
              <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'kWh', angle: 90, position: 'insideRight' }} />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'Hours On') return `${value} hrs`;
                  if (name === 'Energy (kWh)') return `${value.toFixed(2)} kWh`;
                  if (name === 'Cost') return `$${value.toFixed(2)}`;
                  return value;
                }}
              />
              <ReferenceLine 
                yAxisId="right" 
                y={averageDailyEnergy} 
                stroke="#ff7300" 
                strokeDasharray="3 3" 
                label={{ 
                  position: 'insideBottomRight', 
                  value: 'Avg Energy', 
                  fill: '#ff7300', 
                  fontSize: 10 
                }} 
              />
              <Bar yAxisId="left" dataKey="hours" fill="#8884d8" name="Hours On" />
              <Bar yAxisId="right" dataKey="energy" fill="#82ca9d" name="Energy (kWh)" />
              <Bar yAxisId="right" dataKey="cost" fill="#f7a74a" name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeviceDetail;