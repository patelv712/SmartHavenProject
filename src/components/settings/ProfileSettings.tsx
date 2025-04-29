import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Alert,
  Avatar,
  MenuItem
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useAppContext } from '../../context/AppContext';

const ProfileSettings: React.FC = () => {
  const { userName, setUserName, userFloor, setUserFloor } = useAppContext();
  
  const [name, setName] = useState(userName);
  const [floor, setFloor] = useState(userFloor.toString());
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState('');

  // Available floors for selection
  const floors = [1, 2, 3, 4, 5];
  
  // Calculate initial for avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };
  
  // Generate random color based on name
  const getAvatarColor = (name: string) => {
    if (!name) return 'primary.main';
    const charCode = name.charCodeAt(0);
    return `hsl(${charCode * 10}, 70%, 50%)`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    
    const floorNumber = parseInt(floor);
    if (isNaN(floorNumber) || !floors.includes(floorNumber)) {
      setError('Please select a valid floor');
      return;
    }
    
    setUserName(name);
    setUserFloor(floorNumber);
    setError('');
    setShowSaved(true);
    
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Profile Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Update your profile information to customize your SmartHaven experience.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64,
                    bgcolor: getAvatarColor(name),
                    fontSize: '2rem'
                  }}
                >
                  {getInitial(name)}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Your SmartHaven Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This information will be used for the leaderboard
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid >
                  <TextField
                    label="Your Display Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    error={!!error && !name.trim()}
                    helperText={!name.trim() && error ? "Name is required" : ""}
                  />
                </Grid>
                
                <Grid>
                  <TextField
                    select
                    label="Your Floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: <ApartmentIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    error={!!error && (!floor || !floors.includes(parseInt(floor)))}
                    helperText={!floor && error ? "Please select your floor" : ""}
                  >
                    {floors.map((f) => (
                      <MenuItem key={f} value={f}>
                        Floor {f}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <Button 
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Save Profile
                </Button>
              </Box>
              
              {error && !showSaved && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              {showSaved && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Profile updated successfully!
                </Alert>
              )}
            </form>
          </Paper>
        </Grid>
        
        <Grid>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Why Your Profile Matters
            </Typography>
            
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="body2" paragraph>
                <strong>Personalized Experience:</strong> Your name will be displayed throughout the app to make your energy monitoring experience more personal.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Floor Competition:</strong> Your floor information helps group energy savings for building-wide competitions, allowing you to see how your floor compares to others.
              </Typography>
              
              <Typography variant="body2">
                <strong>Leaderboards:</strong> Your energy savings will be tracked individually and as part of your floor's collective effort, fostering a community approach to energy conservation.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileSettings;