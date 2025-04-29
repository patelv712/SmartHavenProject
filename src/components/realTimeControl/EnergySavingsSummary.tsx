import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab
} from '@mui/material';

import { Grid } from '@mui/material';


import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { calculateEnergySavedPerDevice, calculateTotalEnergySaved, formatEnergyValue } from '../../utils/energyCalculations';
import BoltIcon from '@mui/icons-material/Bolt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const EnergySavingsSummary: React.FC = () => {
  const { devices, simulatedState, timeInterval, calculateMoneySaved, electricityRate } = useAppContext();
  const [viewTab, setViewTab] = React.useState(0);

  // Calculate energy savings for each device
  const energySavedPerDevice = calculateEnergySavedPerDevice(
    devices,
    simulatedState,
    timeInterval
  );

  // Calculate total energy saved
  const totalEnergySaved = calculateTotalEnergySaved(
    devices,
    simulatedState,
    timeInterval
  );

  // Calculate money saved based on energy savings
  const totalMoneySaved = calculateMoneySaved(totalEnergySaved);

  // Prepare data for the pie charts
  const chartData = devices
    .filter(device => !simulatedState[device.id]) // Only include devices that are turned off
    .map(device => ({
      name: device.name,
      energy: energySavedPerDevice[device.id],
      money: calculateMoneySaved(energySavedPerDevice[device.id])
    }));

  // Colors for chart segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // Calculate monthly and yearly projections
  const monthlyEnergySaved = totalEnergySaved * (720 / timeInterval); // 720 hours in a month (30 days)
  const yearlyEnergySaved = totalEnergySaved * (8760 / timeInterval); // 8760 hours in a year

  const monthlyMoneySaved = calculateMoneySaved(monthlyEnergySaved);
  const yearlyMoneySaved = calculateMoneySaved(yearlyEnergySaved);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setViewTab(newValue);
  };

  // No savings if all devices are on
  if (chartData.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Energy & Cost Savings
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No energy savings yet! Turn off some devices to start saving energy and money.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
    elevation={2}
    sx={{
      p: 2,
      display: 'inline-block',
      width: 'auto'
    }}
  >
      <Typography variant="h6" gutterBottom>
        Energy & Cost Savings
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={viewTab} onChange={handleTabChange} aria-label="savings view tabs">
          <Tab icon={<BoltIcon />} label="Energy" />
          <Tab icon={<AttachMoneyIcon />} label="Money" />
        </Tabs>
      </Box>

      <Grid container spacing={2}>
        <Grid>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {viewTab === 0 ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  Total Energy Savings
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                  {formatEnergyValue(totalEnergySaved)}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary">
                  Total Cost Savings
                </Typography>
                <Typography variant="h4" color="secondary.main" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AttachMoneyIcon sx={{ mr: -0.5 }} />
                  {totalMoneySaved.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  At current rate of {electricityRate}¢ per kWh
                </Typography>
              </>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Over {timeInterval} hour{timeInterval !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Projections Cards */}
          <Box sx={{ mt: 2 }}>
            <Card sx={{ mb: 2, bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2">Monthly Projection:</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {viewTab === 0 
                      ? `${monthlyEnergySaved.toFixed(1)} kWh` 
                      : `$${monthlyMoneySaved.toFixed(2)}`}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2">Yearly Projection:</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {viewTab === 0 
                      ? `${yearlyEnergySaved.toFixed(1)} kWh` 
                      : `$${yearlyMoneySaved.toFixed(2)}`}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={viewTab === 0 ? "energy" : "money"}
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => (
                  viewTab === 0 
                    ? formatEnergyValue(value) 
                    : `$${value.toFixed(2)}`
                )} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            {viewTab === 0 
              ? "Energy saved by each device" 
              : "Money saved by each device"}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(247, 167, 74, 0.1)', borderRadius: 2, border: '1px dashed', borderColor: 'secondary.main' }}>
        <Typography variant="body2">
          💡 <strong>Savings Tip:</strong> If you maintain these energy-saving habits, 
          you could save up to <strong>${yearlyMoneySaved.toFixed(2)}</strong> per year on your electricity bill!
        </Typography>
      </Box>
    </Paper>
  );
};

export default EnergySavingsSummary;