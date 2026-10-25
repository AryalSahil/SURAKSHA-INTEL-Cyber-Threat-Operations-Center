import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Download
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, exportAuditLogsCSV } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = log.id.toLowerCase().includes(query);
        const matchesAction = log.action.toLowerCase().includes(query);
        const matchesDetail = log.detail.toLowerCase().includes(query);
        const matchesRelated = log.relatedId?.toLowerCase().includes(query) || false;
        if (!matchesId && !matchesAction && !matchesDetail && !matchesRelated) return false;
      }

      if (actionFilter !== 'all') {
        if (!log.action.toLowerCase().includes(actionFilter.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [auditLogs, searchTerm, actionFilter]);

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* Header and Controls */}
      <div className="p-3.5 sm:p-4 bg-[#111E30] border border-[#25364D] rounded space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#22D3EE]" />
              <span>Operator Audit & Operations Logs</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#16243A] text-[#22D3EE] border border-[#22D3EE]/30">
                {filteredLogs.length} Records
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Cryptographic local audit record of threat containment actions, signature toggles, and incident injections.
            </p>
          </div>

          <button
            onClick={exportAuditLogsCSV}
            className="px-3 py-1.5 rounded bg-[#16243A] hover:bg-[#1B2B42] border border-[#25364D] hover:border-[#22D3EE]/40 text-[#dee2f2] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
            title="Download audit log as CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Export Audit Log</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#25364D]">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-[#22D3EE] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search log ID, action, incident ID..."
              className="w-full bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] rounded pl-8 pr-3 py-2 text-xs text-[#F1F5F9] outline-none font-mono placeholder:text-[#94A3B8]/50 min-h-[36px]"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] text-[#dee2f2] text-xs font-mono rounded px-2.5 py-2 outline-none cursor-pointer min-h-[36px]"
          >
            <option value="all">All Action Categories</option>
            <option value="Detected">Incident Detection</option>
            <option value="Stream">Ingress Stream (Start/Pause/Reset)</option>
            <option value="Signature">Signature Toggles</option>
            <option value="Speed">Speed Changes</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#111E30] border border-[#25364D] rounded overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#94A3B8]">
            No audit logs match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[650px]">
              <thead>
                <tr className="bg-[#0B1220] border-b border-[#25364D] font-mono text-[11px] text-[#94A3B8] uppercase">
                  <th className="py-2.5 px-4 font-semibold">Log ID</th>
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold">Action</th>
                  <th className="py-2.5 px-4 font-semibold">Details & Target</th>
                  <th className="py-2.5 px-3 font-semibold">Related ID</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25364D]/50 font-sans">
                {filteredLogs.map((log, idx) => (
                  <tr
                    key={`${log.id}-${idx}`}
                    className={`h-[42px] hover:bg-[#16243A] transition-colors ${
                      idx % 2 === 0 ? 'bg-[#111E30]' : 'bg-[#0E1929]'
                    }`}
                  >
                    <td className="py-2 px-4 font-mono font-bold text-[#22D3EE] whitespace-nowrap">
                      {log.id}
                    </td>

                    <td className="py-2 px-3 font-mono text-[#94A3B8] text-[11px] whitespace-nowrap">
                      {log.timestamp.slice(11, 19)} UTC
                    </td>

                    <td className="py-2 px-3 font-mono font-semibold text-[#F1F5F9] whitespace-nowrap">
                      {log.action}
                    </td>

                    <td className="py-2 px-4 text-[#dee2f2] text-xs">
                      {log.detail}
                    </td>

                    <td className="py-2 px-3 font-mono text-[11px] text-[#38BDF8] whitespace-nowrap">
                      {log.relatedId || '—'}
                    </td>

                    <td className="py-2 px-3 font-mono text-[10px] text-right text-[#94A3B8] whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-[#0B1220] border border-[#25364D]">
                        {log.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3 bg-[#0B1220] border-t border-[#25364D] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span>Audit trail is retained in secure session memory</span>
          <span className="text-[#34D399] font-semibold">INTEGRITY: SECURE</span>
        </div>
      </div>
    </div>
  );
};
