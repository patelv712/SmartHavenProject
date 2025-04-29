import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppContext } from '../../context/AppContext';
import { Device, DeviceFormData } from '../../types';

// List of available icons for devices
const iconOptions = [
  { value: 'SportsEsports', label: 'Gaming', icon: <Icons.SportsEsports /> },
  { value: 'Tv', label: 'Television', icon: <Icons.Tv /> },
  { value: 'Lightbulb', label: 'Light Bulb', icon: <Icons.Lightbulb /> },
  { value: 'LightbulbOutlined', label: 'Lamp', icon: <Icons.LightbulbOutlined /> },
  { value: 'Kitchen', label: 'Kitchen', icon: <Icons.Kitchen /> },
  { value: 'AcUnit', label: 'AC/Heater', icon: <Icons.AcUnit /> },
  { value: 'Computer', label: 'Computer', icon: <Icons.Computer /> },
  { value: 'DevicesOther', label: 'Other Device', icon: <Icons.DevicesOther /> },
  { value: 'Shower', label: 'Water Heater', icon: <Icons.Shower /> },
];

type IconName = keyof typeof Icons;

const DeviceManagement: React.FC = () => {
  const { devices, addDevice, updateDevice, removeDevice } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    icon: 'DevicesOther',
    watts_per_hour: 100,
    average_hours_per_day: 3
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleOpenAddDialog = () => {
    setCurrentDevice(null);
    setFormData({
      name: '',
      icon: 'DevicesOther',
      watts_per_hour: 100,
      average_hours_per_day: 3
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (device: Device) => {
    setCurrentDevice(device);
    setFormData({
      name: device.name,
      icon: device.icon,
      watts_per_hour: device.watts_per_hour,
      average_hours_per_day: getAverageHoursPerDay(device)
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (device: Device) => {
    setCurrentDevice(device);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentDevice(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Device name is required';
    }
    
    if (formData.watts_per_hour <= 0) {
      newErrors.watts_per_hour = 'Wattage must be greater than 0';
    }
    
    if (formData.average_hours_per_day < 0 || formData.average_hours_per_day > 24) {
      newErrors.average_hours_per_day = 'Hours must be between 0 and 24';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    if (currentDevice) {
      // Update existing device
      updateDevice(currentDevice.id, {
        name: formData.name,
        icon: formData.icon,
        watts_per_hour: formData.watts_per_hour
      });
      setSnackbar({
        open: true,
        message: `Device ${formData.name} has been updated!`,
        severity: 'success'
      });
    } else {
      // Add new device
      addDevice(formData);
      setSnackbar({
        open: true,
        message: `Device ${formData.name} has been added!`,
        severity: 'success'
      });
    }
    
    setOpenDialog(false);
  };

  const handleDelete = () => {
    if (currentDevice) {
      removeDevice(currentDevice.id);
      setSnackbar({
        open: true,
        message: `Device ${currentDevice.name} has been removed!`,
        severity: 'success'
      });
      handleCloseDeleteDialog();
    }
  };

  // Helper function to calculate average hours per day from usage logs
  const getAverageHoursPerDay = (device: Device): number => {
    if (!device.usage_logs.length) return 0;
    const total = device.usage_logs.reduce((sum, log) => sum + log.hours_on, 0);
    return total / device.usage_logs.length;
  };

  // Get Icon component from the icon name
  const getIconComponent = (iconName: string) => {
    const IconComponent = Icons[iconName as IconName] || Icons.DevicesOther;
    return <IconComponent />;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Device Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New Device
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Add, edit, or remove devices in your SmartHaven system.
      </Typography>
      
      <Paper>
        <List>
          {devices.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No devices found"
                secondary="Add a device to get started with energy monitoring"
              />
            </ListItem>
          ) : (
            devices.map((device) => (
              <React.Fragment key={device.id}>
                <ListItem>
                  <ListItemIcon>
                    {getIconComponent(device.icon)}
                  </ListItemIcon>
                  <ListItemText
                    primary={device.name}
                    secondary={`${device.watts_per_hour} watts/hour • Avg. ${getAverageHoursPerDay(device).toFixed(1)} hours/day`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditDialog(device)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(device)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
      
      {/* Add/Edit Device Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{currentDevice ? 'Edit Device' : 'Add New Device'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid >
                <TextField
                  name="name"
                  label="Device Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  margin="normal"
                />
              </Grid>
              
              <Grid>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Icon</InputLabel>
                  <Select
                    name="icon"
                    value={formData.icon}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        icon: e.target.value as string,
                      });
                    }}
                    label="Icon"
                  >
                    {iconOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {option.icon}
                          <Typography sx={{ ml: 1 }}>{option.label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid >
                <TextField
                  name="watts_per_hour"
                  label="Watts Per Hour"
                  type="number"
                  fullWidth
                  value={formData.watts_per_hour}
                  onChange={handleInputChange}
                  error={!!errors.watts_per_hour}
                  helperText={errors.watts_per_hour}
                  margin="normal"
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>W</Typography>,
                  }}
                />
              </Grid>
              
              <Grid >
                <TextField
                  name="average_hours_per_day"
                  label="Average Hours Used Per Day"
                  type="number"
                  fullWidth
                  value={formData.average_hours_per_day}
                  onChange={handleInputChange}
                  error={!!errors.average_hours_per_day}
                  helperText={errors.average_hours_per_day}
                  margin="normal"
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>hours</Typography>,
                  }}
                  disabled={false}
                />
              </Grid>
            </Grid>
            
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Please correct the errors before submitting.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {currentDevice ? 'Update Device' : 'Add Device'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {currentDevice?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeviceManagement;