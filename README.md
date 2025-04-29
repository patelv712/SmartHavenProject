# SmartHaven Energy Monitoring App

## Overview

SmartHaven is a simulated smart energy monitoring application for apartment residents that lets users monitor and manage five common household devices: PS5, Samsung Smart TV, Govee Smart Lights, Desk Lamp, and LG Dishwasher. The app simulates device usage, real-time monitoring, and energy savings tracking.

This MVP does not connect to actual IoT hardware but uses synthetic datasets and static JSON to mock realistic energy usage and management flows.

## Features

- **Device Monitoring**: View usage statistics for each device (historical and current)
- **Real-Time Monitoring & Control**: Simulate turning devices on/off and compute live energy usage/savings
- **Gamified Leaderboard**: Visualize energy savings competition among residents/floors

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Material-UI (MUI) components
- **Charts**: Recharts library for data visualization
- **Routing**: React Router for navigation
- **State Management**: React Context API
- **Data**: Simulated mock datasets (JSON)

| Device                 | Rated Power |
|------------------------|-------------|
| PlayStation 5          | 200 W       |
| Samsung Smart TV       | 120 W       |
| Govee Smart Bulbs (×5) | 9 W each ⇒ 45 W total |
| Desk Lamp              | 60 W        |
| LG Dishwasher          | 1.2 kWh / cycle (≈ 200 W avg) |

| Feature                     | Why it matters                                                                                      |
|-----------------------------|------------------------------------------------------------------------------------------------------|
| **Device Monitoring**       | See today’s usage at a glance and dive into 7-day charts for every device. Spot habitual waste.      |
| **Real-Time Control**       | Flip a virtual switch to simulate shutting a device off; SmartHaven recalculates savings instantly. |
| **Gamified Leaderboard**    | Friendly competition between residents or floors keeps everyone engaged and accountable.            |
| **Custom Electricity Rate** | Enter the ¢/kWh from your bill once, and every dollar figure you see is grounded in your real tariff.|



## Project Structure

```
src/
├── components/            # UI Components
│   ├── deviceMonitoring/  # Device Monitoring screen components
│   ├── realTimeControl/   # Real-Time Control screen components
│   ├── leaderboard/       # Leaderboard screen components
│   └── Navigation.tsx     # App navigation component
├── context/               # React Context for state management
├── data/                  # Mock JSON datasets
├── types/                 # TypeScript interfaces and types
├── utils/                 # Utility functions
│   ├── dataService.ts     # Data loading utilities
│   └── energyCalculations.ts # Energy calculation functions
└── App.tsx                # Main application component
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

## Device Specifications

The application simulates the following devices with these power consumption characteristics:

- **PS5**: ~200W/hour
- **Samsung Smart TV**: ~120W/hour
- **Govee Smart Bulbs**: ~9W per bulb/hour (5 bulbs = 45W/hour)
- **Desk Lamp**: ~60W/hour
- **LG Dishwasher**: ~1.2kWh per wash cycle (~200W/hour when averaged)

## Energy Calculations

The app uses the following formulas to calculate energy usage and savings:

```
Energy Consumption (kWh) = (Watts / 1000) * Hours
Energy Saved (kWh) = Energy Consumption for Hours Off
```

## Future Enhancements

- Integration with real IoT devices and APIs
- User authentication and personalized profiles
- Additional devices and energy-saving recommendations
- Historical data analysis and trend prediction
- Push notifications for energy-saving opportunities
