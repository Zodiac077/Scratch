import { FaRoute, FaTachometerAlt } from 'react-icons/fa';
import { MdLocationOn, MdTimer } from 'react-icons/md';

interface RouteInfo {
  name: string;
  distance: string;
  estimatedTime: string;
  trafficLevel: 'Low' | 'Medium' | 'High';
  isBestRoute: boolean;
}

export const RouteInfoCard = ({ routeInfo }: { routeInfo?: RouteInfo }) => {
  if (!routeInfo) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
        <div className="text-center text-slate-400 text-sm py-6">
          Select start and end locations to see route details
        </div>
      </div>
    );
  }

  const trafficColor = {
    'Low': 'bg-green-500/10 text-green-400',
    'Medium': 'bg-orange-500/10 text-orange-400',
    'High': 'bg-red-500/10 text-red-400',
  }[routeInfo.trafficLevel];

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
      <div className="space-y-4">
        {/* Route Name */}
        <div className="flex items-start gap-3">
          <FaRoute className="text-cyan-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400 uppercase">Route</p>
            <p className="text-sm font-medium text-slate-200">{routeInfo.name}</p>
          </div>
        </div>

        {/* Distance */}
        <div className="flex items-start gap-3">
          <MdLocationOn className="text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400 uppercase">Distance</p>
            <p className="text-sm font-medium text-slate-200">{routeInfo.distance}</p>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="flex items-start gap-3">
          <MdTimer className="text-purple-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400 uppercase">Est. Time</p>
            <p className="text-sm font-medium text-slate-200">{routeInfo.estimatedTime}</p>
          </div>
        </div>

        {/* Traffic Level */}
        <div className="flex items-start gap-3">
          <FaTachometerAlt className="text-yellow-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400 uppercase">Traffic Level</p>
            <p className={`text-sm font-medium px-2 py-1 rounded inline-block ${trafficColor}`}>
              {routeInfo.trafficLevel}
            </p>
          </div>
        </div>

        {/* Best Route Badge */}
        {routeInfo.isBestRoute && (
          <div className="pt-2 border-t border-slate-700">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
              ⭐ BEST ROUTE
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
