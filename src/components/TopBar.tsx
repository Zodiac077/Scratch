import { Clock } from './Clock';
import { FaSignal } from 'react-icons/fa';

export const TopBar = () => {
  return (
    <div className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      {/* Left: City Name */}
      <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <span className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></span>
        Lucknow
      </h2>

      {/* Center: Clock */}
      <div className="flex items-center gap-2">
        <Clock />
      </div>

      {/* Right: Status Indicator */}
      <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">
          Traffic Simulation Active
        </span>
      </div>
    </div>
  );
};
