import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Play, 
  Pause, 
  RotateCcw, 
  Bell, 
  Volume2, 
  VolumeX, 
  Clock, 
  User, 
  AlertTriangle,
  Maximize2,
  Minimize2,
  Menu,
  ShieldCheck,
  Radio,
  LogOut
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { SystemStatus } from './SystemStatus';

interface TopStatusBarProps {
  onOpenSettings?: () => void;
  onToggleMobileMenu?: () => void;
  onLogout?: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({ 
  onOpenSettings,
  onToggleMobileMenu,
  onLogout
}) => {
  const { 
    config, 
    toggleSimulation, 
    setSoundEnabled, 
    resetSimulation, 
    events, 
    eventsGeneratedInSession,
    selectEvent 
  } = useSimulation();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen event listener to sync state if exited via ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignored if blocked by browser permissions
    }
  };

  // Live system clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utcString = currentTime.toUTCString().slice(17, 25) + ' UTC';
  const localString = currentTime.toLocaleTimeString([], { hour12: false });

  // Critical alerts in recent events
  const criticalEvents = events.filter(e => e.risk === 'critical').slice(0, 5);

  return (
    <>
      <header className="h-14 bg-[#0B1220] border-b border-[#25364D] px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 select-none shrink-0 z-30">
        {/* Left Zone: Mobile Hamburger, Brand Lockup & Status Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Trigger */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded bg-[#111E30] border border-[#25364D] text-[#dee2f2] hover:text-[#22D3EE] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#111E30] border border-[#22D3EE]/40 text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.25)]">
              <ShieldAlert className="w-4 h-4 text-[#22D3EE]" />
              <div className="absolute inset-0 rounded border border-[#22D3EE]/30 animate-pulse pointer-events-none" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-xs sm:text-sm text-[#F1F5F9] font-sans truncate">
                  SURAKSHA INTEL
                </span>
                <span className="hidden xl:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#16243A] text-[#22D3EE] border border-[#22D3EE]/30">
                  SOC v2.4
                </span>
              </div>
              <p className="hidden xs:block text-[9px] sm:text-[10px] text-[#94A3B8] font-mono tracking-wider truncate">
                CYBER THREAT OPERATIONS CENTER
              </p>
            </div>
          </div>

          <div className="hidden lg:block h-6 w-px bg-[#25364D]" />

          {/* Operational Status Chip (Replaces demo mode label) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#34D399]/10 border border-[#34D399]/40 text-[#34D399] text-[11px] font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span>LIVE DEFENSE · SEC-OPS ACTIVE</span>
          </div>
        </div>

        {/* Center Zone: Real-Time System Status, Tactical Clock & Stream Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time System Status (CPU & Memory telemetry with color-coded indicators) */}
          <SystemStatus />

          {/* Tactical Clock */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#111E30] border border-[#25364D] rounded text-xs font-mono text-[#94A3B8]">
            <Clock className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span className="text-[#F1F5F9] font-semibold">{localString}</span>
            <span className="text-[#94A3B8]/60">|</span>
            <span>{utcString}</span>
          </div>

          {/* Stream Run / Pause Toggle */}
          <div className="hidden xl:flex items-center gap-1 bg-[#111E30] border border-[#25364D] rounded p-0.5">
            <button
              onClick={toggleSimulation}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium font-mono transition-all cursor-pointer ${
                config.isRunning
                  ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                  : 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40'
              }`}
            >
              {config.isRunning ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
                  <Play className="w-3 h-3 fill-current" />
                  <span>INGRESS: ACTIVE</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>INGRESS: PAUSED</span>
                </>
              )}
            </button>

            <span className="px-2 py-0.5 text-[11px] font-mono text-[#94A3B8]">
              {config.speedMultiplier}x PACE
            </span>
          </div>
        </div>

        {/* Right Zone: Fullscreen, Audio, Notifications, User & Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Full Screen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded bg-[#111E30] border border-[#25364D] text-[#94A3B8] hover:text-[#22D3EE] hover:border-[#22D3EE]/50 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen' : 'Toggle Full Screen'}
            aria-label="Toggle Full Screen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#22D3EE]" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => setSoundEnabled(!config.soundEnabled)}
            className={`p-2 rounded border transition-colors cursor-pointer ${
              config.soundEnabled
                ? 'bg-[#22D3EE]/15 border-[#22D3EE]/50 text-[#22D3EE]'
                : 'bg-[#111E30] border-[#25364D] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
            title={config.soundEnabled ? 'Mute audio synthesizer' : 'Enable tactical audio synthesizer'}
            aria-label="Toggle Audio"
          >
            {config.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded bg-[#111E30] border border-[#25364D] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
              title="Recent Critical Threat Signals"
              aria-label="Threat notifications"
            >
              <Bell className="w-4 h-4" />
              {criticalEvents.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FB7185] text-[#080D18] font-bold text-[9px] flex items-center justify-center font-mono">
                  {criticalEvents.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#16243A] border border-[#25364D] rounded shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between border-b border-[#25364D] pb-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F1F5F9]">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#FB7185]" />
                    <span>Critical Threat Intercepts</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    {criticalEvents.length} active
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {criticalEvents.map((evt, idx) => (
                    <div
                      key={`${evt.id}-${idx}`}
                      onClick={() => {
                        selectEvent(evt);
                        setShowNotifications(false);
                      }}
                      className="p-2 rounded bg-[#111E30] hover:bg-[#1B2B42] border border-[#25364D] hover:border-[#22D3EE]/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                        <span className="text-[#FB7185] font-semibold">{evt.id}</span>
                        <span className="text-[#94A3B8]">{evt.timestamp.slice(11, 19)}</span>
                      </div>
                      <p className="text-xs text-[#F1F5F9] font-medium line-clamp-1">{evt.title}</p>
                      <p className="text-[11px] text-[#94A3B8] line-clamp-1">{evt.patternName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Action */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded bg-[#111E30] border border-[#25364D] text-[#94A3B8] hover:text-[#FB7185] hover:border-[#FB7185]/50 transition-colors text-xs font-mono cursor-pointer"
            title="Reset threat operations state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Purge</span>
          </button>

          {/* Operator Profile & Lock */}
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-[#25364D]">
            <div className="w-7 h-7 rounded bg-[#16243A] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE]">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden xl:block text-left leading-tight">
              <span className="block text-xs font-medium text-[#F1F5F9]">Chief Watch Officer</span>
              <span className="block text-[10px] font-mono text-[#34D399]">SOC Station 01</span>
            </div>

            {/* Terminal Lock / Sign Out */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 sm:px-2 sm:py-1 rounded bg-[#111E30] hover:bg-[#FB7185]/20 border border-[#25364D] hover:border-[#FB7185]/50 text-[#94A3B8] hover:text-[#FB7185] transition-colors cursor-pointer text-xs font-mono flex items-center gap-1"
                title="Lock Terminal / Sign Out"
                aria-label="Lock Terminal"
              >
                <LogOut className="w-3.5 h-3.5 text-[#FB7185]" />
                <span className="hidden md:inline text-[11px]">Lock</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#16243A] border border-[#25364D] rounded-lg max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 text-[#FB7185]">
              <div className="w-10 h-10 rounded bg-[#FB7185]/15 border border-[#FB7185]/40 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-[#FB7185]" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#F1F5F9]">Purge & Reset Operations Memory?</h3>
                <p className="text-xs text-[#94A3B8] font-mono">SURAKSHA INTEL Operations State</p>
              </div>
            </div>

            <p className="text-sm text-[#94A3B8] mb-5 leading-relaxed">
              This action will purge all newly recorded threat incidents (<span className="text-[#22D3EE] font-mono font-bold">{eventsGeneratedInSession} logged</span> in this session), restore original baseline signatures, and reset operational filters.
            </p>

            <div className="flex items-center justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded bg-[#111E30] hover:bg-[#1B2B42] border border-[#25364D] text-[#F1F5F9] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetSimulation();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded bg-[#FB7185] hover:bg-[#f95971] text-[#080D18] font-bold cursor-pointer transition-colors"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
