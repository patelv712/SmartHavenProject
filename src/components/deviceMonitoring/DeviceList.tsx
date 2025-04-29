import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Box 
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { calculateEnergyConsumption } from '../../utils/energyCalculations';

type IconName = keyof typeof Icons;

const DeviceList: React.FC = () => {
  const { devices, selectedDeviceId, setSelectedDeviceId } = useAppContext();
  
  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId === selectedDeviceId ? null : deviceId);
  };
  
  const getIconComponent = (iconName: string) => {
    // Check if the icon exists in MUI Icons
    const IconComponent = Icons[iconName as IconName] || Icons.DevicesOther;
    return <IconComponent />;
  };
  
  // Calculate the total energy consumption for today for each device
  const getTodayConsumption = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return 0;
    
    const todayLog = device.usage_logs[0]; // Assuming the first log is today
    return calculateEnergyConsumption(device.watts_per_hour, todayLog.hours_on);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        My Devices
      </Typography>
      <List>
        {devices.map((device) => (
          <ListItem 
            key={device.id} 
            disablePadding
          >
            <ListItemButton 
              onClick={() => handleDeviceSelect(device.id)}
              selected={device.id === selectedDeviceId}
            >
              <ListItemIcon>
                {getIconComponent(device.icon)}
              </ListItemIcon>
              <ListItemText 
                primary={device.name} 
                secondary={`${getTodayConsumption(device.id).toFixed(2)} kWh today`} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DeviceList;