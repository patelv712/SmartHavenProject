import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Device, 
  SimulatedState, 
  TimeInterval,
  LeaderboardEntry,
  FloorData,
  DeviceFormData
} from '../types';
import { 
  getDeviceData, 
  getRealTimeData, 
  getLeaderboardData, 
  updateDeviceState 
} from '../utils/dataService';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  // Device monitoring
  devices: Device[];
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;
  
  // Real-time control
  simulatedState: SimulatedState;
  timeInterval: number;
  toggleDeviceState: (deviceId: string) => void;
  setTimeInterval: (interval: number) => void;
  
  // Leaderboard
  leaderboardEntries: LeaderboardEntry[];
  floorData: FloorData[];
  viewMode: 'individual' | 'floor';
  setViewMode: (mode: 'individual' | 'floor') => void;
  
  // Settings
  electricityRate: number;
  setElectricityRate: (rate: number) => void;
  calculateEnergyCost: (kWh: number) => number;
  calculateMoneySaved: (kWh: number) => number;
  
  // User profile
  userName: string;
  setUserName: (name: string) => void;
  userFloor: number;
  setUserFloor: (floor: number) => void;
  
  // Device management
  addDevice: (deviceData: DeviceFormData) => void;
  updateDevice: (deviceId: string, updates: Partial<Device>) => void;
  removeDevice: (deviceId: string) => void;
}

// Default values
const DEFAULT_ELECTRICITY_RATE = 12.5; // cents per kWh
const DEFAULT_USERNAME = 'User';
const DEFAULT_FLOOR = 3;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from mock data
  const [devices, setDevices] = useState<Device[]>(getDeviceData().devices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  
  const [simulatedState, setSimulatedState] = useState<SimulatedState>(
    getRealTimeData().simulated_state
  );
  const [timeInterval, setTimeInterval] = useState<number>(
    getRealTimeData().time_interval
  );
  
  const [leaderboardEntries] = useState<LeaderboardEntry[]>(
    getLeaderboardData().leaderboard
  );
  const [floorData] = useState<FloorData[]>(
    getLeaderboardData().floors
  );
  const [viewMode, setViewMode] = useState<'individual' | 'floor'>('individual');
  
  // Settings state
  const [electricityRate, setElectricityRate] = useState<number>(
    DEFAULT_ELECTRICITY_RATE
  );
  
  // User profile state
  const [userName, setUserName] = useState<string>(DEFAULT_USERNAME);
  const [userFloor, setUserFloor] = useState<number>(DEFAULT_FLOOR);

  // Handler for toggling device state
  const toggleDeviceState = (deviceId: string) => {
    const currentState = simulatedState[deviceId];
    const newState = updateDeviceState(deviceId, !currentState, simulatedState);
    setSimulatedState(newState);
  };
  
  // Calculate energy cost in dollars
  const calculateEnergyCost = (kWh: number): number => {
    // Convert cents to dollars and multiply by kWh
    return (electricityRate / 100) * kWh;
  };
  
  // Calculate money saved based on kWh saved
  const calculateMoneySaved = (kWh: number): number => {
    return calculateEnergyCost(kWh);
  };
  
  // Generate demo usage logs for a new device
  const generateUsageLogs = (avgHoursPerDay: number) => {
    const today = new Date(); // April 21, 2025
    const logs = [];
    
    // Create 7 days of logs, with some variance around the average
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Add some variance to hours (±30%)
      const variance = (Math.random() * 0.6) - 0.3; // -0.3 to 0.3
      const hours = Math.max(0, avgHoursPerDay * (1 + variance));
      
      logs.push({
        date: `2025-04-${21 - i}`, // Format: YYYY-MM-DD
        hours_on: Number(hours.toFixed(1))
      });
    }
    
    return logs;
  };
  
  // Add a new device
  const addDevice = (deviceData: DeviceFormData) => {
    const newDevice: Device = {
      id: deviceData.name.toLowerCase().replace(/\s+/g, '_') + '_' + uuidv4().substring(0, 8),
      name: deviceData.name,
      icon: deviceData.icon,
      watts_per_hour: deviceData.watts_per_hour,
      usage_logs: generateUsageLogs(deviceData.average_hours_per_day)
    };
    
    setDevices(prevDevices => [...prevDevices, newDevice]);
    
    // Add device to simulated state (default to off)
    setSimulatedState(prevState => ({
      ...prevState,
      [newDevice.id]: false
    }));
  };
  
  // Update an existing device
  const updateDevice = (deviceId: string, updates: Partial<Device>) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId
          ? { ...device, ...updates }
          : device
      )
    );
  };
  
  // Remove a device
  const removeDevice = (deviceId: string) => {
    setDevices(prevDevices => 
      prevDevices.filter(device => device.id !== deviceId)
    );
    
    // Remove device from simulated state
    const updatedState = { ...simulatedState };
    delete updatedState[deviceId];
    setSimulatedState(updatedState);
    
    // Clear selected device if it's the one being removed
    if (selectedDeviceId === deviceId) {
      setSelectedDeviceId(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        // Device monitoring
        devices,
        selectedDeviceId,
        setSelectedDeviceId,
        
        // Real-time control
        simulatedState,
        timeInterval,
        toggleDeviceState,
        setTimeInterval,
        
        // Leaderboard
        leaderboardEntries,
        floorData,
        viewMode,
        setViewMode,
        
        // Settings
        electricityRate,
        setElectricityRate,
        calculateEnergyCost,
        calculateMoneySaved,
        
        // User profile
        userName,
        setUserName,
        userFloor,
        setUserFloor,
        
        // Device management
        addDevice,
        updateDevice,
        removeDevice
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};