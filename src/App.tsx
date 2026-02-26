import { TopBar, ControlPanel, MapArea } from './components';

function App() {
  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Control Panel */}
        <div className="hidden lg:block w-80 max-w-80 overflow-y-auto">
          <ControlPanel />
        </div>

        {/* Right Map Area */}
        <MapArea />

        {/* Mobile Control Panel (shown below map on mobile) */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 max-h-48 overflow-y-auto">
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
