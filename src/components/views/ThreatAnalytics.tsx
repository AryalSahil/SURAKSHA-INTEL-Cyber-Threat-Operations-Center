import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldAlert, 
  Cpu, 
  Activity,
  Zap
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ScamCategory } from '../../types/threat';

export const ThreatAnalytics: React.FC = () => {
  const { events, patterns, eventsGeneratedInSession } = useSimulation();
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const totalEvents = events.length;

  // 1. Risk breakdown
  const riskCounts = useMemo(() => {
    return {
      critical: events.filter(e => e.risk === 'critical').length,
      high: events.filter(e => e.risk === 'high').length,
      medium: events.filter(e => e.risk === 'medium').length,
      low: events.filter(e => e.risk === 'low').length,
    };
  }, [events]);

  // 2. Category distribution
  const categoryStats = useMemo(() => {
    const categories: ScamCategory[] = [
      'phishing',
      'fake-job',
      'upi-fraud',
      'fake-loan',
      'impersonation',
      'investment',
      'remote-access'
    ];
    return categories.map(cat => {
      const count = events.filter(e => e.category === cat).length;
      const pct = totalEvents > 0 ? (count / totalEvents) * 100 : 0;
      return {
        category: cat,
        label: cat.replace('-', ' '),
        count,
        pct: Number(pct.toFixed(1)),
      };
    }).sort((a, b) => b.count - a.count);
  }, [events, totalEvents]);

  // Colors for donut chart
  const categoryColors: Record<string, string> = {
    'phishing': '#22D3EE',
    'fake-job': '#3B82F6',
    'upi-fraud': '#FBBF24',
    'fake-loan': '#F59E0B',
    'impersonation': '#FB7185',
    'investment': '#A78BFA',
    'remote-access': '#F43F5E',
  };

  // 3. Pattern frequency ranking
  const patternRanking = useMemo(() => {
    return patterns.map(pat => {
      const count = events.filter(e => e.patternId === pat.id).length;
      const pct = totalEvents > 0 ? (count / totalEvents) * 100 : 0;
      return {
        id: pat.id,
        name: pat.name,
        category: pat.category,
        count,
        pct: Number(pct.toFixed(1)),
      };
    }).sort((a, b) => b.count - a.count);
  }, [patterns, events, totalEvents]);

  // 4. Hourly timeline distribution (last 12 hours)
  const hourlyData = useMemo(() => {
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 'Now'];
    return hours.map((hour, idx) => {
      const weight = [0.04, 0.06, 0.09, 0.12, 0.14, 0.08, 0.07, 0.11, 0.13, 0.08, 0.05, 0.03][idx];
      const value = Math.max(1, Math.round(totalEvents * weight));
      return { hour, value };
    });
  }, [totalEvents]);

  // Compute SVG Donut Chart Paths
  const donutSize = 220;
  const radius = 80;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 select-none">
      {/* Header Strip */}
      <div className="p-3.5 sm:p-4 bg-[#111E30] border border-[#25364D] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#22D3EE]" />
            <span>Threat Intelligence Analytics & Vector Distribution</span>
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            Operational analytics computed from live incoming threat intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-[#0B1220] border border-[#25364D] text-[#22D3EE]">
            Dataset: {totalEvents} Records
          </span>
          <span className="px-2.5 py-1 rounded bg-[#0B1220] border border-[#25364D] text-[#34D399]">
            Session Ingress: +{eventsGeneratedInSession}
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono mb-1">
            <span className="truncate pr-1">Critical Ratio</span>
            <ShieldAlert className="w-4 h-4 text-[#FB7185] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#FB7185] tabular-nums">
            {totalEvents > 0 ? ((riskCounts.critical / totalEvents) * 100).toFixed(1) : 0}%
          </div>
          <p className="text-[10px] text-[#94A3B8] font-mono mt-1">
            {riskCounts.critical} required active containment
          </p>
        </div>

        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono mb-1">
            <span className="truncate pr-1">High-Priority</span>
            <TrendingUp className="w-4 h-4 text-[#FBBF24] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#FBBF24] tabular-nums">
            {totalEvents > 0 ? (((riskCounts.critical + riskCounts.high) / totalEvents) * 100).toFixed(1) : 0}%
          </div>
          <p className="text-[10px] text-[#94A3B8] font-mono mt-1">
            {riskCounts.critical + riskCounts.high} elevated threats
          </p>
        </div>

        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono mb-1">
            <span className="truncate pr-1">Avg Confidence</span>
            <Zap className="w-4 h-4 text-[#22D3EE] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#22D3EE] tabular-nums">
            94.8%
          </div>
          <p className="text-[10px] text-[#94A3B8] font-mono mt-1">
            Deterministic trigger correlation score
          </p>
        </div>

        <div className="p-3 sm:p-3.5 bg-[#111E30] border border-[#25364D] rounded">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono mb-1">
            <span className="truncate pr-1">Active Signatures</span>
            <Cpu className="w-4 h-4 text-[#34D399] shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#34D399] tabular-nums">
            {patterns.filter(p => p.enabled).length} / {patterns.length}
          </div>
          <p className="text-[10px] text-[#94A3B8] font-mono mt-1">
            Signatures engaged in heuristic engine
          </p>
        </div>
      </div>

      {/* Row: Donut Chart & Risk Classification Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left: Interactive Donut Chart (7 Cols) */}
        <div className="lg:col-span-7 p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-4">
          <div className="flex items-center justify-between border-b border-[#25364D] pb-3">
            <h3 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#22D3EE]" />
              <span>Threat Vector Distribution</span>
            </h3>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              Percentage Breakdown
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* SVG Donut Visualizer */}
            <div className="relative flex items-center justify-center">
              <svg width={donutSize} height={donutSize} className="rotate-[-90deg]">
                <circle
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={radius}
                  fill="none"
                  stroke="#0B1220"
                  strokeWidth={strokeWidth}
                />

                {categoryStats.map((item) => {
                  if (item.count === 0) return null;
                  const dashLength = (item.pct / 100) * circumference;
                  const dashOffset = (accumulatedAngle / 100) * circumference;
                  accumulatedAngle += item.pct;
                  const color = categoryColors[item.category] || '#22D3EE';
                  const isHovered = hoveredSlice === item.category;

                  return (
                    <circle
                      key={item.category}
                      cx={donutSize / 2}
                      cy={donutSize / 2}
                      r={radius}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={-dashOffset}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice(item.category)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute text-center">
                <span className="text-xs font-mono text-[#94A3B8] block">TOTAL</span>
                <span className="text-2xl font-bold font-mono text-[#F1F5F9] tabular-nums block">
                  {totalEvents}
                </span>
                <span className="text-[10px] font-mono text-[#22D3EE] block">Events</span>
              </div>
            </div>

            {/* Category Legend & Counts */}
            <div className="space-y-2 text-xs font-mono w-full sm:w-56">
              {categoryStats.map((item) => {
                const color = categoryColors[item.category] || '#22D3EE';
                const isHovered = hoveredSlice === item.category;

                return (
                  <div
                    key={item.category}
                    onMouseEnter={() => setHoveredSlice(item.category)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-1.5 rounded flex items-center justify-between cursor-pointer transition-colors ${
                      isHovered ? 'bg-[#16243A]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-[#dee2f2] truncate capitalize">{item.label}</span>
                    </div>
                    <span className="text-[#94A3B8] tabular-nums font-bold shrink-0">
                      {item.count} ({item.pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Risk Classification Priority Matrix (5 Cols) */}
        <div className="lg:col-span-5 p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-4">
          <div className="flex items-center justify-between border-b border-[#25364D] pb-3">
            <h3 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FB7185]" />
              <span>Risk Classification Distribution</span>
            </h3>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              Heuristic Severity
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Critical */}
            <div className="p-3 bg-[#0B1220] rounded border border-[#FB7185]/30 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#FB7185] font-bold">CRITICAL PRIORITY</span>
                <span className="text-[#FB7185] font-bold">{riskCounts.critical} ({totalEvents > 0 ? Math.round((riskCounts.critical / totalEvents) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-[#16243A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FB7185] rounded-full"
                  style={{ width: `${totalEvents > 0 ? (riskCounts.critical / totalEvents) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[10px] text-[#94A3B8] block">Active extortion, digital arrest, or remote device control</span>
            </div>

            {/* High */}
            <div className="p-3 bg-[#0B1220] rounded border border-[#FBBF24]/30 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#FBBF24] font-bold">HIGH RISK</span>
                <span className="text-[#FBBF24] font-bold">{riskCounts.high} ({totalEvents > 0 ? Math.round((riskCounts.high / totalEvents) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-[#16243A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FBBF24] rounded-full"
                  style={{ width: `${totalEvents > 0 ? (riskCounts.high / totalEvents) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[10px] text-[#94A3B8] block">Advance fee fraud, UPI QR traps, credential exfiltration</span>
            </div>

            {/* Medium */}
            <div className="p-3 bg-[#0B1220] rounded border border-[#3B82F6]/30 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#3B82F6] font-bold">MEDIUM CAUTION</span>
                <span className="text-[#3B82F6] font-bold">{riskCounts.medium} ({totalEvents > 0 ? Math.round((riskCounts.medium / totalEvents) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-[#16243A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3B82F6] rounded-full"
                  style={{ width: `${totalEvents > 0 ? (riskCounts.medium / totalEvents) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[10px] text-[#94A3B8] block">Investment speculation funnels, aggressive telemarketing</span>
            </div>

            {/* Low */}
            <div className="p-3 bg-[#0B1220] rounded border border-[#34D399]/30 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#34D399] font-bold">LOW CONCERN / NOMINAL</span>
                <span className="text-[#34D399] font-bold">{riskCounts.low} ({totalEvents > 0 ? Math.round((riskCounts.low / totalEvents) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-[#16243A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#34D399] rounded-full"
                  style={{ width: `${totalEvents > 0 ? (riskCounts.low / totalEvents) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[10px] text-[#94A3B8] block">Benign marketing, routine promotional ingress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Analysis Volume Timeline & Top Signatures Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Analysis Volume Over Time Area Chart (6 Cols) */}
        <div className="lg:col-span-6 p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-4">
          <div className="flex items-center justify-between border-b border-[#25364D] pb-3">
            <h3 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#22D3EE]" />
              <span>Ingress Velocity (12-Hour Trend)</span>
            </h3>
            <span className="text-[10px] font-mono text-[#34D399]">
              NOMINAL PACE
            </span>
          </div>

          {/* Area Chart */}
          <div className="py-2">
            <div className="h-44 w-full relative flex items-end justify-between gap-1 pt-6 pb-6 border-b border-[#25364D]">
              {hourlyData.map((d, i) => {
                const maxVal = Math.max(...hourlyData.map(h => h.value), 1);
                const heightPct = (d.value / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[9px] font-mono text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      {d.value}
                    </span>
                    <div 
                      className="w-full bg-[#22D3EE]/30 group-hover:bg-[#22D3EE] border-t border-[#22D3EE] rounded-t transition-all duration-150"
                      style={{ height: `${Math.max(heightPct, 6)}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] pt-2">
              <span>08:00 UTC</span>
              <span>12:00 UTC</span>
              <span>16:00 UTC</span>
              <span className="text-[#22D3EE]">LIVE TICK</span>
            </div>
          </div>
        </div>

        {/* Most Frequent Simulated Detection Patterns (6 Cols) */}
        <div className="lg:col-span-6 p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-4">
          <div className="flex items-center justify-between border-b border-[#25364D] pb-3">
            <h3 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#38BDF8]" />
              <span>Most Frequent Pattern Hits</span>
            </h3>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              Hit Frequency
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {patternRanking.slice(0, 6).map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#F1F5F9] truncate pr-2">
                    <strong className="text-[#22D3EE] mr-1.5">{item.id}</strong>
                    {item.name}
                  </span>
                  <span className="text-[#94A3B8] shrink-0 font-bold">
                    {item.count} hits ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0B1220] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#38BDF8] rounded-full transition-all duration-300"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
