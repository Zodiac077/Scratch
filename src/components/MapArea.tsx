export const MapArea = () => {
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, 0.05) 25%, rgba(6, 182, 212, 0.05) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.05) 75%, rgba(6, 182, 212, 0.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, 0.05) 25%, rgba(6, 182, 212, 0.05) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.05) 75%, rgba(6, 182, 212, 0.05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Map Container with Sample Visualization */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Lucknow City Representation */}
        <div className="relative w-96 h-96">
          {/* Main city area circle */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 bg-slate-800/20"></div>
          <div className="absolute inset-4 rounded-full border border-cyan-500/20"></div>

          {/* Sample Routes/Roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            {/* Road 1 */}
            <line
              x1="200"
              y1="50"
              x2="200"
              y2="350"
              stroke="rgba(71, 85, 105, 0.4)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Road 2 */}
            <line x1="50" y1="200" x2="350" y2="200" stroke="rgba(71, 85, 105, 0.4)" strokeWidth="8" strokeLinecap="round" />
            {/* Diagonal Road 1 */}
            <line
              x1="80"
              y1="80"
              x2="320"
              y2="320"
              stroke="rgba(71, 85, 105, 0.3)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Diagonal Road 2 */}
            <line
              x1="320"
              y1="80"
              x2="80"
              y2="320"
              stroke="rgba(71, 85, 105, 0.3)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Traffic nodes */}
            <circle cx="200" cy="100" r="8" fill="rgba(34, 197, 94, 0.6)" />
            <circle cx="100" cy="200" r="8" fill="rgba(249, 115, 22, 0.6)" />
            <circle cx="300" cy="200" r="8" fill="rgba(239, 68, 68, 0.6)" />
            <circle cx="200" cy="300" r="8" fill="rgba(59, 130, 246, 0.6)" />
          </svg>

          {/* Quick Status info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent pt-12 pb-4 px-4">
            <p className="text-xs text-slate-400 text-center">
              🗺️ Interactive map area - Toggle multiple routes when available
            </p>
          </div>
        </div>

        {/* Floating Stats Card */}
        <div className="absolute top-8 right-8 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg p-4 shadow-xl">
          <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Map Stats</p>
          <div className="space-y-1 text-xs text-slate-300">
            <p>🚗 Active Routes: 3</p>
            <p>🎯 Optimization: Active</p>
            <p>⚡ Refresh Rate: Real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
};
