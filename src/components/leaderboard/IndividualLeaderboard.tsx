import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Avatar,
  Box,
  Chip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAppContext } from '../../context/AppContext';

// Trophy emoji colors for top performers
const trophyColors = ['gold', 'silver', '#cd7f32']; // Gold, Silver, Bronze

const IndividualLeaderboard: React.FC = () => {
  const { leaderboardEntries } = useAppContext();
  
  // Sort entries by energy saved (descending)
  const sortedEntries = [...leaderboardEntries].sort((a, b) => b.energy_saved - a.energy_saved);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="leaderboard table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Resident</TableCell>
            <TableCell>Floor</TableCell>
            <TableCell align="right">Energy Saved (kWh)</TableCell>
            <TableCell align="right">Device Contributions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedEntries.map((entry, index) => (
            <TableRow
              key={entry.name}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: index < 3 ? `rgba(${index === 0 ? '255, 223, 0' : index === 1 ? '192, 192, 192' : '205, 127, 50'}, 0.1)` : 'inherit'
              }}
            >
              <TableCell component="th" scope="row">
                {index < 3 ? (
                  <Box display="flex" alignItems="center">
                    <EmojiEventsIcon sx={{ color: trophyColors[index], mr: 1 }} />
                    {index + 1}
                  </Box>
                ) : (
                  index + 1
                )}
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2, bgcolor: `hsl(${entry.name.charCodeAt(0) * 10}, 70%, 50%)` }}>
                    {entry.name.charAt(0)}
                  </Avatar>
                  {entry.name}
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={`Floor ${entry.floor}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={index < 3 ? 'bold' : 'normal'}>
                  {entry.energy_saved.toFixed(1)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip 
                  title={
                    <React.Fragment>
                      <Typography variant="body2">Device Contributions:</Typography>
                      <Typography variant="body2">PS5: {entry.device_contributions.ps5.toFixed(1)} kWh</Typography>
                      <Typography variant="body2">TV: {entry.device_contributions.tv.toFixed(1)} kWh</Typography>
                      <Typography variant="body2">Lights: {entry.device_contributions.lights.toFixed(1)} kWh</Typography>
                      <Typography variant="body2">Lamp: {entry.device_contributions.lamp.toFixed(1)} kWh</Typography>
                      <Typography variant="body2">Dishwasher: {entry.device_contributions.dishwasher.toFixed(1)} kWh</Typography>
                    </React.Fragment>
                  } 
                  arrow
                >
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    View Details
                  </Typography>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IndividualLeaderboard;