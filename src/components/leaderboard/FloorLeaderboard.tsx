import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  LinearProgress
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useAppContext } from '../../context/AppContext';

// Trophy colors for top floors
const trophyColors = ['gold', 'silver', '#cd7f32']; // Gold, Silver, Bronze

const FloorLeaderboard: React.FC = () => {
  const { floorData, leaderboardEntries } = useAppContext();
  
  // Sort floors by energy saved (descending)
  const sortedFloors = [...floorData].sort((a, b) => b.total_energy_saved - a.total_energy_saved);
  
  // Find the max energy saved for progress bar calculation
  const maxEnergySaved = Math.max(...sortedFloors.map(f => f.total_energy_saved));
  
  // Count residents per floor
  const residentsPerFloor: { [key: number]: number } = {};
  leaderboardEntries.forEach(entry => {
    residentsPerFloor[entry.floor] = (residentsPerFloor[entry.floor] || 0) + 1;
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="floor leaderboard table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Floor</TableCell>
            <TableCell>Residents</TableCell>
            <TableCell align="right">Total Energy Saved (kWh)</TableCell>
            <TableCell>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedFloors.map((floor, index) => (
            <TableRow
              key={floor.floor}
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
                  <ApartmentIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Floor {floor.floor}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {residentsPerFloor[floor.floor] || 0} residents
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={index < 3 ? 'bold' : 'normal'}>
                  {floor.total_energy_saved.toFixed(1)}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(floor.total_energy_saved / maxEnergySaved) * 100}
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        bgcolor: 'grey.300',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: index < 3 ? trophyColors[index] : 'primary.main'
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{Math.round((floor.total_energy_saved / maxEnergySaved) * 100)}%</Typography>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FloorLeaderboard;