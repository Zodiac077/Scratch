import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Clock, MapPin, AlertCircle, Loader2, ArrowRight, X, Zap, TrendingUp } from 'lucide-react';

// TomTom API Key
const TOMTOM_API_KEY = '6sRys27xX8YfMNjJMTOxTMYiKOR4nFWx';
const USE_TOMTOM = true; // Set to false to use dummy data only

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const startIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Default location: BBDU, Lucknow
const DEFAULT_LOCATION: [number, number] = [26.8467, 80.9462];

// Common locations in Lucknow
const COMMON_LOCATIONS = [
  { name: 'Hazratganj, Lucknow', lat: 26.8547, lng: 80.9467 },
  { name: 'Gomti Nagar, Lucknow', lat: 26.8506, lng: 81.0076 },
  { name: 'Aminabad, Lucknow', lat: 26.8423, lng: 80.9114 },
  { name: 'Charbagh Railway Station, Lucknow', lat: 26.8202, lng: 80.9230 },
  { name: 'Lucknow Airport', lat: 26.7606, lng: 80.8893 },
  { name: 'Alambagh, Lucknow', lat: 26.8205, lng: 80.8864 },
  { name: 'Indira Nagar, Lucknow', lat: 26.8932, lng: 80.9991 },
  { name: 'Mahanagar, Lucknow', lat: 26.9108, lng: 80.9942 },
  { name: 'BBDU, Lucknow', lat: 26.8467, lng: 80.9462 },
];

// Dummy Traffic Data - High congestion zones
interface TrafficZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  trafficLevel: 'low' | 'medium' | 'high' | 'severe';
  congestionPercent: number;
  avgSpeed: number; // km/h
  timeOfDay?: string; // 'peak' | 'normal' | 'off-peak'
}

const TRAFFIC_ZONES: TrafficZone[] = [
  {
    id: 'tz1',
    name: 'Charbagh Station Circle',
    lat: 26.8202,
    lng: 80.9230,
    radius: 800,
    trafficLevel: 'severe',
    congestionPercent: 85,
    avgSpeed: 15,
    timeOfDay: 'peak'
  },
  {
    id: 'tz2',
    name: 'Hazratganj Market',
    lat: 26.8547,
    lng: 80.9467,
    radius: 600,
    trafficLevel: 'high',
    congestionPercent: 75,
    avgSpeed: 20,
    timeOfDay: 'peak'
  },
  {
    id: 'tz3',
    name: 'Aminabad Crossing',
    lat: 26.8423,
    lng: 80.9114,
    radius: 700,
    trafficLevel: 'high',
    congestionPercent: 70,
    avgSpeed: 22,
    timeOfDay: 'normal'
  },
  {
    id: 'tz4',
    name: 'Lucknow Junction Road',
    lat: 26.8350,
    lng: 80.8950,
    radius: 1000,
    trafficLevel: 'high',
    congestionPercent: 72,
    avgSpeed: 25,
    timeOfDay: 'peak'
  },
  {
    id: 'tz5',
    name: 'Gomti Nagar Road',
    lat: 26.8506,
    lng: 81.0076,
    radius: 500,
    trafficLevel: 'medium',
    congestionPercent: 45,
    avgSpeed: 35,
    timeOfDay: 'normal'
  },
  {
    id: 'tz6',
    name: 'Alambagh Junction',
    lat: 26.8205,
    lng: 80.8864,
    radius: 600,
    trafficLevel: 'medium',
    congestionPercent: 50,
    avgSpeed: 32,
    timeOfDay: 'normal'
  },
  {
    id: 'tz7',
    name: 'Mahanagar Crossing',
    lat: 26.9108,
    lng: 80.9942,
    radius: 400,
    trafficLevel: 'low',
    congestionPercent: 20,
    avgSpeed: 45,
    timeOfDay: 'off-peak'
  },
  {
    id: 'tz8',
    name: 'Indira Nagar Bridge',
    lat: 26.8932,
    lng: 80.9991,
    radius: 550,
    trafficLevel: 'medium',
    congestionPercent: 55,
    avgSpeed: 30,
    timeOfDay: 'peak'
  }
];

interface RouteOption {
  distance: string;
  distanceKm: number;
  duration: number;
  travelTime: string;
  trafficDelay: string;
  estimatedTraffic: 'low' | 'medium' | 'high';
  arrivalTime: string;
  coordinates: [number, number][];
  color: string;
  trafficZonesInRoute: TrafficZone[];
  totalTrafficImpact: number; // 0-100
  suggestion?: string;
}

interface RouteInfo {
  distance: string;
  travelTime: string;
  trafficDelay: string;
  arrivalTime: string;
}

interface LocationCoords {
  lat: number;
  lng: number;
}

// Component to handle map events
function MapEventHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Calculate distance between two points using Haversine formula
const calculateHaversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Return in meters
};

// Check which traffic zones a route passes through
const getTrafficZonesInRoute = (routeCoordinates: [number, number][]): TrafficZone[] => {
  const zonesInRoute: TrafficZone[] = [];
  
  for (const zone of TRAFFIC_ZONES) {
    for (const [lat, lng] of routeCoordinates) {
      const distance = calculateHaversineDistance(lat, lng, zone.lat, zone.lng);
      if (distance <= zone.radius) {
        if (!zonesInRoute.find(z => z.id === zone.id)) {
          zonesInRoute.push(zone);
        }
        break;
      }
    }
  }
  
  return zonesInRoute;
};

// Calculate total traffic impact for a route (0-100)
const calculateTrafficImpact = (zones: TrafficZone[]): number => {
  if (zones.length === 0) return 0;
  const totalCongestion = zones.reduce((sum, zone) => sum + zone.congestionPercent, 0);
  return Math.min(100, Math.round(totalCongestion / zones.length));
};

// Component to update map center
function MapCenterUpdater({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (zoom) {
      map.setView(center, zoom);
    } else {
      map.panTo(center);
    }
  }, [center, zoom, map]);
  return null;
}

export default function App() {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [startCoords, setStartCoords] = useState<LocationCoords | null>(null);
  const [destCoords, setDestCoords] = useState<LocationCoords | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [userAccuracy, setUserAccuracy] = useState<number | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [allRoutes, setAllRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_LOCATION);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapSelectionMode, setMapSelectionMode] = useState<'start' | 'destination' | null>(null);
  const [liveTracking, setLiveTracking] = useState(false);
  const mapRef = useRef<any>(null);
  const lastCalculatedLocationRef = useRef<LocationCoords | null>(null);

  // Get user's live location with higher accuracy
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          setUserAccuracy(accuracy);
          // Pan to user location
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          // Silently fail - will show error when user clicks current location button
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
      
      // Watch position for continuous updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setUserAccuracy(accuracy);
        },
        (error) => {
          console.log('Watch position error:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 3000,
        }
      );
      
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  // Filter locations based on input
  const getFilteredLocations = (query: string) => {
    if (!query || query.length < 2) return COMMON_LOCATIONS;
    return COMMON_LOCATIONS.filter((loc) =>
      loc.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Select location from dropdown
  const selectLocation = (location: typeof COMMON_LOCATIONS[0], isStart: boolean) => {
    if (isStart) {
      setStartLocation(location.name);
      setStartCoords({ lat: location.lat, lng: location.lng });
      setShowStartDropdown(false);
      setMapCenter([location.lat, location.lng]);
      setMapZoom(14);
    } else {
      setDestination(location.name);
      setDestCoords({ lat: location.lat, lng: location.lng });
      setShowDestDropdown(false);
      setMapCenter([location.lat, location.lng]);
      setMapZoom(14);
    }
  };

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    if (mapSelectionMode === 'start') {
      setStartLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      setStartCoords({ lat, lng });
      setMapSelectionMode(null);
    } else if (mapSelectionMode === 'destination') {
      setDestination(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      setDestCoords({ lat, lng });
      setMapSelectionMode(null);
    }
  };

  // Use current location as start
  const useCurrentLocation = () => {
    if (userLocation) {
      setStartLocation(`Your Location (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`);
      setStartCoords(userLocation);
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(15);
      setError(null);
    } else {
      // If location not available, request it again
      setError('Getting your current location...');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const location = { lat: latitude, lng: longitude };
            setUserLocation(location);
            setUserAccuracy(accuracy);
            setStartLocation(`Your Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            setStartCoords(location);
            setMapCenter([latitude, longitude]);
            setMapZoom(15);
            setError(null);
          },
          (err) => {
            console.error('Geolocation error:', err);
            let errorMsg = 'Unable to get your location. ';
            if (err.code === 1) {
              errorMsg += 'Please enable location permissions.';
            } else if (err.code === 2) {
              errorMsg += 'Location service unavailable.';
            } else if (err.code === 3) {
              errorMsg += 'Location request timed out.';
            }
            setError(errorMsg);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
      }
    }
  };

  // Calculate route using TomTom API with OSRM fallback
  const calculateRoute = async () => {
    if (!startLocation || !destination) {
      setError('Please enter both start and destination locations');
      return;
    }

    if (!startCoords || !destCoords) {
      setError('Please select a location from the dropdown or click on the map');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      let usedTomTom = false;

      // Try TomTom API first
      if (USE_TOMTOM && TOMTOM_API_KEY) {
        try {
          const response = await fetch(
            `https://api.tomtom.com/routing/1/calculateRoute/${startCoords.lat},${startCoords.lng}:${destCoords.lat},${destCoords.lng}/json?key=${TOMTOM_API_KEY}&routeType=fastest&traffic=true&alternatives=true`
          );

          if (response.ok) {
            const tomtomData = await response.json();
            
            if (tomtomData.routes && tomtomData.routes.length > 0) {
              // Convert TomTom format to our format
              data = {
                code: 'Ok',
                routes: tomtomData.routes.map((route: any) => ({
                  distance: route.summary.lengthInMeters,
                  duration: route.summary.travelTimeInSeconds,
                  geometry: {
                    coordinates: route.legs
                      .flatMap((leg: any) => leg.points)
                      .map((point: any) => [point.longitude, point.latitude])
                  }
                }))
              };
              usedTomTom = true;
              console.log('Using TomTom API for routing');
            }
          }
        } catch (tomtomError) {
          console.log('TomTom API error, falling back to OSRM:', tomtomError);
        }
      }

      // Fallback to OSRM if TomTom fails or is disabled
      if (!data) {
        console.log('Using OSRM (dummy data) for routing');
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson&alternatives=true&steps=true`
        );

        if (!response.ok) {
          throw new Error('Failed to calculate route');
        }

        data = await response.json();
      }

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }

      // Process all routes
      const routeOptions: RouteOption[] = [];
      const colors = ['#4F46E5', '#F59E0B', '#EC4899'];
      
      data.routes.forEach((route: any, index: number) => {
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [
          coord[1],
          coord[0],
        ] as [number, number]);
        
        const distanceKm = (route.distance / 1000).toFixed(1);
        const travelTimeMin = Math.round(route.duration / 60);
        
        // Get traffic zones in this route
        const trafficZonesInRoute = getTrafficZonesInRoute(coordinates);
        const totalTrafficImpact = calculateTrafficImpact(trafficZonesInRoute);
        
        // Traffic simulation based on traffic zones and time of day
        const hour = new Date().getHours();
        const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
        
        // Calculate traffic delay based on zones and rush hour
        const baseMultiplier = index === 0 ? (isRushHour ? 0.8 : 0.4) : (isRushHour ? 0.5 : 0.2);
        const zoneImpactMultiplier = totalTrafficImpact / 100;
        const trafficMultiplier = Math.max(baseMultiplier, baseMultiplier + (zoneImpactMultiplier * 0.5));
        const trafficDelayMin = Math.floor(travelTimeMin * trafficMultiplier);
        
        // Determine traffic level
        let estimatedTraffic: 'low' | 'medium' | 'high' = 'low';
        if (totalTrafficImpact > 60) estimatedTraffic = 'high';
        else if (totalTrafficImpact > 35) estimatedTraffic = 'medium';
        
        const now = new Date();
        const arrivalTime = new Date(now.getTime() + (route.duration + trafficDelayMin * 60) * 1000);
        const arrivalTimeStr = arrivalTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        
        // Generate suggestion based on traffic zones
        let suggestion = '';
        if (trafficZonesInRoute.length === 0) {
          suggestion = '✅ Clear route - No heavy traffic zones';
        } else if (trafficZonesInRoute.length === 1) {
          const zone = trafficZonesInRoute[0];
          suggestion = `⚠️ Passes through ${zone.name} - ${zone.trafficLevel} traffic`;
        } else {
          const severe = trafficZonesInRoute.filter(z => z.trafficLevel === 'severe').length;
          const high = trafficZonesInRoute.filter(z => z.trafficLevel === 'high').length;
          suggestion = `📍 ${trafficZonesInRoute.length} congestion zones${severe > 0 ? ` (${severe} severe)` : ''}`;
        }
        
        routeOptions.push({
          distance: `${distanceKm} km`,
          distanceKm: parseFloat(distanceKm),
          duration: route.duration,
          travelTime: `${travelTimeMin} min`,
          trafficDelay: trafficDelayMin > 0 ? `~${trafficDelayMin} min` : 'No delay',
          estimatedTraffic,
          arrivalTime: arrivalTimeStr,
          coordinates,
          color: colors[index % colors.length],
          trafficZonesInRoute,
          totalTrafficImpact,
          suggestion
        });
      });
      
      // Sort routes: prefer routes with less traffic impact
      routeOptions.sort((a, b) => a.totalTrafficImpact - b.totalTrafficImpact);
      
      setAllRoutes(routeOptions);
      setSelectedRouteIndex(0);
      
      // Set the best route (least traffic) as default
      const selectedRoute = routeOptions[0];
      setRoutePolyline(selectedRoute.coordinates);
      setRouteInfo({
        distance: selectedRoute.distance,
        travelTime: selectedRoute.travelTime,
        trafficDelay: selectedRoute.trafficDelay,
        arrivalTime: selectedRoute.arrivalTime,
      });

      // Fit map to show the route
      if (mapRef.current) {
        const bounds = L.latLngBounds(selectedRoute.coordinates);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error: any) {
      console.error('Route calculation error:', error);
      setError('Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Return in meters
  };

  // Recalculate route with current user location
  const recalculateRouteWithUserLocation = async () => {
    if (!liveTracking || !userLocation || !destCoords) {
      return;
    }

    // Check if user has moved at least 100 meters from last calculation
    if (lastCalculatedLocationRef.current) {
      const distanceMoved = calculateDistance(
        lastCalculatedLocationRef.current.lat,
        lastCalculatedLocationRef.current.lng,
        userLocation.lat,
        userLocation.lng
      );

      if (distanceMoved < 100) {
        return; // Don't recalculate if moved less than 100m
      }
    }

    try {
      let data;

      // Try TomTom API first
      if (USE_TOMTOM && TOMTOM_API_KEY) {
        try {
          const response = await fetch(
            `https://api.tomtom.com/routing/1/calculateRoute/${userLocation.lat},${userLocation.lng}:${destCoords.lat},${destCoords.lng}/json?key=${TOMTOM_API_KEY}&routeType=fastest&traffic=true&alternatives=true`
          );

          if (response.ok) {
            const tomtomData = await response.json();
            
            if (tomtomData.routes && tomtomData.routes.length > 0) {
              data = {
                code: 'Ok',
                routes: tomtomData.routes.map((route: any) => ({
                  distance: route.summary.lengthInMeters,
                  duration: route.summary.travelTimeInSeconds,
                  geometry: {
                    coordinates: route.legs
                      .flatMap((leg: any) => leg.points)
                      .map((point: any) => [point.longitude, point.latitude])
                  }
                }))
              };
            }
          }
        } catch (tomtomError) {
          console.log('TomTom API error in live tracking, falling back to OSRM:', tomtomError);
        }
      }

      // Fallback to OSRM if TomTom fails or is disabled
      if (!data) {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson&alternatives=true&steps=true`
        );

        if (!response.ok) {
          throw new Error('Failed to calculate route');
        }

        data = await response.json();
      }

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }

      // Process all routes
      const routeOptions: RouteOption[] = [];
      const colors = ['#4F46E5', '#F59E0B', '#EC4899'];

      data.routes.forEach((route: any, index: number) => {
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [
          coord[1],
          coord[0],
        ] as [number, number]);

        const distanceKm = (route.distance / 1000).toFixed(1);
        const travelTimeMin = Math.round(route.duration / 60);

        // Get traffic zones in this route
        const trafficZonesInRoute = getTrafficZonesInRoute(coordinates);
        const totalTrafficImpact = calculateTrafficImpact(trafficZonesInRoute);

        // Traffic simulation based on zones and time of day
        const hour = new Date().getHours();
        const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);

        const baseMultiplier = index === 0 ? (isRushHour ? 0.8 : 0.4) : (isRushHour ? 0.5 : 0.2);
        const zoneImpactMultiplier = totalTrafficImpact / 100;
        const trafficMultiplier = Math.max(baseMultiplier, baseMultiplier + (zoneImpactMultiplier * 0.5));
        const trafficDelayMin = Math.floor(travelTimeMin * trafficMultiplier);

        let estimatedTraffic: 'low' | 'medium' | 'high' = 'low';
        if (totalTrafficImpact > 60) estimatedTraffic = 'high';
        else if (totalTrafficImpact > 35) estimatedTraffic = 'medium';

        const now = new Date();
        const arrivalTime = new Date(now.getTime() + (route.duration + trafficDelayMin * 60) * 1000);
        const arrivalTimeStr = arrivalTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        // Generate suggestion
        let suggestion = '';
        if (trafficZonesInRoute.length === 0) {
          suggestion = '✅ Clear route - No heavy traffic zones';
        } else if (trafficZonesInRoute.length === 1) {
          const zone = trafficZonesInRoute[0];
          suggestion = `⚠️ Passes through ${zone.name} - ${zone.trafficLevel} traffic`;
        } else {
          const severe = trafficZonesInRoute.filter(z => z.trafficLevel === 'severe').length;
          suggestion = `📍 ${trafficZonesInRoute.length} congestion zones${severe > 0 ? ` (${severe} severe)` : ''}`;
        }

        routeOptions.push({
          distance: `${distanceKm} km`,
          distanceKm: parseFloat(distanceKm),
          duration: route.duration,
          travelTime: `${travelTimeMin} min`,
          trafficDelay: trafficDelayMin > 0 ? `~${trafficDelayMin} min` : 'No delay',
          estimatedTraffic,
          arrivalTime: arrivalTimeStr,
          coordinates,
          color: colors[index % colors.length],
          trafficZonesInRoute,
          totalTrafficImpact,
          suggestion
        });
      });

      // Sort routes: prefer routes with less traffic impact
      routeOptions.sort((a, b) => a.totalTrafficImpact - b.totalTrafficImpact);

      setAllRoutes(routeOptions);
      setSelectedRouteIndex(0);

      const selectedRoute = routeOptions[0];
      setRoutePolyline(selectedRoute.coordinates);
      setRouteInfo({
        distance: selectedRoute.distance,
        travelTime: selectedRoute.travelTime,
        trafficDelay: selectedRoute.trafficDelay,
        arrivalTime: selectedRoute.arrivalTime,
      });

      // Update last calculated location
      lastCalculatedLocationRef.current = userLocation;

      // Fit map to show the route
      if (mapRef.current) {
        const bounds = L.latLngBounds(selectedRoute.coordinates);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error: any) {
      console.error('Live route recalculation error:', error);
    }
  };

  // Trigger live tracking route recalculation when user location changes
  useEffect(() => {
    if (liveTracking && userLocation && destCoords) {
      recalculateRouteWithUserLocation();
    }
  }, [userLocation, liveTracking, destCoords]);
  const clearRoute = () => {
    setRoutePolyline([]);
    setRouteInfo(null);
    setAllRoutes([]);
    setSelectedRouteIndex(0);
    setStartLocation('');
    setDestination('');
    setStartCoords(null);
    setDestCoords(null);
    setError(null);
  };
  
  // Select different route
  const selectRoute = (index: number) => {
    setSelectedRouteIndex(index);
    const route = allRoutes[index];
    setRoutePolyline(route.coordinates);
    setRouteInfo({
      distance: route.distance,
      travelTime: route.travelTime,
      trafficDelay: route.trafficDelay,
      arrivalTime: route.arrivalTime,
    });
    
    if (mapRef.current) {
      const bounds = L.latLngBounds(route.coordinates);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="h-screen w-screen relative flex overflow-hidden">
      {/* Map Container */}
      <MapContainer
        center={DEFAULT_LOCATION}
        zoom={13}
        className={mapSelectionMode ? 'h-full flex-1 transition cursor-crosshair' : 'h-full flex-1 transition cursor-grab'}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
        <MapEventHandler onClick={handleMapClick} />

        {/* Start location marker */}
        {startCoords && (
          <Marker position={[startCoords.lat, startCoords.lng]} icon={startIcon}>
            <Popup>
              <strong>Start</strong>
              <br />
              {startLocation}
            </Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {destCoords && (
          <Marker position={[destCoords.lat, destCoords.lng]} icon={destIcon}>
            <Popup>
              <strong>Destination</strong>
              <br />
              {destination}
            </Popup>
          </Marker>
        )}

        {/* Route polylines - render only selected route */}
        {allRoutes.length > 0 && selectedRouteIndex < allRoutes.length && (
          <Polyline
            key={selectedRouteIndex}
            positions={allRoutes[selectedRouteIndex].coordinates}
            color={allRoutes[selectedRouteIndex].color}
            weight={6}
            opacity={1}
            dashArray=""
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Traffic Zones - Visual Indicators */}
        {TRAFFIC_ZONES.map((zone) => {
          const zoneColor = 
            zone.trafficLevel === 'severe' ? '#ef4444' :
            zone.trafficLevel === 'high' ? '#f97316' :
            zone.trafficLevel === 'medium' ? '#fbbf24' :
            '#22c55e';

          return (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              fillColor={zoneColor}
              fillOpacity={0.2}
              color={zoneColor}
              weight={2}
              dashArray="5, 5"
            >
              <Popup>
                <div className="text-sm">
                  <strong>{zone.name}</strong>
                  <br />
                  <span className={`font-semibold ${
                    zone.trafficLevel === 'severe' ? 'text-red-600' :
                    zone.trafficLevel === 'high' ? 'text-orange-600' :
                    zone.trafficLevel === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {zone.trafficLevel.toUpperCase()} Traffic
                  </span>
                  <br />
                  Congestion: {zone.congestionPercent}%
                  <br />
                  Avg Speed: {zone.avgSpeed} km/h
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>

      {/* Map Selection Indicator */}
      {mapSelectionMode && (
        <div className={mapSelectionMode === 'start' ? 'absolute top-4 left-4 md:left-auto md:right-1/3 md:bottom-auto px-6 py-3 rounded-xl shadow-xl font-medium text-white text-center z-[500] flex items-center gap-3 animate-bounce bg-red-500 border-2 border-red-600' : 'absolute top-4 left-4 md:left-auto md:right-1/3 md:bottom-auto px-6 py-3 rounded-xl shadow-xl font-medium text-white text-center z-[500] flex items-center gap-3 animate-bounce bg-green-500 border-2 border-green-600'}>
          <span className="inline-block w-3 h-3 bg-white rounded-full animate-pulse"></span>
          {mapSelectionMode === 'start'
            ? 'Click on map for start point'
            : 'Click on map for destination'}
        </div>
      )}

      {/* Modern Sidebar Panel */}
      <div className="w-full md:w-96 bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-white/20 p-2 rounded-lg">
              <Navigation size={24} />
            </div>
            <h1 className="text-2xl font-bold">Route Finder</h1>
          </div>
          <p className="text-indigo-100 text-sm">Find the best route in Lucknow</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Location Input Section */}
          <div className="space-y-4">
            {/* Start Location */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <label className="text-sm font-semibold text-gray-700">From</label>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      onFocus={() => setShowStartDropdown(true)}
                      onBlur={() => setTimeout(() => setShowStartDropdown(false), 200)}
                      placeholder="Select starting point"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                        mapSelectionMode === 'start'
                          ? 'border-red-500 bg-red-50 ring-2 ring-red-300'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                    {showStartDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {getFilteredLocations(startLocation).map((location, index) => (
                          <div
                            key={index}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectLocation(location, true);
                            }}
                            className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition flex items-center gap-2"
                          >
                            <MapPin size={16} className="text-indigo-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{location.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setMapSelectionMode(mapSelectionMode === 'start' ? null : 'start')}
                    className={`px-4 py-3 rounded-xl transition flex-shrink-0 flex items-center gap-2 font-medium ${
                      mapSelectionMode === 'start'
                        ? 'bg-red-500 text-white border border-red-600 shadow-lg'
                        : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                    }`}
                    title="Click on map to select start point"
                  >
                    <MapPin size={18} />
                  </button>
                  <button
                    onClick={useCurrentLocation}
                    disabled={loading}
                    className={`px-4 py-3 rounded-xl transition flex-shrink-0 flex items-center gap-2 font-medium ${
                      userLocation && startCoords
                        ? 'bg-green-50 border border-green-200 text-green-600 hover:bg-green-100'
                        : 'bg-yellow-50 border border-yellow-200 text-yellow-600 hover:bg-yellow-100'
                    } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    title={userLocation ? "Use current location" : "Get current location"}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                  </button>
                </div>
                {mapSelectionMode === 'start' && (
                  <div className="px-3 py-2 bg-red-100 border border-red-300 rounded-lg text-sm text-red-700 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    Click on the map to select starting point
                  </div>
                )}
              </div>
            </div>

            {/* Live Tracking Toggle */}
            {userLocation && (
              <button
                onClick={() => setLiveTracking(!liveTracking)}
                className={`w-full px-4 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                  liveTracking
                    ? 'bg-blue-500 text-white border border-blue-600 shadow-lg animate-pulse'
                    : 'bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100'
                }`}
                title={liveTracking ? 'Disable live tracking' : 'Enable live tracking'}
              >
                <span className={`inline-block w-2 h-2 rounded-full ${liveTracking ? 'bg-white animate-pulse' : 'bg-blue-600'}`}></span>
                {liveTracking ? '🔴 Live Tracking Active' : '⚪ Enable Live Tracking'}
              </button>
            )}

            {/* Destination Location */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <label className="text-sm font-semibold text-gray-700">To</label>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onFocus={() => setShowDestDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
                      placeholder="Select destination"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                        mapSelectionMode === 'destination'
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-300'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                    {showDestDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {getFilteredLocations(destination).map((location, index) => (
                          <div
                            key={index}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectLocation(location, false);
                            }}
                            className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition flex items-center gap-2"
                          >
                            <MapPin size={16} className="text-indigo-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{location.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setMapSelectionMode(mapSelectionMode === 'destination' ? null : 'destination')}
                    className={`px-4 py-3 rounded-xl transition flex-shrink-0 flex items-center gap-2 font-medium ${
                      mapSelectionMode === 'destination'
                        ? 'bg-green-500 text-white border border-green-600 shadow-lg'
                        : 'bg-green-50 border border-green-200 text-green-600 hover:bg-green-100'
                    }`}
                    title="Click on map to select destination"
                  >
                    <MapPin size={18} />
                  </button>
                </div>
                {mapSelectionMode === 'destination' && (
                  <div className="px-3 py-2 bg-green-100 border border-green-300 rounded-lg text-sm text-green-700 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                    Click on the map to select destination
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tip Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs text-blue-700">
              💡 <span className="font-medium">Tip:</span> Use the map button, dropdown list, or type location names
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Live Tracking Status */}
          {liveTracking && destCoords && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-blue-600 rounded-full animate-pulse"></span>
                <p className="text-sm font-semibold text-blue-900">Live Tracking Enabled</p>
              </div>
              <p className="text-xs text-blue-700">
                Route updates automatically as you move closer to your destination. Best route is highlighted.
              </p>
              {userLocation && (
                <p className="text-xs text-blue-600">
                  📍 Current Position: {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
                </p>
              )}
            </div>
          )}

          {/* Route Information */}
          {routeInfo && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600" />
                Route Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                  <p className="text-xs text-indigo-700 font-medium mb-1">Distance</p>
                  <p className="text-2xl font-bold text-indigo-600">{routeInfo.distance}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs text-blue-700 font-medium mb-1">Travel Time</p>
                  <p className="text-2xl font-bold text-blue-600">{routeInfo.travelTime}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <p className="text-xs text-orange-700 font-medium mb-1">Traffic Delay</p>
                  <p className="text-2xl font-bold text-orange-600">{routeInfo.trafficDelay}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <p className="text-xs text-green-700 font-medium mb-1 flex items-center gap-1">
                    <Clock size={12} /> ETA
                  </p>
                  <p className="text-2xl font-bold text-green-600">{routeInfo.arrivalTime}</p>
                </div>
              </div>
            </div>
          )}

          {/* Traffic Legend */}
          <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-4 border border-gray-200 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">🚦 Traffic Legend</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" style={{ opacity: 0.6 }}></div>
                <span className="text-gray-700">Severe (80-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500" style={{ opacity: 0.6 }}></div>
                <span className="text-gray-700">High (60-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500" style={{ opacity: 0.6 }}></div>
                <span className="text-gray-700">Medium (30-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" style={{ opacity: 0.6 }}></div>
                <span className="text-gray-700">Light (0-30%)</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic">Colored circles on map show congestion zones. Dashed lines = alternative routes.</p>
          </div>

          {/* Alternative Routes */}
          {allRoutes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-600" />
                  {allRoutes.length} Route{allRoutes.length !== 1 ? 's' : ''} Available
                </span>
                {liveTracking && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full animate-pulse">
                    🔄 Updating
                  </span>
                )}
              </h3>
              <div className="space-y-2">
                {allRoutes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => selectRoute(index)}
                    className={`w-full p-4 rounded-xl border-2 transition text-left ${
                      selectedRouteIndex === index
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: route.color }}
                        ></div>
                        <span className="font-semibold text-gray-900">
                          {route.totalTrafficImpact < 25 
                            ? '⭐ Best Route' 
                            : route.totalTrafficImpact < 50 
                            ? 'Route ' + (index + 1)
                            : 'Alternate Route'}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          route.estimatedTraffic === 'low'
                            ? 'bg-green-100 text-green-700'
                            : route.estimatedTraffic === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {route.estimatedTraffic === 'low'
                          ? '🟢 Light'
                          : route.estimatedTraffic === 'medium'
                          ? '🟡 Moderate'
                          : '🔴 Heavy'}
                      </span>
                    </div>
                    
                    {/* Route suggestion */}
                    {route.suggestion && (
                      <p className="text-xs text-gray-600 mb-2 italic">{route.suggestion}</p>
                    )}

                    {/* Traffic zones in this route */}
                    {route.trafficZonesInRoute.length > 0 && (
                      <div className="mb-2 text-xs">
                        <p className="text-gray-600 font-medium mb-1">Traffic Zones:</p>
                        <div className="flex flex-wrap gap-1">
                          {route.trafficZonesInRoute.map((zone) => (
                            <span 
                              key={zone.id}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                zone.trafficLevel === 'severe' ? 'bg-red-100 text-red-700' :
                                zone.trafficLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {zone.name.split(',')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-1 text-xs">
                      <div>
                        <p className="text-gray-600">Distance</p>
                        <p className="font-bold text-gray-900">{route.distance}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time</p>
                        <p className="font-bold text-gray-900">{route.travelTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Delay</p>
                        <p className="font-bold text-gray-900">{route.trafficDelay}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Impact</p>
                        <p className="font-bold text-gray-900">{route.totalTrafficImpact}%</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 space-y-2">
            <h3 className="text-xs font-semibold text-purple-900 flex items-center gap-2">
              <span>⚡</span> Routing Service
            </h3>
            <ul className="space-y-1 text-xs text-purple-800">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                Maps: OpenStreetMap
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                Primary: {USE_TOMTOM ? 'TomTom API' : 'OSRM (Dummy Data)'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                Fallback: OSRM (when primary unavailable)
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6 space-y-3 bg-gray-50">
          <button
            onClick={calculateRoute}
            disabled={loading || !startCoords || !destCoords}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Finding Route...</span>
              </>
            ) : (
              <>
                <ArrowRight size={20} />
                <span>Find Route</span>
              </>
            )}
          </button>

          {routePolyline.length > 0 && (
            <button
              onClick={clearRoute}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              <X size={20} />
              <span>Clear Route</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
