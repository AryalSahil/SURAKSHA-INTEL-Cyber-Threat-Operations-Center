import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  VolumeX, 
  Gauge
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ScamCategory, RiskLevel } from '../../types/threat';

export const SimulationControlRoom: React.FC = () => {
  const { 
    config, 
    toggleSimulation, 
    setSpeedMultiplier, 
    setAutoIntervalSeconds, 
    setSoundEnabled, 
    generateEvent, 
    generateBatch, 
    resetSimulation, 
    eventsGeneratedInSession,
  } = useSimulation();

  const [customCategory, setCustomCategory] = useState<ScamCategory>('phishing');
  const [customRisk, setCustomRisk] = useState<RiskLevel>('critical');
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [injectedSuccess, setInjectedSuccess] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleCustomInject = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvt = generateEvent(
      customCategory, 
      customRisk, 
      customTitle.trim() || undefined, 
      customDesc.trim() || undefined
    );
    setInjectedSuccess(newEvt.id);
    setCustomTitle('');
    setCustomDesc('');
    setTimeout(() => setInjectedSuccess(null), 3000);
  };

  const scenarioTriggers: {
    category: ScamCategory;
    risk: RiskLevel;
    label: string;
    sublabel: string;
    accent: string;
  }[] = [
    {
      category: 'phishing',
      risk: 'critical',
      label: 'Phishing: Deceptive NetBanking Portal',
      sublabel: 'Harvests credentials via lookalike typo-squat URL',
      accent: 'border-[#FB7185]/40 hover:border-[#FB7185] text-[#FB7185]',
    },
    {
      category: 'impersonation',
      risk: 'critical',
      label: 'Impersonation: Law Enforcement Digital Arrest',
      sublabel: 'Video call extortion claiming contraband parcel intercepted',
      accent: 'border-[#FB7185]/40 hover:border-[#FB7185] text-[#FB7185]',
    },
    {
      category: 'upi-fraud',
      risk: 'high',
      label: 'UPI Fraud: Reverse QR Code Mandate',
      sublabel: 'Tricks victim into entering PIN to "receive payment"',
      accent: 'border-[#FBBF24]/40 hover:border-[#FBBF24] text-[#FBBF24]',
    },
    {
      category: 'fake-job',
      risk: 'high',
      label: 'Fake Job: Advance Registration Fee Task',
      sublabel: 'Promises ₹5,000/day for video likes requiring deposit',
      accent: 'border-[#38BDF8]/40 hover:border-[#38BDF8] text-[#38BDF8]',
    },
    {
      category: 'remote-access',
      risk: 'critical',
      label: 'Remote Access: Power Cut App Installation',
      sublabel: 'Electricity bill urgency coercing AnyDesk/TeamViewer install',
      accent: 'border-[#FB7185]/40 hover:border-[#FB7185] text-[#FB7185]',
    },
    {
      category: 'fake-loan',
      risk: 'medium',
      label: 'Fake Loan: Instant Pre-Approved Disbursal',
      sublabel: 'Demands upfront GST clearance deposit on WhatsApp',
      accent: 'border-[#FBBF24]/40 hover:border-[#FBBF24] text-[#FBBF24]',
    },
    {
      category: 'investment',
      risk: 'medium',
      label: 'Investment: Guaranteed Crypto Trading Bot',
      sublabel: '300% monthly yield scheme preventing capital withdrawals',
      accent: 'border-[#A78BFA]/40 hover:border-[#A78BFA] text-[#A78BFA]',
    },
    {
      category: 'phishing',
      risk: 'low',
      label: 'Nominal Traffic: Commercial Promo Intercept',
      sublabel: 'Benign food coupon with no scam or harvesting indicators',
      accent: 'border-[#34D399]/40 hover:border-[#34D399] text-[#34D399]',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 select-none">
      {/* Header Banner */}
      <div className="p-3.5 sm:p-4 bg-[#111E30] border border-[#25364D] rounded space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#22D3EE]" />
              <span>Operations Control Console & Ingress Injection</span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Live operational controls for injecting scenario vectors, managing ingestion velocity, and testing radar response.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded bg-[#16243A] text-[#22D3EE] border border-[#22D3EE]/30">
              +{eventsGeneratedInSession} Ingress Events Recorded
            </span>
          </div>
        </div>
      </div>

      {/* Primary Engine Controls Card */}
      <div className="p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-4 sm:space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#25364D] pb-4">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Stream State Toggle */}
            <button
              onClick={toggleSimulation}
              className={`px-3.5 sm:px-4 py-2 rounded text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[40px] ${
                config.isRunning
                  ? 'bg-[#34D399] text-[#080D18] hover:bg-[#5ff6bb] shadow-[0_0_14px_rgba(52,211,153,0.3)]'
                  : 'bg-[#FB7185] text-[#080D18] hover:bg-[#fa8b9d] shadow-[0_0_14px_rgba(251,113,133,0.3)]'
              }`}
            >
              {config.isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{config.isRunning ? 'PAUSE INGRESS STREAM' : 'ENGAGE INGRESS STREAM'}</span>
            </button>

            {/* Quick Burst Buttons */}
            <button
              onClick={() => generateBatch(5)}
              className="px-3 py-2 rounded bg-[#16243A] hover:bg-[#1B2B42] border border-[#22D3EE]/40 text-[#22D3EE] text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Trigger +5 Surge</span>
            </button>
            <button
              onClick={() => generateBatch(10)}
              className="px-3 py-2 rounded bg-[#16243A] hover:bg-[#1B2B42] border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Trigger +10 Surge</span>
            </button>
          </div>

          {/* Reset Action */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 rounded bg-[#0B1220] hover:bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Purge Memory State</span>
          </button>
        </div>

        {/* Speed & Interval Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 pt-1">
          {/* Speed Multiplier */}
          <div className="p-3.5 bg-[#0B1220] rounded border border-[#25364D] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#22D3EE]" />
                Ingestion Speed Multiplier
              </span>
              <span className="text-[#22D3EE] font-bold">{config.speedMultiplier}x</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[0.5, 1, 2, 5].map(multiplier => (
                <button
                  key={multiplier}
                  onClick={() => setSpeedMultiplier(multiplier)}
                  className={`py-1.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer min-h-[36px] ${
                    config.speedMultiplier === multiplier
                      ? 'bg-[#22D3EE] text-[#080D18]'
                      : 'bg-[#16243A] text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  {multiplier}x
                </button>
              ))}
            </div>
          </div>

          {/* Base Tick Interval */}
          <div className="p-3.5 bg-[#0B1220] rounded border border-[#25364D] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#34D399]" />
                Nominal Ingress Interval
              </span>
              <span className="text-[#34D399] font-bold">{config.autoIntervalSeconds}s</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[3, 6, 10].map(seconds => (
                <button
                  key={seconds}
                  onClick={() => setAutoIntervalSeconds(seconds)}
                  className={`py-1.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer min-h-[36px] ${
                    config.autoIntervalSeconds === seconds
                      ? 'bg-[#34D399] text-[#080D18]'
                      : 'bg-[#16243A] text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  {seconds} sec
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Audio Synthesizer */}
          <div className="p-3.5 bg-[#0B1220] rounded border border-[#25364D] space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                {config.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#22D3EE]" /> : <VolumeX className="w-3.5 h-3.5 text-[#94A3B8]" />}
                Tactical Audio Feedback
              </span>
              <span className={`font-bold ${config.soundEnabled ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`}>
                {config.soundEnabled ? 'ACTIVE' : 'MUTED'}
              </span>
            </div>
            <button
              onClick={() => setSoundEnabled(!config.soundEnabled)}
              className={`w-full py-1.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer border min-h-[36px] ${
                config.soundEnabled 
                  ? 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/50' 
                  : 'bg-[#16243A] text-[#94A3B8] border-[#25364D] hover:text-[#F1F5F9]'
              }`}
            >
              {config.soundEnabled ? 'Mute Audio Synthesizer' : 'Enable Audio Feedback'}
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Trigger Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold font-mono tracking-wider text-[#F1F5F9] uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#22D3EE]" />
            <span>Pre-Configured Threat Ingress Scenarios</span>
          </h3>
          <span className="text-[10px] font-mono text-[#94A3B8]">
            Click to dispatch incident to radar & feeds
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarioTriggers.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                const res = generateEvent(t.category, t.risk);
                setInjectedSuccess(res.id);
                setTimeout(() => setInjectedSuccess(null), 3000);
              }}
              className={`p-3.5 bg-[#111E30] hover:bg-[#16243A] border rounded text-left transition-all duration-150 cursor-pointer space-y-1.5 min-h-[110px] flex flex-col justify-between ${t.accent}`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="uppercase font-bold">{t.category}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#0B1220] border border-current font-bold uppercase">
                    {t.risk}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-[#F1F5F9] leading-tight">
                  {t.label}
                </h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2 mt-1">
                  {t.sublabel}
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-[#22D3EE] flex items-center gap-1 font-semibold">
                <span>+ Inject Incident</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Event Builder Form */}
      <div className="p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-4">
        <div className="flex items-center justify-between border-b border-[#25364D] pb-3">
          <h3 className="text-xs font-semibold font-mono tracking-wider text-[#F1F5F9] uppercase flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-[#22D3EE]" />
            <span>Custom Threat Vector Constructor</span>
          </h3>
          {injectedSuccess && (
            <span className="text-xs font-mono text-[#34D399] flex items-center gap-1 bg-[#34D399]/15 px-2 py-0.5 rounded border border-[#34D399]/40 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Incident {injectedSuccess} Injected</span>
            </span>
          )}
        </div>

        <form onSubmit={handleCustomInject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-[#94A3B8]">
                Threat Category / Vector
              </label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as ScamCategory)}
                className="w-full bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] text-[#F1F5F9] text-xs font-mono rounded p-2 outline-none cursor-pointer min-h-[38px]"
              >
                <option value="phishing">Phishing / Lookalike Portal</option>
                <option value="fake-job">Fake Job / Task Commission</option>
                <option value="upi-fraud">UPI Fraud / QR Code Mandate</option>
                <option value="fake-loan">Fake Loan / Advance Processing</option>
                <option value="impersonation">Impersonation / Digital Arrest</option>
                <option value="investment">Investment / High-Yield Ponzi</option>
                <option value="remote-access">Remote Access / Diagnostic Hijack</option>
              </select>
            </div>

            {/* Risk */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-[#94A3B8]">
                Priority Severity Level
              </label>
              <select
                value={customRisk}
                onChange={(e) => setCustomRisk(e.target.value as RiskLevel)}
                className="w-full bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] text-[#F1F5F9] text-xs font-mono rounded p-2 outline-none cursor-pointer min-h-[38px]"
              >
                <option value="critical">Critical (Immediate Containment / Alert)</option>
                <option value="high">High Risk (Heuristic Escalate)</option>
                <option value="medium">Medium Concern (Behavioral Analysis)</option>
                <option value="low">Low Concern (Standard Verification)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-[#94A3B8]">
              Incident Title (Optional)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Utility Power Disconnection High-Pressure SMS"
              className="w-full bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] rounded p-2 text-xs text-[#F1F5F9] outline-none font-sans placeholder:text-[#94A3B8]/50 min-h-[38px]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-[#94A3B8]">
              Forensic Description / Context (Optional)
            </label>
            <textarea
              rows={2}
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              placeholder="e.g. Actor demanding immediate ₹10 token payment to cancel scheduled 9:30 PM power outage."
              className="w-full bg-[#0B1220] border border-[#25364D] focus:border-[#22D3EE] rounded p-2 text-xs text-[#F1F5F9] outline-none font-sans placeholder:text-[#94A3B8]/50 resize-none"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-[#22D3EE] hover:bg-[#5fe0f5] text-[#080D18] font-bold text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors shadow-[0_0_12px_rgba(34,211,238,0.3)] min-h-[40px]"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Inject Threat Incident</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#16243A] border border-[#25364D] rounded-lg max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 text-[#FB7185]">
              <div className="w-10 h-10 rounded bg-[#FB7185]/15 border border-[#FB7185]/40 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-[#FB7185]" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#F1F5F9]">Purge Operations State?</h3>
                <p className="text-xs text-[#94A3B8] font-mono">Restores Baseline Catalog</p>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed">
              Clears all dynamically recorded incidents, flushes session state, and restores the baseline threat catalog.
            </p>

            <div className="flex justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 rounded bg-[#111E30] border border-[#25364D] text-[#dee2f2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetSimulation();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-2 rounded bg-[#FB7185] text-[#080D18] font-bold cursor-pointer"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
