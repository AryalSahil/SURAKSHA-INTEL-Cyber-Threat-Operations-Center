import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  Activity, 
  Fingerprint, 
  Users, 
  BarChart3, 
  Network, 
  Sliders, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export type ActiveTab = 
  | 'overview' 
  | 'radar' 
  | 'feed' 
  | 'patterns' 
  | 'citizen' 
  | 'analytics' 
  | 'network' 
  | 'control' 
  | 'audit' 
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { events, patterns, citizenSessions } = useSimulation();

  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Command Overview', icon: LayoutDashboard },
    { 
      id: 'radar' as ActiveTab, 
      label: 'Threat Radar', 
      icon: Radio,
      badge: 'LIVE',
      badgeColor: 'text-[#22D3EE] bg-[#22D3EE]/10'
    },
    { 
      id: 'feed' as ActiveTab, 
      label: 'Event Intelligence', 
      icon: Activity,
      count: events.length
    },
    { 
      id: 'patterns' as ActiveTab, 
      label: 'Scam Pattern Analysis', 
      icon: Fingerprint,
      count: patterns.length
    },
    { 
      id: 'citizen' as ActiveTab, 
      label: 'Citizen Safety Telemetry', 
      icon: Users,
      count: citizenSessions.length
    },
    { id: 'analytics' as ActiveTab, label: 'Threat Analytics', icon: BarChart3 },
    { id: 'network' as ActiveTab, label: 'Network Monitor', icon: Network },
    { 
      id: 'control' as ActiveTab, 
      label: 'Operations Control Console', 
      icon: Sliders,
      highlight: true
    },
    { id: 'audit' as ActiveTab, label: 'Audit & Operations Logs', icon: FileText },
    { id: 'settings' as ActiveTab, label: 'Settings & System Briefing', icon: Settings },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`bg-[#0B1220] border-r border-[#25364D] flex flex-col justify-between transition-all duration-200 select-none shrink-0 z-40 ${
          // Mobile: slide in drawer
          mobileOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl flex'
            : 'hidden md:flex'
        } ${collapsed && !mobileOpen ? 'md:w-16' : 'md:w-64'}`}
      >
        {/* Navigation List */}
        <div className="py-3 px-2 flex-1 overflow-y-auto space-y-1">
          <div className="px-2 pb-2 mb-1 border-b border-[#25364D]/60 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
              {collapsed && !mobileOpen ? 'Nav' : 'Tactical Navigation'}
            </span>

            {/* Close button on mobile */}
            {mobileOpen && (
              <button
                onClick={onCloseMobile}
                className="p-1 text-[#94A3B8] hover:text-[#F1F5F9] md:hidden cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Desktop collapse button */}
            {!mobileOpen && (
              <button
                onClick={onToggleCollapse}
                className="hidden md:flex p-1 rounded text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111E30] transition-colors ml-auto cursor-pointer"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showFull = !collapsed || mobileOpen;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                title={!showFull ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 md:py-2 rounded text-xs font-medium transition-all cursor-pointer relative min-h-[40px] ${
                  isActive
                    ? 'bg-[#111E30] text-[#22D3EE] shadow-inner font-semibold'
                    : 'text-[#94A3B8] hover:bg-[#111E30]/60 hover:text-[#F1F5F9]'
                } ${item.highlight && !isActive ? 'text-[#38BDF8]' : ''}`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#22D3EE] rounded-r" />
                )}

                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#22D3EE]' : item.highlight ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />

                {showFull && (
                  <div className="flex-1 flex items-center justify-between text-left truncate">
                    <span className="truncate">{item.label}</span>

                    {item.badge && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}

                    {typeof item.count === 'number' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#16243A] text-[#94A3B8]">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Branding & Integrity Tagline */}
        <div className="p-3 border-t border-[#25364D] bg-[#090E19]">
          {!collapsed || mobileOpen ? (
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#22D3EE] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SURAKSHA INTEL</span>
              </div>
              <p className="text-[10px] font-mono text-[#94A3B8]">
                “Observe. Analyse. Protect.”
              </p>
              <div className="pt-1 text-[9px] font-mono text-[#34D399]">
                LIVE THREAT OPERATIONS
              </div>
            </div>
          ) : (
            <div className="flex justify-center text-[#22D3EE]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
