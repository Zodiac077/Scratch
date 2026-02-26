# Real-time Traffic Route Dashboard

A comprehensive web-based traffic management system that provides real-time route optimization, traffic prediction, and intelligent navigation solutions for urban commuters.

## 📋 Project Overview

**Track:** AI, Data & Smart System  
**Problem Statement:** Traffic & Crowd Flow Prediction System  
**Deployment:** https://zodiac077.github.io/Scratch/

## 👥 Team Members

- **Yadav Karan Rajendra** - Full Stack Developer & Team Lead
- **Vivek Mishra** - Backend Developer
- **Astha Singh** - Frontend Developer
- **Shyam Sundar Singh** - API Integration Specialist

## ✨ Features

### Core Features
- **Real-time Route Optimization**: Calculate optimal routes using TomTom API with fallback to OSRM
- **Live Traffic Visualization**: Interactive map showing current traffic conditions
- **Multiple Route Options**: Compare different routes with traffic impact analysis
- **Traffic Zone Visualization**: Visual indicators for congestion zones with color-coded severity levels
  - 🔴 Severe (85%+ congestion)
  - 🟠 High (70-84% congestion)
  - 🟡 Medium (45-69% congestion)
  - 🟢 Low (0-44% congestion)

### Advanced Features
- **User Location Tracking**: Real-time geolocation with accuracy tracking
- **Route Comparison**: Side-by-side comparison of multiple routes
- **Traffic Impact Analysis**: Detailed congestion metrics and time predictions
- **Map Selection Mode**: Click directly on map to set start/destination locations
- **Responsive Design**: Fully responsive UI that works on all devices
- **Dark Mode Support**: Theme switching capability

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI
- **Map Library**: Leaflet 1.9.4 with React Leaflet 4.0.0
- **Icons**: Lucide React
- **Charts**: Recharts 2.15.2
- **Animations**: Motion Library

### Backend & APIs
- **TomTom API**: Primary routing and traffic service
- **OSRM**: Fallback routing service
- **OpenStreetMap**: Map tiles and base layer

### Development Tools
- Tailwind CSS Vite plugin
- PostCSS
- React DevTools support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Zodiac077/Scratch.git
cd Scratch
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables** (if needed)
Create a `.env` file in the root directory:
```
VITE_TOMTOM_API_KEY=your_api_key_here
```

### Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/Scratch/`

### Production Build

Build for production:
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## 📁 Project Structure

```
├── src/
│   ├── main.tsx              # Application entry point
│   ├── app/
│   │   ├── App.tsx          # Main application component
│   │   └── components/
│   │       ├── figma/       # Figma-related components
│   │       └── ui/          # Reusable UI components
│   └── styles/
│       ├── index.css        # Main stylesheet
│       ├── tailwind.css     # Tailwind configuration
│       ├── theme.css        # Theme variables
│       └── fonts.css        # Font definitions
├── index.html               # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.mjs      # PostCSS configuration
└── package.json            # Project dependencies
```

## 🗺️ Map Features

### Traffic Zones
The application displays predefined traffic zones across Lucknow with:
- Charbagh Station Circle (Severe)
- Hazratganj Market (High)
- Aminabad Crossing (High)
- Lucknow Junction Road (High)
- Gomti Nagar Road (Medium)
- Alambagh Junction (Medium)
- Mahanagar Crossing (Low)

### Markers
- 🔴 **Red Marker**: Start location
- 🟢 **Green Marker**: Destination
- 🔵 **Blue Marker**: User's current location

## 🔄 Routing Logic

### Route Calculation Process
1. User selects start and destination locations
2. App requests routes from TomTom API (if available)
3. Falls back to OSRM if TomTom is unavailable
4. Calculates traffic impact based on traffic zones
5. Displays all routes on map with comparison metrics

### Traffic Impact Calculation
- Analyzes intersection with traffic zones
- Computes congestion percentage based on zone overlap
- Estimates delay time based on traffic severity
- Provides alternative route suggestions

## 🎨 UI Components

The project uses Radix UI for accessible, unstyled components:
- Buttons, Forms, Dialogs
- Dropdown menus, Popovers
- Tabs, Accordions, Tooltips
- And many more customizable components

## 📊 Performance Features

- **Lazy Loading**: Components load on demand
- **Optimized Assets**: CSS and JS are minified in production
- **Responsive Images**: Proper image loading strategies
- **Efficient State Management**: React hooks for state control

## 🐛 Known Issues & Limitations

- TomTom API key is hardcoded (should use environment variables in production)
- Dummy traffic data is used alongside real traffic APIs
- CORS may be an issue with some external APIs

## 🔮 Future Enhancements

- [ ] Real-time traffic updates via WebSocket
- [ ] User authentication and saved routes
- [ ] Historical traffic pattern analysis
- [ ] Public transportation integration
- [ ] Mobile app (React Native)
- [ ] Voice navigation
- [ ] Carbon footprint calculation
- [ ] Crowd-sourced traffic reporting

## 📝 Usage Guide

### Setting a Route
1. Open the application at the deployment link
2. Select a start location from the dropdown or search
3. Select a destination location
4. Click "Find Route" to calculate available routes
5. View route details including:
   - Distance
   - Estimated time
   - Traffic delay
   - Traffic impact percentage

### Comparing Routes
- Multiple routes are automatically calculated
- Click on a route in the "Routes Found" section to select it
- View detailed metrics for each route

### Using Map Selection
1. Click the location pins on the sidebar to enable map selection mode
2. Click directly on the map to set start/destination locations
3. The map will automatically zoom to the selected location

## 🔐 Security Considerations

- API keys should be stored in environment variables
- Consider implementing backend proxy for API calls
- Validate user input on both client and server sides
- Use HTTPS in production

## 💾 Dependencies Management

The project uses npm for package management. Key dependencies:
- React & React DOM for UI
- Leaflet for mapping
- Tailwind CSS for styling
- TomTom APIs for routing and traffic data

Run `npm audit` to check for security vulnerabilities.

## 📞 Support & Contribution

For issues, questions, or contributions:
1. Create an issue on GitHub
2. Submit pull requests for new features
3. Follow the existing code style and conventions

## 📄 License

This project is part of a hackathon/competition. See project files for specific licensing information.

## 🙏 Acknowledgments

- TomTom for routing and traffic APIs
- OSRM for fallback routing service
- OpenStreetMap community for map data
- Radix UI for accessible components

---

**Last Updated**: February 26, 2026  
**Version**: 1.0.0-beta
