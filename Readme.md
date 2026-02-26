# 🚗 Lucknow Smart Traffic Routing System

A modern, professional UI dashboard for intelligent traffic routing and monitoring in Lucknow city, built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Dark Theme Dashboard**: Professional minimalist design with a dark slate color scheme
- **Interactive Map Area**: Large map display (75-80% of screen width)
- **Smart Control Panel**: Left sidebar with location selectors and routing controls
- **Live Clock**: Real-time clock display in the top bar
- **Traffic Legend**: Color-coded traffic level indicators
- **Route Information**: Detailed route stats including distance, time, and traffic levels
- **BEST ROUTE Badge**: Highlights optimized routes
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Status**: Active simulation status indicator

## 🛠️ Tech Stack

- **React 18**: Latest React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern utility-first CSS framework
- **Vite**: Lightning-fast build tool
- **React Icons**: Beautiful icon library

## 📋 Requirements

- Node.js 18.0.0 or higher
- npm or yarn

## 🚀 Getting Started

### Installation

1. Navigate to the project directory:
```bash
cd c:\Users\Karan\Downloads\scratch
```

2. Install dependencies:
```bash
npm install
```

### Running the Project

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📐 Layout Structure

### Top Bar
- **City Name**: "Lucknow" with live indicator
- **Live Clock**: Real-time clock display
- **Status**: Traffic simulation status

### Left Control Panel (25% width)
- Project title and description
- Start Location Selector
- End Location Selector
- Use Current Location Toggle
- Find Best Route Button
- Route Information Card (dynamic)
- Traffic Legend

### Map Area (75% width)
- Large interactive map visualization
- Sample road network for Lucknow
- Traffic nodes with color coding
- Quick stats overlay

## 🎨 Design Features

- **Color Scheme**:
  - Background: Deep slate (#0f172a)
  - Cards: Slate-800 with subtle borders
  - Accents: Cyan, green, orange, red for traffic levels
  - Text: Slate-200/300 for optimal readability

- **Typography**:
  - Clear hierarchy with bold headings
  - Mono font for time display
  - Uppercase labels for UI elements

- **Interactions**:
  - Smooth hover effects
  - Gradient buttons with shadow
  - Animated toggles
  - Pulsing indicators

## 🗺️ Sample Locations

Major locations in Lucknow available for selection:
- Alambagh
- Charbagh Railway Station
- Gomti Nagar
- Hazratgunj
- Indira Nagar
- Jankipuram
- Kaiserbagh
- Lucknow Cantonment
- Mahanagar
- And more...

## 🚀 Features Ready for Future Implementation

- Real map integration (Google Maps, Mapbox)
- Actual routing algorithms
- Live traffic data integration
- WebSocket for real-time updates
- User authentication
- Multiple route comparison
- Traffic prediction
- Historical traffic patterns

## 📱 Responsive Behavior

- **Desktop**: Side-by-side layout with controls on left
- **Mobile**: Controls appear below the map

## 🔧 Component Architecture

```
App
├── TopBar (City name, clock, status)
├── ControlPanel
│   ├── Title
│   ├── Location Selectors
│   ├── Route Button
│   ├── RouteInfoCard
│   └── TrafficLegend
└── MapArea (Interactive map visualization)
```

## 🎯 Usage

1. **Select Locations**: Choose start and end locations from dropdowns
2. **Use Current Location**: Toggle to use your current location as start point
3. **Find Route**: Click "Find Best Route" button to get route information
4. **View Details**: Route info card displays distance, time, and traffic level
5. **Check Legend**: Reference the traffic color legend for traffic levels

## 📝 Future Enhancements

- Real-time traffic data
- Multiple alternate routes comparison
- Historical pattern analysis
- ETA predictions with weather integration
- User preferences and saved locations
- Mobile app version
- API integration for live data

---

**Track**: AI, Data & Smart System  
**Problem Statement**: Traffic & Crowd Flow Prediction System  
**Team**: Yadav Karan Rajendra (Leader)
Vivek Mishra.
Astha Singh .
Shyam Sundar Singh. 