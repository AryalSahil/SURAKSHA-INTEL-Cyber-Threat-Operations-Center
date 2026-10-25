import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Server, ChevronDown, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export type StatusLevel = 'ok' | 'warning' | 'critical';

export const getStatusLevel = (percentage: number): StatusLevel => {
  if (percentage >= 85) return 'critical';
  if (percentage >= 60) return 'warning';
  return 'ok';
};

export const getStatusColorClasses = (level: StatusLevel) => {
  switch (level) {
    case 'critical':
      return {
        text: 'text-[#FB7185]',
        bg: 'bg-[#FB7185]/15',
        border: 'border-[#FB7185]/40',
        badge: 'bg-[#FB7185]',
        fill: '#FB7185',
        label: 'Critical'
      };
    case 'warning':
      return {
        text: 'text-[#FBBF24]',
        bg: 'bg-[#FBBF24]/15',
        border: 'border-[#FBBF24]/40',
        badge: 'bg-[#FBBF24]',
        fill: '#FBBF24',
        label: 'Warning'
      };
    case 'ok':
    default:
      return {
        text: 'text-[#34D399]',
        bg: 'bg-[#34D399]/15',
        border: 'border-[#34D399]/40',
        badge: 'bg-[#34D399]',
        fill: '#34D399',
        label: 'OK'
      };
  }
};

interface SystemStatusProps {
  className?: string;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ className = '' }) => {
  const [cpuUsage, setCpuUsage] = useState(38);
  const [memoryUsage, setMemoryUsage] = useState(54);
  const [cores, setCores] = useState([35, 42, 38, 37]);
  const [showDetails, setShowDetails] = useState(false);

  // Dynamic real-time fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      // Natural jitter for CPU between 22% and 88%
      setCpuUsage(prev => {
        const delta = (Math.random() - 0.48) * 8;
        const next = Math.min(Math.max(Math.round(prev + delta), 22), 92);
        return next;
      });

      // Memory fluctuates more gradually between 45% and 78%
      setMemoryUsage(prev => {
        const delta = (Math.random() - 0.49) * 3;
        const next = Math.min(Math.max(Math.round(prev + delta), 42), 82);
        return next;
      });

      // Fluctuate 4 logical cores
      setCores(prev => prev.map(core => {
        const delta = (Math.random() - 0.48) * 12;
        return Math.min(Math.max(Math.round(core + delta), 15), 95);
      }));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const cpuLevel = getStatusLevel(cpuUsage);
  const memLevel = getStatusLevel(memoryUsage);
  const overallLevel = cpuLevel === 'critical' || memLevel === 'critical' 
    ? 'critical' 
    : cpuLevel === 'warning' || memLevel === 'warning' 
    ? 'warning' 
    : 'ok';

  const cpuColors = getStatusColorClasses(cpuLevel);
  const memColors = getStatusColorClasses(memLevel);
  const overallColors = getStatusColorClasses(overallLevel);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button / Compact Bar */}
      <button
        onClick={() => setShowDetails(prev => !prev)}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 bg-[#111E30] hover:bg-[#16243A] border border-[#25364D] hover:border-[#22D3EE]/40 rounded font-mono text-xs transition-all cursor-pointer min-h-[34px]"
        title="View Real-Time System Status (CPU & Memory)"
        aria-label="System status telemetry"
      >
        {/* Pulsing Overall Health Indicator */}
        <span className="relative flex h-2 w-2">
          <span 
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${overallColors.badge}`} 
          />
          <span 
            className={`relative inline-flex rounded-full h-2 w-2 ${overallColors.badge}`} 
          />
        </span>

        {/* CPU Telemetry Item */}
        <div className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="hidden xs:inline text-[10px] text-[#94A3B8]">CPU</span>
          <span className={`text-[11px] font-bold ${cpuColors.text}`}>
            {cpuUsage}%
          </span>
          {/* Mini Status Dot */}
          <span 
            className={`w-1.5 h-1.5 rounded-full ${cpuColors.badge}`}
            title={`CPU: ${cpuColors.label} (${cpuUsage}%)`}
          />
        </div>

        <span className="text-[#25364D]">|</span>

        {/* Memory Telemetry Item */}
        <div className="flex items-center gap-1">
          <HardDrive className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="hidden xs:inline text-[10px] text-[#94A3B8]">MEM</span>
          <span className={`text-[11px] font-bold ${memColors.text}`}>
            {memoryUsage}%
          </span>
          {/* Mini Status Dot */}
          <span 
            className={`w-1.5 h-1.5 rounded-full ${memColors.badge}`}
            title={`Memory: ${memColors.label} (${memoryUsage}%)`}
          />
        </div>

        <ChevronDown className={`w-3 h-3 text-[#94A3B8] transition-transform ${showDetails ? 'rotate-180 text-[#22D3EE]' : ''}`} />
      </button>

      {/* Detailed Diagnostics Popover */}
      {showDetails && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDetails(false)} 
            aria-hidden="true" 
          />

          <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-[#16243A] border border-[#25364D] rounded-lg shadow-2xl p-4 z-50 font-mono text-xs text-[#F1F5F9] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#25364D] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#22D3EE]" />
                <span className="font-bold text-xs tracking-wider uppercase text-[#F1F5F9]">
                  System Status & Load
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${overallColors.bg} ${overallColors.text} border ${overallColors.border}`}>
                {overallColors.label}
              </span>
            </div>

            {/* CPU Detailed View */}
            <div className="space-y-2 mb-3.5 p-2.5 bg-[#0B1220] rounded border border-[#25364D]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-[#dee2f2]">
                  <Cpu className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>CPU Usage (SOC Cluster)</span>
                </span>
                <span className={`font-bold ${cpuColors.text}`}>
                  {cpuUsage}% · {cpuColors.label}
                </span>
              </div>

              {/* Progress Bar with Color Coding */}
              <div className="w-full bg-[#16243A] rounded-full h-2 overflow-hidden border border-[#25364D]">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${cpuColors.badge}`}
                  style={{ width: `${cpuUsage}%` }}
                />
              </div>

              {/* 4 Logical Core Activity */}
              <div className="pt-1.5 grid grid-cols-4 gap-1.5 text-[10px] text-[#94A3B8]">
                {cores.map((c, idx) => {
                  const coreLevel = getStatusLevel(c);
                  const coreColors = getStatusColorClasses(coreLevel);
                  return (
                    <div key={idx} className="bg-[#111E30] p-1 rounded border border-[#25364D] text-center">
                      <span className="block text-[9px] text-[#94A3B8]/80">C{idx}</span>
                      <span className={`font-bold ${coreColors.text}`}>{c}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Memory Detailed View */}
            <div className="space-y-2 mb-3.5 p-2.5 bg-[#0B1220] rounded border border-[#25364D]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-[#dee2f2]">
                  <HardDrive className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Memory Usage</span>
                </span>
                <span className={`font-bold ${memColors.text}`}>
                  {memoryUsage}% · {memColors.label}
                </span>
              </div>

              {/* Progress Bar with Color Coding */}
              <div className="w-full bg-[#16243A] rounded-full h-2 overflow-hidden border border-[#25364D]">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${memColors.badge}`}
                  style={{ width: `${memoryUsage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pt-1">
                <span>Allocated: {((8 * memoryUsage) / 100).toFixed(2)} GB</span>
                <span>Total Pool: 8.00 GB</span>
              </div>
            </div>

            {/* Color Indicator Legend */}
            <div className="pt-2 border-t border-[#25364D] flex items-center justify-between text-[10px] text-[#94A3B8]">
              <span className="text-[#94A3B8]/70">Thresholds:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#34D399]">
                  <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                  <span>&lt;60% OK</span>
                </span>
                <span className="flex items-center gap-1 text-[#FBBF24]">
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                  <span>60-84% Warn</span>
                </span>
                <span className="flex items-center gap-1 text-[#FB7185]">
                  <span className="w-2 h-2 rounded-full bg-[#FB7185]" />
                  <span>≥85% Crit</span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
