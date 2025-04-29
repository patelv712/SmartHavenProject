import { Device } from "../types";

/**
 * Calculate energy consumption in kilowatt-hours
 * @param watts - Power consumption in watts
 * @param hours - Hours of operation
 * @returns Energy consumption in kWh
 */
export const calculateEnergyConsumption = (
  watts: number,
  hours: number
): number => {
  return (watts / 1000) * hours;
};

/**
 * Calculate energy saved by turning off a device
 * @param device - Device object
 * @param hoursOff - Hours the device has been turned off
 * @returns Energy saved in kWh
 */
export const calculateEnergySaved = (
  device: Device,
  hoursOff: number
): number => {
  return calculateEnergyConsumption(device.watts_per_hour, hoursOff);
};

/**
 * Calculate total energy saved across multiple devices
 * @param devices - Array of device objects
 * @param simulatedState - Object mapping device IDs to on/off state
 * @param timeInterval - Time interval in hours
 * @returns Total energy saved in kWh
 */
export const calculateTotalEnergySaved = (
  devices: Device[],
  simulatedState: Record<string, boolean>,
  timeInterval: number
): number => {
  return devices.reduce((total, device) => {
    // Only add energy saved if device is turned off
    if (simulatedState[device.id] === false) {
      return total + calculateEnergySaved(device, timeInterval);
    }
    return total;
  }, 0);
};

/**
 * Calculate energy saved per device
 * @param devices - Array of device objects
 * @param simulatedState - Object mapping device IDs to on/off state
 * @param timeInterval - Time interval in hours
 * @returns Object mapping device IDs to energy saved in kWh
 */
export const calculateEnergySavedPerDevice = (
  devices: Device[],
  simulatedState: Record<string, boolean>,
  timeInterval: number
): Record<string, number> => {
  return devices.reduce((result: Record<string, number>, device) => {
    // Only add energy saved if device is turned off
    if (simulatedState[device.id] === false) {
      result[device.id] = calculateEnergySaved(device, timeInterval);
    } else {
      result[device.id] = 0;
    }
    return result;
  }, {});
};

/**
 * Format energy value with appropriate unit (Wh or kWh)
 * @param energyValue - Energy value in kWh
 * @returns Formatted string with appropriate unit
 */
export const formatEnergyValue = (energyValue: number): string => {
  if (energyValue < 1) {
    return `${Math.round(energyValue * 1000)} Wh`;
  }
  return `${energyValue.toFixed(2)} kWh`;
};
