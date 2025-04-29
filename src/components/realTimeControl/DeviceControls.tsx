import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Typography,
  Box,
  Paper
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { formatEnergyValue } from '../../utils/energyCalculations';

type IconName = keyof typeof Icons;

const DeviceControls: React.FC = () => {
  const { devices, simulatedState, toggleDeviceState, timeInterval } = useAppContext();
  
  const getIconComponent = (iconName: string) => {
    // Check if the icon exists in MUI Icons
    const IconComponent = Icons[iconName as IconName] || Icons.DevicesOther;
    return <IconComponent />;
  };
  
  // Calculate potential energy savings for a device if turned off
  const calculatePotentialSavings = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return 0;
    
    // If device is already off, it's already saving energy
    if (!simulatedState[deviceId]) return 0;
    
    // Calculate how much energy would be saved if turned off
    return (device.watts_per_hour / 1000) * timeInterval;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Device Controls
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Toggle devices on/off to simulate energy savings over {timeInterval} hours
      </Typography>
      <List>
        {devices.map((device) => (
          <ListItem key={device.id}>
            <ListItemIcon>
              {getIconComponent(device.icon)}
            </ListItemIcon>
            <ListItemText 
              primary={device.name}
              secondary={
                simulatedState[device.id]
                  ? `Currently ON - Turn off to save ${formatEnergyValue(calculatePotentialSavings(device.id))}`
                  : `Currently OFF - Saving ${formatEnergyValue((device.watts_per_hour / 1000) * timeInterval)}`
              }
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={simulatedState[device.id]}
                onChange={() => toggleDeviceState(device.id)}
                inputProps={{ 'aria-labelledby': `switch-${device.id}` }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DeviceControls;