// Device related types
export interface UsageLog {
  date: string;
  hours_on: number;
}

export interface Device {
  id: string;
  name: string;
  icon: string;
  watts_per_hour: number;
  usage_logs: UsageLog[];
}

export interface DevicesData {
  devices: Device[];
}

// Form data for adding a new device
export interface DeviceFormData {
  name: string;
  icon: string;
  watts_per_hour: number;
  average_hours_per_day: number;
}

// Real-time control related types
export interface SimulatedState {
  [key: string]: boolean;
}

export interface RealTimeData {
  simulated_state: SimulatedState;
  time_interval: number;
}

// Leaderboard related types
export interface DeviceContributions {
  [key: string]: number;
}

export interface LeaderboardEntry {
  name: string;
  floor: number;
  energy_saved: number;
  device_contributions: DeviceContributions;
}

export interface FloorData {
  floor: number;
  total_energy_saved: number;
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  floors: FloorData[];
}

// Time interval options for real-time control
export enum TimeInterval {
  ONE_HOUR = 1,
  SIX_HOURS = 6,
  TWELVE_HOURS = 12,
  TWENTY_FOUR_HOURS = 24,
}

// Settings and user preferences
export interface UserSettings {
  electricityRate: number; // in cents per kWh
  userName: string;
  userFloor: number;
}

// Energy cost and savings calculation
export interface EnergyCost {
  kilowattHours: number;
  costInDollars: number;
  timeInterval: string; // "day", "week", "month"
}

export interface EnergyTimeframe {
  DAY: 'day';
  WEEK: 'week';
  MONTH: 'month';
}
