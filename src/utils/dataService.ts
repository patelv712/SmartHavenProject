import deviceData from "../data/deviceData.json";
import realTimeData from "../data/realTimeData.json";
import leaderboardData from "../data/leaderboardData.json";
import {
  DevicesData,
  RealTimeData,
  LeaderboardData,
  SimulatedState,
} from "../types";

/**
 * Get device data from mock JSON
 * @returns Device data
 */
export const getDeviceData = (): DevicesData => {
  return deviceData as DevicesData;
};

/**
 * Get real-time control data from mock JSON
 * @returns Real-time control data
 */
export const getRealTimeData = (): RealTimeData => {
  return realTimeData as RealTimeData;
};

/**
 * Get leaderboard data from mock JSON
 * @returns Leaderboard data
 */
export const getLeaderboardData = (): LeaderboardData => {
  return leaderboardData as LeaderboardData;
};

/**
 * Update simulated device state (in-memory only)
 * @param deviceId - ID of the device to update
 * @param isOn - New state of the device (true = on, false = off)
 * @returns Updated simulated state
 */
export const updateDeviceState = (
  deviceId: string,
  isOn: boolean,
  currentState: SimulatedState
): SimulatedState => {
  return {
    ...currentState,
    [deviceId]: isOn,
  };
};

/**
 * Find a device by its ID
 * @param deviceId - ID of the device to find
 * @returns Device object or undefined if not found
 */
export const findDeviceById = (deviceId: string) => {
  return getDeviceData().devices.find((device) => device.id === deviceId);
};
