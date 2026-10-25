import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ShieldAlert, 
  Cpu, 
  LifeBuoy, 
  Hash, 
  Calendar,
  Terminal
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskLevel } from '../../types/threat';

export const ThreatInvestigationPanel: React.FC = () => {
  const { selectedEvent, selectEvent, events } = useSimulation();
  const [copied, setCopied] = useState(false);

  if (!selectedEvent) return null;

  const handleCopySummary = () => {
    const text = `SURAKSHA INTEL THREAT REPORT
Event ID: ${selectedEvent.id}
Timestamp: ${selectedEvent.timestamp}
Category: ${selectedEvent.category.toUpperCase()}
Risk: ${selectedEvent.risk.toUpperCase()}
Pattern: ${selectedEvent.patternId} (${selectedEvent.patternName})
Title: ${selectedEvent.title}
Description: ${selectedEvent.description}
Safety Action: ${selectedEvent.citizenSafetyAction}
Source: ${selectedEvent.source}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return 'bg-[#FB7185]/15 text-[#FB7185] border border-[#FB7185]/40';
      case 'high':
        return 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/40';
      case 'medium':
        return 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/40';
      case 'low':
        return 'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/40';
    }
  };

  // Find other events in same category for related events section
  const relatedEvents = events
    .filter(e => e.id !== selectedEvent.id && e.category === selectedEvent.category)
    .slice(0, 3);

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        onClick={() => selectEvent(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden"
        aria-hidden="true"
      />

      <aside className="fixed inset-y-0 right-0 w-full sm:w-96 max-w-full bg-[#111E30] border-l border-[#25364D] flex flex-col h-full shadow-2xl z-50 sm:z-30 select-none animate-in slide-in-from-right duration-200">
        {/* Header Bar */}
        <div className="h-14 bg-[#0B1220] border-b border-[#25364D] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#22D3EE]" />
            <h2 className="text-xs font-semibold font-mono tracking-wider text-[#F1F5F9] uppercase">
              Threat Investigation
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="p-1.5 px-2 rounded hover:bg-[#16243A] text-[#94A3B8] hover:text-[#22D3EE] transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono min-h-[36px]"
              title="Copy event telemetry"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#34D399]" />
                  <span className="text-[10px] text-[#34D399]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>
            <button
              onClick={() => selectEvent(null)}
              className="p-1.5 rounded hover:bg-[#16243A] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Close investigation drawer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Event Header Banner */}
          <div className="p-3 bg-[#16243A] rounded border border-[#25364D] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#22D3EE] flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {selectedEvent.id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${getRiskBadge(selectedEvent.risk)}`}>
                {selectedEvent.risk} PRIORITY
              </span>
            </div>

            <h3 className="text-sm font-semibold text-[#F1F5F9] leading-snug">
              {selectedEvent.title}
            </h3>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#94A3B8]">
              <Calendar className="w-3 h-3 text-[#94A3B8]" />
              <span>{new Date(selectedEvent.timestamp).toUTCString()}</span>
            </div>
          </div>

          {/* Source & Pattern Lockup */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block">
              Correlated Attack Signature
            </label>
            <div className="p-2.5 bg-[#0B1220] rounded border border-[#25364D] flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#F1F5F9]">
                  <span>{selectedEvent.patternId}</span>
                  <span className="text-[10px] text-[#22D3EE] font-normal uppercase">
                    {selectedEvent.category}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {selectedEvent.patternName}
                </p>
              </div>
            </div>
          </div>

          {/* Matched Warning Signs */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block">
              Extracted Heuristic Triggers ({selectedEvent.matchedSignals.length})
            </label>
            <div className="space-y-1.5">
              {selectedEvent.matchedSignals.map((signal, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-[#0B1220] rounded border border-[#25364D] text-xs text-[#dee2f2]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FB7185] shrink-0" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block">
              Heuristic Detection Telemetry
            </label>
            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D] text-xs text-[#dee2f2] leading-relaxed">
              {selectedEvent.description}
            </div>
          </div>

          {/* Raw Ingress Payload */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1">
              <Terminal className="w-3 h-3 text-[#22D3EE]" />
              Raw Ingress Sample
            </label>
            <div className="p-3 bg-[#080D18] rounded border border-[#25364D] font-mono text-[11px] text-[#22D3EE] leading-relaxed break-words">
              {selectedEvent.rawSample}
            </div>
          </div>

          {/* Recommended Citizen Safety Action */}
          <div className="p-3 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE]">
              <LifeBuoy className="w-4 h-4 text-[#22D3EE]" />
              <span>Prescribed Citizen Countermeasure</span>
            </div>
            <p className="text-xs text-[#F1F5F9] leading-relaxed">
              {selectedEvent.citizenSafetyAction}
            </p>
            <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-[#94A3B8]">
              <span>National Cybercrime Toll-Free: <strong>1930</strong></span>
              <span>·</span>
              <span>cybercrime.gov.in</span>
            </div>
          </div>

          {/* Forensic Metadata Grid */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block">
              Forensic Telemetry Metrics
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-[#0B1220] rounded border border-[#25364D]">
                <span className="text-[10px] text-[#94A3B8] block">Vector Confidence</span>
                <span className="text-[#34D399] font-bold text-sm">
                  {(selectedEvent.forensicDetails.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>

              <div className="p-2 bg-[#0B1220] rounded border border-[#25364D]">
                <span className="text-[10px] text-[#94A3B8] block">Urgency Pressure</span>
                <span className="text-[#FBBF24] font-bold truncate block">
                  {selectedEvent.forensicDetails.urgencyIndicator}
                </span>
              </div>

              <div className="p-2 bg-[#0B1220] rounded border border-[#25364D] col-span-2">
                <span className="text-[10px] text-[#94A3B8] block">Origin Ingress Channel</span>
                <span className="text-[#dee2f2]">
                  {selectedEvent.forensicDetails.originChannel}
                </span>
              </div>
            </div>
          </div>

          {/* Related Threat Incidents */}
          {relatedEvents.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#25364D]">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block">
                Related Incidents ({selectedEvent.category})
              </label>
              <div className="space-y-1.5">
                {relatedEvents.map((rel, idx) => (
                  <div
                    key={`${rel.id}-${idx}`}
                    onClick={() => selectEvent(rel)}
                    className="p-2 bg-[#0B1220] hover:bg-[#16243A] rounded border border-[#25364D] hover:border-[#22D3EE]/40 transition-colors cursor-pointer text-xs flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="font-mono text-[10px] text-[#22D3EE] block">{rel.id}</span>
                      <span className="text-[#F1F5F9] truncate block text-[11px]">{rel.title}</span>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${getRiskBadge(rel.risk)}`}>
                      {rel.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Badge */}
          <div className="p-2.5 bg-[#090E19] rounded border border-[#25364D] text-[10px] font-mono text-[#94A3B8] space-y-1">
            <div className="flex items-center justify-between text-[#22D3EE]">
              <span>TELEMETRY SOURCE:</span>
              <span>{selectedEvent.source}</span>
            </div>
            <p className="text-[#94A3B8]/70">
              Bearing: {selectedEvent.radarCoords.angle}° / Range {Math.round(selectedEvent.radarCoords.distance * 100)}%
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
