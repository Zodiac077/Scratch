import { useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { MdToggleOn, MdToggleOff } from 'react-icons/md';
import { RouteInfoCard } from './RouteInfoCard';
import { TrafficLegend } from './TrafficLegend';

const SAMPLE_LOCATIONS = [
  'Alambagh',
  'Charbagh Railway Station',
  'Gomti Nagar',
  'Hazratgunj',
  'Indira Nagar',
  'Jankipuram',
  'Kaiserbagh',
  'Lucknow Cantonment',
  'Mahanagar',
  'Naka Hindola',
];

interface Route {
  name: string;
  distance: string;
  estimatedTime: string;
  trafficLevel: 'Low' | 'Medium' | 'High';
  isBestRoute: boolean;
}

export const ControlPanel = () => {
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>(undefined);

  const handleFindRoute = () => {
    if (startLocation && endLocation && startLocation !== endLocation) {
      // Mock route data
      const mockRoute: Route = {
        name: `${startLocation} → ${endLocation}`,
        distance: '12.4 km',
        estimatedTime: '28 mins',
        trafficLevel: 'Medium',
        isBestRoute: true,
      };
      setSelectedRoute(mockRoute);
    }
  };

  const isFormValid = startLocation && endLocation && startLocation !== endLocation;

  return (
    <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-700 p-6 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
          Lucknow Smart Traffic System
        </h1>
        <p className="text-xs text-slate-500 mt-1">Route optimization & traffic monitoring</p>
      </div>

      {/* Start Location Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
          <FaLocationDot className="inline mr-2 text-green-400" />
          Start Location
        </label>
        <select
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          disabled={useCurrentLocation}
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-600"
        >
          <option value="">Choose start location...</option>
          {SAMPLE_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Use Current Location Toggle */}
      <div className="flex items-center justify-between bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors">
        <span className="text-xs font-medium text-slate-300">Use Current Location</span>
        <button
          onClick={() => setUseCurrentLocation(!useCurrentLocation)}
          className="focus:outline-none transition-colors"
        >
          {useCurrentLocation ? (
            <MdToggleOn className="text-cyan-500 text-2xl" />
          ) : (
            <MdToggleOff className="text-slate-600 text-2xl" />
          )}
        </button>
      </div>

      {/* End Location Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
          <FaLocationDot className="inline mr-2 text-red-400" />
          End Location
        </label>
        <select
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
        >
          <option value="">Choose destination...</option>
          {SAMPLE_LOCATIONS.map(
            (loc) =>
              loc !== startLocation && (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              )
          )}
        </select>
      </div>

      {/* Find Route Button */}
      <button
        onClick={handleFindRoute}
        disabled={!isFormValid}
        className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 transform hover:shadow-lg hover:shadow-cyan-500/50 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-wide"
        title={!isFormValid ? 'Select different start and end locations' : 'Find the best route'}
      >
        ✈ Find Best Route
      </button>

      {/* Route Info Card */}
      <div>
        <RouteInfoCard routeInfo={selectedRoute} />
      </div>

      {/* Traffic Legend */}
      <div>
        <TrafficLegend />
      </div>

      {/* Footer Info */}
      <div className="text-xs text-slate-500 border-t border-slate-700 pt-4 text-center">
        <p>Version 1.0.0</p>
        <p className="mt-1">Smart routing for Lucknow</p>
      </div>
    </div>
  );
};
