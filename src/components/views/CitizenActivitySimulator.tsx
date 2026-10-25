import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  BookOpen, 
  FileCode, 
  LifeBuoy, 
  HelpCircle,
  Clock,
  Sparkles,
  Activity
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { CitizenSession, RiskLevel } from '../../types/threat';

export const CitizenActivitySimulator: React.FC = () => {
  const { citizenSessions } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredSessions = useMemo(() => {
    return citizenSessions.filter(session => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = session.id.toLowerCase().includes(query);
        const matchesDetails = session.details.toLowerCase().includes(query);
        const matchesGuidance = session.citizenGuidance.toLowerCase().includes(query);
        if (!matchesId && !matchesDetails && !matchesGuidance) return false;
      }

      if (actionFilter !== 'all' && session.actionType !== actionFilter) {
        return false;
      }

      if (riskFilter !== 'all' && session.riskReturned !== riskFilter) {
        return false;
      }

      return true;
    });
  }, [citizenSessions, searchTerm, actionFilter, riskFilter]);

  const getActionIcon = (action: CitizenSession['actionType']) => {
    switch (action) {
      case 'Suspicious Message Scan':
        return <HelpCircle className="w-4 h-4 text-[#22D3EE]" />;
      case 'URL Security Verification':
        return <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />;
      case 'Scam Awareness Lesson':
        return <BookOpen className="w-4 h-4 text-[#34D399]" />;
      case 'Interactive Threat Drill':
        return <Sparkles className="w-4 h-4 text-[#A78BFA]" />;
      case 'Reporting Guidance Opened':
        return <LifeBuoy className="w-4 h-4 text-[#FBBF24]" />;
      case 'APK Permission Audit':
        return <FileCode className="w-4 h-4 text-[#FB7185]" />;
    }
  };

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
    <div className="space-y-4 pb-8">
      {/* Telemetry Operational Summary Banner */}
      <div className="p-3.5 bg-[#16243A] border border-[#22D3EE]/30 rounded flex items-start gap-3">
        <Activity className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <h4 className="font-semibold text-[#F1F5F9] font-mono">
            CITIZEN SAFETY DEFENSE TELEMETRY
          </h4>
          <p className="text-[#94A3B8] leading-relaxed">
            Real-time feed of citizen safety interactions, including automated SMS/WhatsApp message scans, URL security audits, defensive educational drills, and rapid reporting guidance to national helpline 1930.
          </p>
        </div>
      </div>

      {/* Control Strip */}
      <div className="p-3.5 sm:p-4 bg-[#111E30] border border-[#25364D] rounded space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#22D3EE]" />
              <span>Citizen Safety Telemetry Monitor</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#16243A] text-[#22D3EE] border border-[#22D3EE]/30">
                {filteredSessions.length} Active Feeds
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Live citizen cyber-safety verification streams and guidance delivery logs.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#25364D]">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#22D3EE] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search session ID, guidance..."
              className="w-full bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] rounded pl-8 pr-3 py-2 text-xs text-[#F1F5F9] outline-none font-mono placeholder:text-[#94A3B8]/50 min-h-[36px]"
            />
          </div>

          {/* Action Type Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] text-[#dee2f2] text-xs font-mono rounded px-2.5 py-2 outline-none cursor-pointer min-h-[36px]"
          >
            <option value="all">All Defensive Actions</option>
            <option value="Suspicious Message Scan">Suspicious Message Scan</option>
            <option value="URL Security Verification">URL Security Verification</option>
            <option value="Scam Awareness Lesson">Scam Awareness Lesson</option>
            <option value="Interactive Threat Drill">Interactive Threat Drill</option>
            <option value="Reporting Guidance Opened">Reporting Guidance Opened</option>
            <option value="APK Permission Audit">APK Permission Audit</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] text-[#dee2f2] text-xs font-mono rounded px-2.5 py-2 outline-none cursor-pointer min-h-[36px]"
          >
            <option value="all">All Assessment Results</option>
            <option value="critical">Critical Risk Returned</option>
            <option value="high">High Risk Returned</option>
            <option value="medium">Medium Concern</option>
            <option value="low">Low / Safe Completed</option>
          </select>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredSessions.map((session, idx) => (
          <div
            key={`${session.id}-${idx}`}
            className="p-3.5 sm:p-4 bg-[#111E30] border border-[#25364D] hover:border-[#22D3EE]/40 rounded space-y-3 transition-colors select-none flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#22D3EE]">
                  {session.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${getRiskBadge(session.riskReturned)}`}>
                  {session.riskReturned}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#F1F5F9]">
                {getActionIcon(session.actionType)}
                <span>{session.actionType}</span>
              </div>

              <div className="p-2 bg-[#0B1220] rounded border border-[#25364D] text-xs text-[#dee2f2] leading-relaxed">
                {session.details}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#22D3EE] block">
                  Delivered Guidance / Outcome:
                </span>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {session.citizenGuidance}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#25364D] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#94A3B8]" />
                {session.timestamp.slice(11, 19)} UTC
              </span>
              <span className="text-[#34D399] font-medium">
                {session.sessionStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
