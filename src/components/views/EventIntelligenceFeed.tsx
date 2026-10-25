import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Play, 
  Pause, 
  ArrowUpDown, 
  RotateCcw, 
  ShieldAlert, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskLevel } from '../../types/threat';

export const EventIntelligenceFeed: React.FC = () => {
  const { 
    events, 
    selectedEvent, 
    selectEvent, 
    config, 
    toggleSimulation, 
    exportEventsCSV 
  } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    return events
      .filter(evt => {
        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchesId = evt.id.toLowerCase().includes(query);
          const matchesTitle = evt.title.toLowerCase().includes(query);
          const matchesDesc = evt.description.toLowerCase().includes(query);
          const matchesPattern = evt.patternId.toLowerCase().includes(query) || evt.patternName.toLowerCase().includes(query);
          if (!matchesId && !matchesTitle && !matchesDesc && !matchesPattern) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && evt.category !== selectedCategory) {
          return false;
        }

        // Risk filter
        if (selectedRisk !== 'all' && evt.risk !== selectedRisk) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [events, searchTerm, selectedCategory, selectedRisk, sortOrder]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedRisk('all');
    setSortOrder('newest');
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
      {/* Header & Controls Strip */}
      <div className="p-3.5 sm:p-4 bg-[#111E30] border border-[#25364D] rounded space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#22D3EE]" />
              <span>Event Intelligence Telemetry Feed</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#16243A] text-[#22D3EE] border border-[#22D3EE]/30">
                {filteredEvents.length} of {events.length}
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Live threat incident records analyzed by the heuristic cyber defense pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Stream Run / Pause Toggle */}
            <button
              onClick={toggleSimulation}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]` }
            >
              {config.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{config.isRunning ? 'Pause Ingress' : 'Resume Ingress'}</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={exportEventsCSV}
              className="px-3 py-1.5 rounded bg-[#16243A] hover:bg-[#1B2B42] border border-[#25364D] hover:border-[#22D3EE]/40 text-[#dee2f2] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
              title="Download dataset as CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 pt-2 border-t border-[#25364D]">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#22D3EE] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, title, pattern..."
              className="w-full bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] rounded pl-8 pr-3 py-2 text-xs text-[#F1F5F9] outline-none font-mono placeholder:text-[#94A3B8]/50 min-h-[36px]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] text-[#dee2f2] text-xs font-mono rounded px-2.5 py-2 outline-none cursor-pointer min-h-[36px]"
          >
            <option value="all">All Threat Categories</option>
            <option value="phishing">Phishing Vectors</option>
            <option value="fake-job">Fake Job Traps</option>
            <option value="upi-fraud">UPI Fraud</option>
            <option value="fake-loan">Fake Loan Schemes</option>
            <option value="impersonation">Law Enforcement / Impersonation</option>
            <option value="investment">Investment / High-Yield</option>
            <option value="remote-access">Remote Access Hijack</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] text-[#dee2f2] text-xs font-mono rounded px-2.5 py-2 outline-none cursor-pointer min-h-[36px]"
          >
            <option value="all">All Risk Priorities</option>
            <option value="critical">Critical Priority Only</option>
            <option value="high">High Risk Only</option>
            <option value="medium">Medium Concern Only</option>
            <option value="low">Low Concern Only</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="bg-[#0B1220] border border-[#25364D] hover:border-[#22D3EE]/50 text-[#dee2f2] text-xs font-mono rounded px-3 py-2 flex items-center justify-between cursor-pointer min-h-[36px]"
          >
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </div>
          </button>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="bg-[#0B1220] hover:bg-[#16243A] border border-[#25364D] text-[#94A3B8] hover:text-[#F1F5F9] text-xs font-mono rounded px-3 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Main Events Table / Telemetry Stream */}
      <div className="bg-[#111E30] border border-[#25364D] rounded overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#FBBF24] mx-auto" />
            <h3 className="text-sm font-semibold text-[#F1F5F9]">No Matching Events Found</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              No threat events match your current filter parameters. Try clearing the search query or adjusting risk/category filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#16243A] hover:bg-[#1B2B42] text-[#22D3EE] border border-[#25364D] rounded text-xs font-mono cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-[#0B1220] border-b border-[#25364D] font-mono text-[11px] text-[#94A3B8] uppercase">
                  <th className="py-2.5 px-4 font-semibold">Incident ID</th>
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold">Priority</th>
                  <th className="py-2.5 px-3 font-semibold">Threat Vector</th>
                  <th className="py-2.5 px-3 font-semibold">Signature ID</th>
                  <th className="py-2.5 px-4 font-semibold">Incident Title</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Signals</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25364D]/50 font-sans">
                {filteredEvents.map((evt, idx) => {
                  const isSelected = selectedEvent?.id === evt.id;
                  return (
                    <tr
                      key={`${evt.id}-${idx}`}
                      onClick={() => selectEvent(evt)}
                      className={`h-[44px] hover:bg-[#16243A] transition-colors cursor-pointer select-none ${
                        isSelected 
                          ? 'bg-[#16243A] border-l-2 border-l-[#22D3EE]' 
                          : idx % 2 === 0 ? 'bg-[#111E30]' : 'bg-[#0E1929]'
                      }`}
                    >
                      {/* Event ID */}
                      <td className="py-2 px-4 font-mono font-bold text-[#22D3EE] whitespace-nowrap">
                        {evt.id}
                      </td>

                      {/* Timestamp */}
                      <td className="py-2 px-3 font-mono text-[#94A3B8] text-[11px] whitespace-nowrap">
                        {evt.timestamp.slice(11, 19)} UTC
                      </td>

                      {/* Risk */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold inline-block ${getRiskBadge(evt.risk)}`}>
                          {evt.risk}
                        </span>
                      </td>

                      {/* Threat Vector */}
                      <td className="py-2 px-3 font-mono text-[11px] text-[#dee2f2] capitalize whitespace-nowrap">
                        {evt.category.replace('-', ' ')}
                      </td>

                      {/* Pattern Signature */}
                      <td className="py-2 px-3 font-mono text-[11px] text-[#38BDF8] whitespace-nowrap">
                        {evt.patternId}
                      </td>

                      {/* Title & snippet */}
                      <td className="py-2 px-4 max-w-xs xl:max-w-md">
                        <span className="font-medium text-[#F1F5F9] truncate block">
                          {evt.title}
                        </span>
                        <span className="text-[11px] text-[#94A3B8] truncate block">
                          {evt.description}
                        </span>
                      </td>

                      {/* Signals Count */}
                      <td className="py-2 px-3 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-[#0B1220] text-[#94A3B8] font-mono text-[10px] border border-[#25364D]">
                          {evt.matchedSignals.length} triggers
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectEvent(evt);
                          }}
                          className="px-2.5 py-1.5 rounded bg-[#0B1220] hover:bg-[#22D3EE]/20 hover:text-[#22D3EE] border border-[#25364D] text-[#dee2f2] text-[11px] font-mono transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Bar */}
        <div className="p-3 bg-[#0B1220] border-t border-[#25364D] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34D399]" />
            <span>Active heuristic telemetry stream · Incident logs verified</span>
          </div>
          <div>
            Showing <strong className="text-[#F1F5F9]">{filteredEvents.length}</strong> of {events.length} records
          </div>
        </div>
      </div>
    </div>
  );
};
