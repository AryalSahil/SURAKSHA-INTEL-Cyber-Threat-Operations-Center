import React, { useState } from 'react';
import { 
  Fingerprint, 
  Power, 
  ChevronRight, 
  Terminal, 
  X
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ScamPattern, RiskLevel } from '../../types/threat';

export const ScamPatternAnalysis: React.FC = () => {
  const { patterns, togglePattern, events, selectEvent } = useSimulation();
  const [inspectingPattern, setInspectingPattern] = useState<ScamPattern | null>(null);

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
      {/* Header and Context Notice */}
      <div className="p-3.5 sm:p-4 bg-[#111E30] border border-[#25364D] rounded space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-[#22D3EE]" />
              <span>Scam Attack Signature & Pattern Catalog</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#16243A] text-[#22D3EE] border border-[#22D3EE]/30">
                {patterns.length} Signatures Active
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Technical correlation rules and signal weights matched by the heuristic detection pipeline.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded bg-[#34D399]/10 border border-[#34D399]/30 text-[#34D399] text-xs font-mono">
            Active Signature Engine: Operational
          </div>
        </div>
      </div>

      {/* Patterns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {patterns.map((pat) => {
          const matchCount = events.filter(e => e.patternId === pat.id).length;
          return (
            <div
              key={pat.id}
              className={`p-3.5 sm:p-4 bg-[#111E30] border rounded flex flex-col justify-between transition-all select-none ${
                pat.enabled ? 'border-[#25364D] hover:border-[#22D3EE]/50' : 'border-[#25364D]/50 opacity-60'
              }`}
            >
              {/* Pattern Top Row */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#22D3EE]">
                    {pat.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${getRiskBadge(pat.configuredRisk)}`}>
                      {pat.configuredRisk}
                    </span>
                    {/* Toggle switch */}
                    <button
                      onClick={() => togglePattern(pat.id)}
                      className={`p-1.5 rounded transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center ${
                        pat.enabled 
                          ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/50' 
                          : 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/50'
                      }`}
                      title={pat.enabled ? 'Mute signature in detection engine' : 'Activate signature in detection engine'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-[#F1F5F9] leading-tight">
                    {pat.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#38BDF8] uppercase mt-0.5 block">
                    VECTOR: {pat.category}
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                  {pat.description}
                </p>

                {/* Key Trigger Signs */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">
                    Trigger Signs ({pat.contributingSigns.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pat.contributingSigns.slice(0, 2).map((sign, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0B1220] border border-[#25364D] text-[#dee2f2]">
                        {sign}
                      </span>
                    ))}
                    {pat.contributingSigns.length > 2 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-[#94A3B8]">
                        +{pat.contributingSigns.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 mt-3 border-t border-[#25364D] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Correlated Hits</span>
                  <span className="text-sm font-bold text-[#F1F5F9] tabular-nums">
                    {matchCount} hits
                  </span>
                </div>
                <button
                  onClick={() => setInspectingPattern(pat)}
                  className="px-2.5 py-1.5 rounded bg-[#0B1220] hover:bg-[#16243A] border border-[#25364D] hover:border-[#22D3EE]/40 text-[#22D3EE] text-[11px] flex items-center gap-1 transition-colors cursor-pointer min-h-[32px]"
                >
                  <span>Forensics</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pattern Detail Modal / Drawer */}
      {inspectingPattern && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#16243A] border border-[#25364D] rounded-lg max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#25364D] pb-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-[#22D3EE] shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#22D3EE]">
                      {inspectingPattern.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${getRiskBadge(inspectingPattern.configuredRisk)}`}>
                      {inspectingPattern.configuredRisk} PRIORITY
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-[#F1F5F9]">
                    {inspectingPattern.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setInspectingPattern(null)}
                className="p-1.5 rounded hover:bg-[#111E30] text-[#94A3B8] hover:text-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pattern Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#94A3B8]">
                Heuristic Vector Specification
              </label>
              <p className="text-xs text-[#dee2f2] leading-relaxed bg-[#111E30] p-3 rounded border border-[#25364D]">
                {inspectingPattern.description}
              </p>
            </div>

            {/* Contributing Signs */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-[#94A3B8]">
                Signature Warning Signs ({inspectingPattern.contributingSigns.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inspectingPattern.contributingSigns.map((sign, idx) => (
                  <div key={idx} className="p-2.5 bg-[#0B1220] rounded border border-[#25364D] text-xs text-[#dee2f2] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FB7185] shrink-0" />
                    <span>{sign}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingress Payload */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#94A3B8] flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" />
                Reference Ingress Payload
              </label>
              <div className="p-3 bg-[#080D18] rounded border border-[#25364D] font-mono text-xs text-[#22D3EE] leading-relaxed break-words">
                {inspectingPattern.examplePayload}
              </div>
            </div>

            {/* Pattern Matches in Active Dataset */}
            <div className="space-y-2 pt-2 border-t border-[#25364D]">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>CORRELATED INCIDENTS MATCHING SIGNATURE:</span>
                <span className="text-[#22D3EE]">
                  {events.filter(e => e.patternId === inspectingPattern.id).length} recorded
                </span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {events
                  .filter(e => e.patternId === inspectingPattern.id)
                  .slice(0, 4)
                  .map(evt => (
                    <div
                      key={evt.id}
                      onClick={() => {
                        selectEvent(evt);
                        setInspectingPattern(null);
                      }}
                      className="p-2 bg-[#0B1220] hover:bg-[#111E30] rounded border border-[#25364D] hover:border-[#22D3EE]/50 transition-colors cursor-pointer text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-[10px] text-[#22D3EE] font-bold block">{evt.id}</span>
                        <span className="text-[#F1F5F9] truncate block text-[11px]">{evt.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#25364D] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => togglePattern(inspectingPattern.id)}
                className={`px-3 py-2 rounded text-xs font-mono font-bold flex items-center gap-2 cursor-pointer ${
                  inspectingPattern.enabled
                    ? 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40 hover:bg-[#FB7185]/30'
                    : 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 hover:bg-[#34D399]/30'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{inspectingPattern.enabled ? 'Mute Signature in Engine' : 'Activate Signature in Engine'}</span>
              </button>

              <button
                onClick={() => setInspectingPattern(null)}
                className="px-4 py-2 rounded bg-[#111E30] hover:bg-[#1B2B42] border border-[#25364D] text-[#dee2f2] text-xs font-mono cursor-pointer"
              >
                Close Forensics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
