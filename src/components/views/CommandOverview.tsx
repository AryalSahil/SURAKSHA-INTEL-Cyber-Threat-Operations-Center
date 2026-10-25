import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Zap, 
  Server, 
  Cpu, 
  ChevronRight
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ThreatRadar } from '../radar/ThreatRadar';
import { RiskLevel, ScamCategory } from '../../types/threat';

interface CommandOverviewProps {
  onNavigateTo: (tab: any) => void;
}

export const CommandOverview: React.FC<CommandOverviewProps> = ({ onNavigateTo }) => {
  const { 
    events, 
    citizenSessions, 
    eventsGeneratedInSession, 
    selectEvent, 
    generateEvent, 
    generateBatch,
    networkNodes,
    patterns
  } = useSimulation();

  // Metrics derived from active dataset
  const totalAnalyses = events.length;
  const criticalCount = events.filter(e => e.risk === 'critical').length;
  const highCount = events.filter(e => e.risk === 'high').length;
  const mediumCount = events.filter(e => e.risk === 'medium').length;
  const lowCount = events.filter(e => e.risk === 'low').length;
  const highRiskTotal = criticalCount + highCount;

  // Category counts
  const categoryCounts: Record<ScamCategory, number> = {
    'phishing': events.filter(e => e.category === 'phishing').length,
    'fake-job': events.filter(e => e.category === 'fake-job').length,
    'upi-fraud': events.filter(e => e.category === 'upi-fraud').length,
    'fake-loan': events.filter(e => e.category === 'fake-loan').length,
    'impersonation': events.filter(e => e.category === 'impersonation').length,
    'investment': events.filter(e => e.category === 'investment').length,
    'remote-access': events.filter(e => e.category === 'remote-access').length,
  };

  const recentEvents = events.slice(0, 6);

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40';
      case 'high':
        return 'bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40';
      case 'medium':
        return 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40';
      case 'low':
        return 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-8">
      {/* Top Banner Notice */}
      <div className="p-3 bg-[#111E30] border border-[#25364D] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse shrink-0" />
          <span className="font-mono text-[#22D3EE] font-bold">OPERATIONAL POSTURE: NOMINAL</span>
          <span className="hidden sm:inline text-[#94A3B8]">·</span>
          <span className="text-[#dee2f2] truncate">
            Real-Time Cyber Threat Ingress Stream Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateBatch(5)}
            className="px-2.5 py-1.5 bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 text-[#22D3EE] border border-[#22D3EE]/40 rounded font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Trigger Surge (+5)</span>
          </button>
          <button
            onClick={() => onNavigateTo('control')}
            className="px-2.5 py-1.5 bg-[#16243A] hover:bg-[#1B2B42] text-[#dee2f2] border border-[#25364D] rounded font-mono text-[11px] flex items-center gap-1 transition-colors cursor-pointer min-h-[36px]"
          >
            <span>Console</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6 Key Operational KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3">
        {/* Total Analyses */}
        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1 font-mono">
            <span className="truncate pr-1">Total Analyses</span>
            <Activity className="w-4 h-4 text-[#22D3EE] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#F1F5F9]">
            {totalAnalyses}
          </div>
          <div className="mt-2 text-[10px] text-[#94A3B8] flex items-center justify-between font-mono">
            <span>Evaluated logs</span>
            <span className="text-[#34D399]">100%</span>
          </div>
        </div>

        {/* High & Critical Risk Flags */}
        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1 font-mono">
            <span className="truncate pr-1">High-Risk Intercepts</span>
            <ShieldAlert className="w-4 h-4 text-[#FB7185] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#FB7185]">
            {highRiskTotal}
          </div>
          <div className="mt-2 text-[10px] text-[#94A3B8] flex items-center justify-between font-mono">
            <span>{criticalCount} Critical</span>
            <span className="text-[#FB7185] font-bold">
              {totalAnalyses > 0 ? Math.round((highRiskTotal / totalAnalyses) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Medium-Risk Vectors */}
        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1 font-mono">
            <span className="truncate pr-1">Medium Caution</span>
            <AlertTriangle className="w-4 h-4 text-[#FBBF24] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#FBBF24]">
            {mediumCount}
          </div>
          <div className="mt-2 text-[10px] text-[#94A3B8] flex items-center justify-between font-mono">
            <span>In triage</span>
            <span>{totalAnalyses > 0 ? Math.round((mediumCount / totalAnalyses) * 100) : 0}%</span>
          </div>
        </div>

        {/* Low-Concern Results */}
        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1 font-mono">
            <span className="truncate pr-1">Nominal Traffic</span>
            <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#34D399]">
            {lowCount}
          </div>
          <div className="mt-2 text-[10px] text-[#94A3B8] flex items-center justify-between font-mono">
            <span>Benign verified</span>
            <span>{totalAnalyses > 0 ? Math.round((lowCount / totalAnalyses) * 100) : 0}%</span>
          </div>
        </div>

        {/* Active Citizen Sessions */}
        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1 font-mono">
            <span className="truncate pr-1">Active Sessions</span>
            <Users className="w-4 h-4 text-[#3B82F6] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#3B82F6]">
            {citizenSessions.length}
          </div>
          <div className="mt-2 text-[10px] text-[#94A3B8] flex items-center justify-between font-mono">
            <span>Telemetry streams</span>
            <span className="text-[#3B82F6]">ONLINE</span>
          </div>
        </div>

        {/* Session Ingress Events */}
        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1 font-mono">
            <span className="truncate pr-1">Session Ingress</span>
            <TrendingUp className="w-4 h-4 text-[#22D3EE] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#22D3EE]">
            +{eventsGeneratedInSession}
          </div>
          <div className="mt-2 text-[10px] text-[#94A3B8] flex items-center justify-between font-mono">
            <span>Current shift</span>
            <span className="text-[#22D3EE]">LIVE</span>
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Radar Scope & Live Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column: Cyber Threat Radar (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <ThreatRadar compact={false} />
        </div>

        {/* Right Column: Live Event Stream & Quick Triage (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Recent Event Stream Card */}
          <div className="bg-[#111E30] border border-[#25364D] rounded flex-1 flex flex-col overflow-hidden">
            <div className="p-3.5 bg-[#0B1220] border-b border-[#25364D] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#22D3EE]" />
                <h3 className="text-xs font-semibold font-mono tracking-wider text-[#F1F5F9] uppercase">
                  Recent Threat Ingress Feed
                </h3>
              </div>
              <button
                onClick={() => onNavigateTo('feed')}
                className="text-[11px] font-mono text-[#22D3EE] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Feed</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-2 divide-y divide-[#25364D]/50 overflow-y-auto max-h-[380px]">
              {recentEvents.map((evt, idx) => (
                <div
                  key={`${evt.id}-${idx}`}
                  onClick={() => selectEvent(evt)}
                  className="p-2.5 rounded hover:bg-[#16243A] transition-colors cursor-pointer group flex items-start justify-between gap-3 min-h-[44px]"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="text-[#22D3EE] font-bold group-hover:underline">
                        {evt.id}
                      </span>
                      <span className="text-[#94A3B8]">·</span>
                      <span className="text-[#94A3B8]">{evt.timestamp.slice(11, 19)} UTC</span>
                      <span className="text-[#94A3B8]">·</span>
                      <span className="text-[#38BDF8] uppercase text-[10px]">{evt.category}</span>
                    </div>

                    <p className="text-xs text-[#F1F5F9] font-medium truncate">
                      {evt.title}
                    </p>

                    <p className="text-[11px] text-[#94A3B8] line-clamp-1">
                      {evt.description}
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 ${getRiskBadge(evt.risk)}`}>
                    {evt.risk}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-[#0B1220] border-t border-[#25364D] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>Click any record to inspect forensic signals</span>
              <span className="text-[#22D3EE]">{events.length} records</span>
            </div>
          </div>

          {/* Quick Scenario Injectors */}
          <div className="p-3.5 bg-[#111E30] border border-[#25364D] rounded space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span>TACTICAL INCIDENT INJECTORS</span>
              <span className="text-[10px] text-[#22D3EE]">HEURISTIC ENGINE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => generateEvent('phishing')}
                className="p-2.5 rounded bg-[#0B1220] hover:bg-[#16243A] border border-[#25364D] hover:border-[#22D3EE]/40 text-[#F1F5F9] text-left transition-colors cursor-pointer truncate min-h-[40px]"
              >
                + Inject Phishing URL
              </button>
              <button
                onClick={() => generateEvent('impersonation')}
                className="p-2.5 rounded bg-[#0B1220] hover:bg-[#16243A] border border-[#25364D] hover:border-[#FB7185]/40 text-[#FB7185] text-left transition-colors cursor-pointer truncate min-h-[40px]"
              >
                + Inject Digital Arrest
              </button>
              <button
                onClick={() => generateEvent('upi-fraud')}
                className="p-2.5 rounded bg-[#0B1220] hover:bg-[#16243A] border border-[#25364D] hover:border-[#FBBF24]/40 text-[#FBBF24] text-left transition-colors cursor-pointer truncate min-h-[40px]"
              >
                + Inject UPI QR Fraud
              </button>
              <button
                onClick={() => generateEvent('fake-job')}
                className="p-2.5 rounded bg-[#0B1220] hover:bg-[#16243A] border border-[#25364D] hover:border-[#3B82F6]/40 text-[#3B82F6] text-left transition-colors cursor-pointer truncate min-h-[40px]"
              >
                + Inject Task Trap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Category Distribution, Service Nodes, & Signatures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Scam Category Breakdown */}
        <div className="p-4 bg-[#111E30] border border-[#25364D] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#25364D] pb-2">
            <h4 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase">
              Threat Vector Distribution
            </h4>
            <span className="text-[10px] font-mono text-[#22D3EE]">
              {Object.keys(categoryCounts).length} Vectors
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalAnalyses > 0 ? Math.round((count / totalAnalyses) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#dee2f2] capitalize">{cat.replace('-', ' ')}</span>
                    <span className="text-[#94A3B8]">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0B1220] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#22D3EE] rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Operations Nodes */}
        <div className="p-4 bg-[#111E30] border border-[#25364D] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#25364D] pb-2">
            <h4 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Security Operations Nodes</span>
            </h4>
            <span className="text-[10px] font-mono text-[#34D399]">ACTIVE</span>
          </div>

          <div className="space-y-2">
            {networkNodes.map(node => (
              <div 
                key={node.id}
                onClick={() => onNavigateTo('network')}
                className="p-2 bg-[#0B1220] hover:bg-[#16243A] border border-[#25364D] rounded text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <span className="font-mono text-[#F1F5F9] font-medium block">{node.shortLabel}</span>
                  <span className="text-[10px] text-[#94A3B8] font-mono">{node.status}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  node.statusType === 'active' 
                    ? 'text-[#34D399] bg-[#34D399]/10' 
                    : node.statusType === 'disconnected'
                    ? 'text-[#FB7185] bg-[#FB7185]/10'
                    : 'text-[#FBBF24] bg-[#FBBF24]/10'
                }`}>
                  {node.statusType === 'disconnected' ? 'ISOLATED' : `${node.pingMs}ms`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Threat Signatures */}
        <div className="p-4 bg-[#111E30] border border-[#25364D] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#25364D] pb-2">
            <h4 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Active Threat Signatures</span>
            </h4>
            <button
              onClick={() => onNavigateTo('patterns')}
              className="text-[10px] font-mono text-[#22D3EE] hover:underline cursor-pointer"
            >
              Configure
            </button>
          </div>

          <div className="space-y-2">
            {patterns.slice(0, 5).map(pattern => {
              const matchCount = events.filter(e => e.patternId === pattern.id).length;
              return (
                <div 
                  key={pattern.id}
                  onClick={() => onNavigateTo('patterns')}
                  className="p-2 bg-[#0B1220] hover:bg-[#16243A] border border-[#25364D] rounded text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <span className="font-mono text-[11px] text-[#22D3EE] font-bold block">{pattern.id}</span>
                    <span className="text-[#F1F5F9] text-[11px] truncate block">{pattern.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-[#94A3B8] font-bold block">{matchCount} hits</span>
                    <span className={`text-[9px] font-mono uppercase ${pattern.enabled ? 'text-[#34D399]' : 'text-[#FB7185]'}`}>
                      {pattern.enabled ? 'ACTIVE' : 'MUTED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
