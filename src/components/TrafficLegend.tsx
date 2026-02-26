import { FaCircle } from 'react-icons/fa';

export const TrafficLegend = () => {
  const levels = [
    { color: 'bg-blue-500', label: 'Start', code: 'START' },
    { color: 'bg-green-500', label: 'Low Traffic', code: 'LOW' },
    { color: 'bg-orange-500', label: 'Medium Traffic', code: 'MEDIUM' },
    { color: 'bg-red-500', label: 'High Traffic', code: 'HIGH' },
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
        Traffic Legend
      </h3>
      <div className="space-y-2">
        {levels.map((level) => (
          <div key={level.code} className="flex items-center gap-3">
            <div className={`${level.color} rounded-full w-3 h-3 shadow-md`}></div>
            <span className="text-xs text-slate-400">{level.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
