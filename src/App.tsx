import React, { useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { TopStatusBar } from './components/layout/TopStatusBar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { ThreatInvestigationPanel } from './components/inspector/ThreatInvestigationPanel';
import { CommandOverview } from './components/views/CommandOverview';
import { ThreatRadar } from './components/radar/ThreatRadar';
import { EventIntelligenceFeed } from './components/views/EventIntelligenceFeed';
import { ScamPatternAnalysis } from './components/views/ScamPatternAnalysis';
import { CitizenActivitySimulator } from './components/views/CitizenActivitySimulator';
import { ThreatAnalytics } from './components/views/ThreatAnalytics';
import { NetworkMonitor } from './components/views/NetworkMonitor';
import { SimulationControlRoom } from './components/views/SimulationControlRoom';
import { AuditLogsView } from './components/views/AuditLogsView';
import { SettingsView } from './components/views/SettingsView';
import { AdminLogin } from './components/auth/AdminLogin';

interface AppContentProps {
  onLogout: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedEvent } = useSimulation();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <CommandOverview onNavigateTo={(tab) => setActiveTab(tab)} />;
      case 'radar':
        return (
          <div className="space-y-4 sm:space-y-5 pb-8">
            <ThreatRadar compact={false} />
          </div>
        );
      case 'feed':
        return <EventIntelligenceFeed />;
      case 'patterns':
        return <ScamPatternAnalysis />;
      case 'citizen':
        return <CitizenActivitySimulator />;
      case 'analytics':
        return <ThreatAnalytics />;
      case 'network':
        return <NetworkMonitor />;
      case 'control':
        return <SimulationControlRoom />;
      case 'audit':
        return <AuditLogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CommandOverview onNavigateTo={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#080D18] text-[#F1F5F9] font-sans overflow-hidden bg-tactical-grid">
      {/* Top Fixed Tactical Bar */}
      <TopStatusBar 
        onOpenSettings={() => setActiveTab('settings')}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        onLogout={onLogout}
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Tactical Sidebar (Supports desktop collapsed and mobile slide-in drawer) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Central Analytical Workspace */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 relative">
          <div className="max-w-[1600px] mx-auto">
            {renderActiveView()}
          </div>
        </main>

        {/* Contextual Threat Investigation Drawer */}
        {selectedEvent && (
          <ThreatInvestigationPanel />
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('suraksha_intel_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('suraksha_intel_auth');
    } catch {
      // storage unavailable
    }
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <SimulationProvider>
      <AppContent onLogout={handleLogout} />
      <SpeedInsights />
    </SimulationProvider>
  );
}
