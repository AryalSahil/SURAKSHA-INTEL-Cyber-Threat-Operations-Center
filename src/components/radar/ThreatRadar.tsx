import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Crosshair, 
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { SimulatedEvent, RiskLevel } from '../../types/threat';

interface ThreatRadarProps {
  compact?: boolean;
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({ compact = false }) => {
  const { 
    events, 
    selectedEvent, 
    selectEvent, 
    config, 
    setRadarAnimation 
  } = useSimulation();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredEvent, setHoveredEvent] = useState<SimulatedEvent | null>(null);

  // SVG coordinate system baseline
  const size = 540;
  const center = size / 2;
  const maxRadius = (size / 2) - 36;

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      if (categoryFilter !== 'all' && evt.category !== categoryFilter) return false;
      if (riskFilter !== 'all' && evt.risk !== riskFilter) return false;
      return true;
    });
  }, [events, categoryFilter, riskFilter]);

  // Convert polar (angle, normalized distance) to Cartesian (x, y)
  const getMarkerCoordinates = (angleDeg: number, normalizedDistance: number) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const radius = normalizedDistance * maxRadius * zoomLevel;
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);
    return { x, y };
  };

  const getMarkerColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return '#FB7185';
      case 'high':
        return '#FBBF24';
      case 'medium':
        return '#3B82F6';
      case 'low':
        return '#22D3EE';
    }
  };

  return (
    <div className={`flex flex-col bg-[#111E30] border border-[#25364D] rounded relative overflow-hidden select-none ${compact ? 'p-3' : 'p-3 sm:p-5'}`}>
      {/* Top Header / Tactical HUD bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-[#25364D] pb-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[#22D3EE] shrink-0" />
          <div>
            <h3 className="text-xs font-semibold font-mono tracking-wider text-[#F1F5F9] uppercase flex items-center gap-2">
              <span>Cyber Threat Radar</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#22D3EE]/10 text-[#22D3EE] font-normal border border-[#22D3EE]/30">
                {filteredEvents.length} Targets
              </span>
            </h3>
            <p className="text-[10px] text-[#94A3B8] font-mono">
              Tactical Threat Scope · Spatial Bearing & Ingress Coordinates
            </p>
          </div>
        </div>

        {/* Filter & Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0B1220] border border-[#25364D] text-[#dee2f2] text-xs font-mono rounded px-2 py-1.5 outline-none focus:border-[#22D3EE] cursor-pointer min-h-[36px]"
          >
            <option value="all">All Vectors</option>
            <option value="phishing">Phishing</option>
            <option value="fake-job">Fake Job</option>
            <option value="upi-fraud">UPI Fraud</option>
            <option value="fake-loan">Fake Loan</option>
            <option value="impersonation">Impersonation</option>
            <option value="investment">Investment</option>
            <option value="remote-access">Remote Access</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#0B1220] border border-[#25364D] text-[#dee2f2] text-xs font-mono rounded px-2 py-1.5 outline-none focus:border-[#22D3EE] cursor-pointer min-h-[36px]"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Zoom Controls */}
          <div className="flex items-center bg-[#0B1220] border border-[#25364D] rounded">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.3))}
              className="p-1.5 text-[#94A3B8] hover:text-[#22D3EE] cursor-pointer min-h-[36px] min-w-[32px] flex items-center justify-center"
              title="Zoom In Scope"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
              className="p-1.5 text-[#94A3B8] hover:text-[#22D3EE] cursor-pointer min-h-[36px] min-w-[32px] flex items-center justify-center"
              title="Zoom Out Scope"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sweep Animation Toggle */}
          <button
            onClick={() => setRadarAnimation(!config.radarAnimation)}
            className={`p-1.5 px-2 rounded border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px] ${
              config.radarAnimation 
                ? 'bg-[#22D3EE]/15 border-[#22D3EE]/40 text-[#22D3EE]' 
                : 'bg-[#0B1220] border-[#25364D] text-[#94A3B8]'
            }`}
            title={config.radarAnimation ? 'Pause Radar Sweep' : 'Resume Radar Sweep'}
          >
            {config.radarAnimation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{config.radarAnimation ? 'Sweep' : 'Sweep'}</span>
          </button>

          {/* Reset Scope */}
          <button
            onClick={() => {
              setCategoryFilter('all');
              setRiskFilter('all');
              setZoomLevel(1);
            }}
            className="p-1.5 rounded bg-[#0B1220] border border-[#25364D] text-[#94A3B8] hover:text-[#F1F5F9] cursor-pointer min-h-[36px] min-w-[32px] flex items-center justify-center"
            title="Reset Scope View & Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Radar Main Scope Visualizer (Fully responsive with viewBox and max-width) */}
      <div className="relative flex items-center justify-center py-2 overflow-hidden w-full">
        <svg 
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[500px] aspect-square h-auto overflow-visible"
        >
          <defs>
            {/* Radar Sweep Gradient */}
            <radialGradient id="radarSweepGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#22D3EE" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </radialGradient>

            {/* Sweep sector gradient */}
            <linearGradient id="sweepSector" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
              <stop offset="85%" stopColor="#22D3EE" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.45" />
            </linearGradient>

            {/* Target Ping Glow */}
            <filter id="glowTarget" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle fill */}
          <circle 
            cx={center} 
            cy={center} 
            r={maxRadius * zoomLevel} 
            fill="#090E19" 
            stroke="#25364D" 
            strokeWidth="1.5" 
          />

          {/* Concentric Tactical Rings */}
          {[0.25, 0.5, 0.75, 1.0].map((ringRatio, i) => {
            const r = maxRadius * ringRatio * zoomLevel;
            return (
              <g key={i}>
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke={i === 3 ? '#22D3EE' : '#25364D'}
                  strokeWidth={i === 3 ? '1.5' : '1'}
                  strokeDasharray={i === 1 || i === 2 ? '4 4' : 'none'}
                  strokeOpacity={i === 3 ? 0.6 : 0.8}
                />
                {/* Distance ring labels */}
                <text
                  x={center + 6}
                  y={center - r + 12}
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  opacity={0.6}
                >
                  {i === 0 ? 'RING-1 // IMMEDIATE' : i === 1 ? 'RING-2 // CORRELATED' : i === 2 ? 'RING-3 // SURGE' : 'RING-4 // INGRESS'}
                </text>
              </g>
            );
          })}

          {/* Crosshairs & Compass Rays */}
          <line
            x1={center - (maxRadius * zoomLevel)}
            y1={center}
            x2={center + (maxRadius * zoomLevel)}
            y2={center}
            stroke="#25364D"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <line
            x1={center}
            y1={center - (maxRadius * zoomLevel)}
            x2={center}
            y2={center + (maxRadius * zoomLevel)}
            stroke="#25364D"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* Diagonal Guides */}
          {[45, 135, 225, 315].map((deg) => {
            const rad = deg * (Math.PI / 180);
            const r = maxRadius * zoomLevel;
            return (
              <line
                key={deg}
                x1={center}
                y1={center}
                x2={center + r * Math.cos(rad)}
                y2={center + r * Math.sin(rad)}
                stroke="#25364D"
                strokeWidth="0.75"
                strokeDasharray="3 5"
                strokeOpacity="0.4"
              />
            );
          })}

          {/* Degree Cardinal Annotations */}
          <text x={center} y={center - (maxRadius * zoomLevel) - 8} textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono, monospace">
            000° NORTH
          </text>
          <text x={center + (maxRadius * zoomLevel) + 16} y={center + 3} textAnchor="start" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
            090° EAST
          </text>
          <text x={center} y={center + (maxRadius * zoomLevel) + 16} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
            180° SOUTH
          </text>
          <text x={center - (maxRadius * zoomLevel) - 16} y={center + 3} textAnchor="end" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
            270° WEST
          </text>

          {/* Rotating Radar Sweep Beam */}
          {config.radarAnimation && (
            <g className="animate-radar-sweep pointer-events-none" style={{ transformOrigin: `${center}px ${center}px` }}>
              {/* Sweeping line */}
              <line
                x1={center}
                y1={center}
                x2={center}
                y2={center - (maxRadius * zoomLevel)}
                stroke="#22D3EE"
                strokeWidth="2"
                strokeOpacity="0.9"
                filter="url(#glowTarget)"
              />
              {/* Sweeping Sector Arc Trail */}
              <path
                d={`M ${center} ${center} L ${center} ${center - (maxRadius * zoomLevel)} A ${maxRadius * zoomLevel} ${maxRadius * zoomLevel} 0 0 1 ${
                  center + (maxRadius * zoomLevel) * Math.sin(45 * (Math.PI / 180))
                } ${
                  center - (maxRadius * zoomLevel) * Math.cos(45 * (Math.PI / 180))
                } Z`}
                fill="url(#sweepSector)"
              />
            </g>
          )}

          {/* Center Hub Indicator */}
          <circle cx={center} cy={center} r="4" fill="#22D3EE" filter="url(#glowTarget)" />
          <circle cx={center} cy={center} r="8" fill="none" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.5" />

          {/* Interactive Threat Markers */}
          {filteredEvents.map((evt, idx) => {
            const { x, y } = getMarkerCoordinates(evt.radarCoords.angle, evt.radarCoords.distance);
            const isSelected = selectedEvent?.id === evt.id;
            const isHovered = hoveredEvent?.id === evt.id;
            const color = getMarkerColor(evt.risk);

            return (
              <g
                key={`${evt.id}-${idx}`}
                className="cursor-pointer transition-transform duration-150"
                onClick={() => selectEvent(evt)}
                onMouseEnter={() => setHoveredEvent(evt)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {/* Critical risk pulsing halo */}
                {evt.risk === 'critical' && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 16 : 12}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                    className="animate-ping"
                  />
                )}

                {/* Selected target reticle */}
                {isSelected && (
                  <g>
                    <circle
                      cx={x}
                      cy={y}
                      r="14"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <line x1={x - 18} y1={y} x2={x - 8} y2={y} stroke="#22D3EE" strokeWidth="1" />
                    <line x1={x + 8} y1={y} x2={x + 18} y2={y} stroke="#22D3EE" strokeWidth="1" />
                    <line x1={x} y1={y - 18} x2={x} y2={y - 8} stroke="#22D3EE" strokeWidth="1" />
                    <line x1={x} y1={y + 8} x2={x} y2={y + 18} stroke="#22D3EE" strokeWidth="1" />
                  </g>
                )}

                {/* Main Target Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : isHovered ? 5 : 4}
                  fill={color}
                  stroke="#080D18"
                  strokeWidth="1.5"
                  filter="url(#glowTarget)"
                />

                {/* Micro identifier label for critical/selected */}
                {(isSelected || evt.risk === 'critical' || isHovered) && (
                  <text
                    x={x + 7}
                    y={y - 7}
                    fill={color}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow"
                  >
                    {evt.id}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Target Tooltip (Floating Tactical Card) */}
        {hoveredEvent && (
          <div className="absolute bottom-4 left-4 bg-[#16243A]/95 backdrop-blur-md border border-[#22D3EE]/50 rounded p-3 text-xs shadow-2xl pointer-events-none max-w-xs z-20">
            <div className="flex items-center justify-between font-mono text-[10px] mb-1">
              <span className="text-[#22D3EE] font-bold">{hoveredEvent.id}</span>
              <span 
                className="px-1.5 py-0.2 rounded uppercase font-bold"
                style={{ 
                  backgroundColor: `${getMarkerColor(hoveredEvent.risk)}20`,
                  color: getMarkerColor(hoveredEvent.risk)
                }}
              >
                {hoveredEvent.risk}
              </span>
            </div>
            <p className="font-semibold text-[#F1F5F9] line-clamp-1">{hoveredEvent.title}</p>
            <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">{hoveredEvent.patternName}</p>
            <div className="mt-1.5 pt-1.5 border-t border-[#25364D] text-[10px] font-mono text-[#94A3B8] flex justify-between">
              <span>Bearing: {hoveredEvent.radarCoords.angle}°</span>
              <span>Range: {Math.round(hoveredEvent.radarCoords.distance * 100)}km</span>
            </div>
          </div>
        )}
      </div>

      {/* Radar Bottom Legend */}
      <div className="mt-2 pt-3 border-t border-[#25364D] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#94A3B8]">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185] inline-block" />
            <span>Critical Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] inline-block" />
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] inline-block" />
            <span>Medium Vector</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] inline-block" />
            <span>Low Concern</span>
          </div>
        </div>

        <div className="text-[10px] text-[#94A3B8]/70">
          Click any target to inspect vector forensics
        </div>
      </div>
    </div>
  );
};
