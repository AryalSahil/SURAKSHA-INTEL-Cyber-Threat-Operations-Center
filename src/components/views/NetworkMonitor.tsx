import React, { useState } from 'react';
import { 
  Network, 
  WifiOff, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Info
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { NetworkNode } from '../../types/threat';

export const NetworkMonitor: React.FC = () => {
  const { networkNodes, events } = useSimulation();
  const [activeInspectNode, setActiveInspectNode] = useState<NetworkNode | null>(networkNodes[0]);

  const getNodeIcon = (type: NetworkNode['type']) => {
    switch (type) {
      case 'client':
        return <WifiOff className="w-5 h-5 text-[#FB7185]" />;
      case 'engine':
        return <Cpu className="w-5 h-5 text-[#22D3EE]" />;
      case 'service':
        return <Activity className="w-5 h-5 text-[#38BDF8]" />;
      case 'storage':
        return <Database className="w-5 h-5 text-[#FBBF24]" />;
      case 'external':
        return <ShieldCheck className="w-5 h-5 text-[#34D399]" />;
    }
  };

  const getNodeColor = (statusType: NetworkNode['statusType']) => {
    switch (statusType) {
      case 'active':
        return { border: 'border-[#34D399]/60', bg: 'bg-[#34D399]/10', text: 'text-[#34D399]', ping: '#34D399' };
      case 'disconnected':
        return { border: 'border-[#FB7185]/60', bg: 'bg-[#FB7185]/10', text: 'text-[#FB7185]', ping: '#FB7185' };
      case 'demo':
        return { border: 'border-[#22D3EE]/60', bg: 'bg-[#22D3EE]/10', text: 'text-[#22D3EE]', ping: '#22D3EE' };
      case 'local':
        return { border: 'border-[#FBBF24]/60', bg: 'bg-[#FBBF24]/10', text: 'text-[#FBBF24]', ping: '#FBBF24' };
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 select-none">
      {/* Header Banner */}
      <div className="p-3.5 sm:p-4 bg-[#111E30] border border-[#25364D] rounded space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
              <Network className="w-4 h-4 text-[#22D3EE]" />
              <span>Network Topology & Subsystem Monitor</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#16243A] text-[#22D3EE] border border-[#22D3EE]/30">
                {networkNodes.length} Subsystems
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Live operational health and interconnect bus telemetry across defensive cyber nodes.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded bg-[#34D399]/10 border border-[#34D399]/30 text-[#34D399] text-xs font-mono">
            Core Data Bus: Active (Nominal)
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Topology Map & Node Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left: Topology Map (7 Cols) */}
        <div className="lg:col-span-7 p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#25364D] pb-3">
            <h3 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#22D3EE]" />
              <span>Tactical Data Bus & Service Interconnects</span>
            </h3>
            <span className="text-[10px] font-mono text-[#34D399]">
              ENCRYPTED IPC
            </span>
          </div>

          {/* SVG Topology Visualizer Canvas (Responsive with viewBox) */}
          <div className="relative py-2 flex items-center justify-center bg-[#080D18] border border-[#25364D] rounded overflow-hidden w-full">
            <svg viewBox="0 0 760 380" className="w-full h-auto max-h-[380px] overflow-visible">
              <defs>
                <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
                </linearGradient>
                <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Bus Lines */}
              {networkNodes.map(sourceNode => {
                return sourceNode.connections.map(targetId => {
                  const targetNode = networkNodes.find(n => n.id === targetId);
                  if (!targetNode) return null;
                  const isSourceDisconnected = sourceNode.statusType === 'disconnected';

                  return (
                    <g key={`${sourceNode.id}-${targetNode.id}`}>
                      {/* Base trace line */}
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={isSourceDisconnected ? '#FB7185' : '#25364D'}
                        strokeWidth={isSourceDisconnected ? '1.5' : '2'}
                        strokeDasharray={isSourceDisconnected ? '4 4' : 'none'}
                        strokeOpacity={isSourceDisconnected ? '0.5' : '0.8'}
                      />
                      {/* Animated moving packet dot if active */}
                      {!isSourceDisconnected && (
                        <circle r="3" fill="#22D3EE" filter="url(#nodeGlow)">
                          <animateMotion
                            path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                });
              })}

              {/* Render Nodes as SVG Groups */}
              {networkNodes.map(node => {
                const colors = getNodeColor(node.statusType);
                const isSelected = activeInspectNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => setActiveInspectNode(node)}
                  >
                    {/* Selected halo */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="34"
                        fill="none"
                        stroke="#22D3EE"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="animate-spin"
                        style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: '8s' }}
                      />
                    )}

                    {/* Outer node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="26"
                      fill="#111E30"
                      stroke={isSelected ? '#22D3EE' : '#25364D'}
                      strokeWidth="2"
                    />

                    {/* Status ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      fill="#16243A"
                      stroke={colors.ping}
                      strokeWidth="1.5"
                    />

                    {/* Node Text Label */}
                    <text
                      x={node.x}
                      y={node.y + 40}
                      textAnchor="middle"
                      fill="#F1F5F9"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="Inter, sans-serif"
                    >
                      {node.shortLabel}
                    </text>

                    <text
                      x={node.x}
                      y={node.y + 54}
                      textAnchor="middle"
                      fill={colors.ping}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {node.status}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Topology Footer Note */}
          <div className="pt-2 border-t border-[#25364D] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#94A3B8]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[#34D399]">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" /> Active Engine
              </span>
              <span className="flex items-center gap-1.5 text-[#FB7185]">
                <span className="w-2 h-2 rounded-full bg-[#FB7185]" /> Air-Gapped Channel
              </span>
            </div>
            <span>Click any node to inspect subsystem architecture</span>
          </div>
        </div>

        {/* Right: Subsystem Inspector & Ingress Strip (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeInspectNode ? (
            <div className="p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-4">
              <div className="flex items-center justify-between border-b border-[#25364D] pb-3">
                <div className="flex items-center gap-2">
                  {getNodeIcon(activeInspectNode.type)}
                  <div>
                    <span className="text-[10px] font-mono text-[#94A3B8] block">{activeInspectNode.id}</span>
                    <h3 className="font-semibold text-sm text-[#F1F5F9]">{activeInspectNode.name}</h3>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  getNodeColor(activeInspectNode.statusType).bg
                } ${getNodeColor(activeInspectNode.statusType).text} border ${getNodeColor(activeInspectNode.statusType).border}`}>
                  {activeInspectNode.status}
                </span>
              </div>

              {/* Subsystem Role */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#94A3B8]">
                  Architectural Role
                </label>
                <p className="text-xs text-[#dee2f2] leading-relaxed bg-[#0B1220] p-3 rounded border border-[#25364D]">
                  {activeInspectNode.role}
                </p>
              </div>

              {/* Security Profile */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#22D3EE] flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Node Security Specification
                </label>
                <div className="p-3 bg-[#0B1220] border border-[#22D3EE]/30 rounded text-xs text-[#dee2f2] leading-relaxed">
                  {activeInspectNode.demoLimitation}
                </div>
              </div>

              {/* Node Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-[#0B1220] rounded border border-[#25364D]">
                  <span className="text-[10px] text-[#94A3B8] block">Interconnect Latency</span>
                  <span className="text-[#22D3EE] font-bold">
                    {activeInspectNode.pingMs > 0 ? `${activeInspectNode.pingMs} ms` : 'AIR-GAPPED'}
                  </span>
                </div>
                <div className="p-2.5 bg-[#0B1220] rounded border border-[#25364D]">
                  <span className="text-[10px] text-[#94A3B8] block">Subsystem Uptime</span>
                  <span className="text-[#34D399] font-bold">
                    {activeInspectNode.uptime}
                  </span>
                </div>
              </div>

              {/* Downstream Interconnects */}
              <div className="space-y-1.5 pt-2 border-t border-[#25364D]">
                <label className="text-[10px] font-mono uppercase text-[#94A3B8] block">
                  Downstream Bus Connections ({activeInspectNode.connections.length})
                </label>
                {activeInspectNode.connections.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic">No active downstream bus routes.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {activeInspectNode.connections.map(connId => (
                      <span key={connId} className="px-2 py-1 rounded bg-[#0B1220] border border-[#25364D] text-[11px] font-mono text-[#dee2f2]">
                        → {connId}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-[#111E30] border border-[#25364D] rounded text-center text-xs text-[#94A3B8]">
              Select any node on the topology canvas to inspect subsystem metrics.
            </div>
          )}

          {/* Subsystem Event Ingress Strip */}
          <div className="p-4 bg-[#111E30] border border-[#25364D] rounded space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] border-b border-[#25364D] pb-2">
              <span>SUBSYSTEM INGRESS LOGS</span>
              <span className="text-[#22D3EE]">HEURISTIC BUS</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px]">
              {events.slice(0, 4).map(e => (
                <div key={e.id} className="p-2 rounded bg-[#0B1220] border border-[#25364D]/60 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[#22D3EE] mr-2">{e.id}</span>
                    <span className="text-[#94A3B8] truncate">{e.title}</span>
                  </div>
                  <span className="text-[#34D399] shrink-0 text-[10px]">VERIFIED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
