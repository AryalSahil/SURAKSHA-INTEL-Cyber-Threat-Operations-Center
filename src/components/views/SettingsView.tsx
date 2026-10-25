import React, { useState } from 'react';
import { 
  Settings, 
  Radio, 
  RotateCcw, 
  Cpu, 
  CheckCircle2,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const SettingsView: React.FC = () => {
  const { 
    config, 
    setRadarAnimation, 
    setSoundEnabled, 
    setAutoIntervalSeconds, 
    setSpeedMultiplier, 
    resetSimulation, 
  } = useSimulation();

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetSimulation();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 select-none max-w-5xl">
      {/* Header Strip */}
      <div className="p-3.5 sm:p-4 bg-[#111E30] border border-[#25364D] rounded space-y-1">
        <h2 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#22D3EE]" />
          <span>Operations Console Configuration & Mission Briefing</span>
        </h2>
        <p className="text-xs text-[#94A3B8] font-mono">
          Operator display preferences, ingestion parameters, and threat evaluation protocols.
        </p>
      </div>

      {/* Grid: Preferences & Engine Tuners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Visual & Audio Telemetry Preferences */}
        <div className="p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-4">
          <div className="border-b border-[#25364D] pb-3">
            <h3 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#22D3EE]" />
              <span>Telemetry HUD Preferences</span>
            </h3>
            <span className="text-[10px] font-mono text-[#94A3B8]">Display & synthesizer output</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Radar Animation */}
            <div className="flex items-center justify-between p-3 bg-[#0B1220] rounded border border-[#25364D]">
              <div>
                <span className="font-semibold text-[#F1F5F9] block">Radar Sweep Animation</span>
                <span className="text-[10px] text-[#94A3B8]">Continuous 360° sweeping beam on threat radar</span>
              </div>
              <button
                onClick={() => setRadarAnimation(!config.radarAnimation)}
                className={`px-3 py-1.5 rounded font-bold cursor-pointer transition-colors min-h-[36px] ${
                  config.radarAnimation
                    ? 'bg-[#22D3EE] text-[#080D18]'
                    : 'bg-[#16243A] text-[#94A3B8]'
                }`}
              >
                {config.radarAnimation ? 'ACTIVE' : 'PAUSED'}
              </button>
            </div>

            {/* Tactical Sound Synthesizer */}
            <div className="flex items-center justify-between p-3 bg-[#0B1220] rounded border border-[#25364D]">
              <div>
                <span className="font-semibold text-[#F1F5F9] block">Web Audio Feedback</span>
                <span className="text-[10px] text-[#94A3B8]">Subtle tactical pings on critical alerts & clicks</span>
              </div>
              <button
                onClick={() => setSoundEnabled(!config.soundEnabled)}
                className={`px-3 py-1.5 rounded font-bold cursor-pointer transition-colors min-h-[36px] ${
                  config.soundEnabled
                    ? 'bg-[#22D3EE] text-[#080D18]'
                    : 'bg-[#16243A] text-[#94A3B8]'
                }`}
              >
                {config.soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            {/* Tactical Grid Pattern */}
            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#F1F5F9] block">Background Grid HUD</span>
                <span className="text-[10px] text-[#94A3B8]">32px tactical coordinate grid background</span>
              </div>
              <span className="text-[10px] text-[#34D399] font-bold">ENABLED</span>
            </div>
          </div>
        </div>

        {/* Ingestion Timing & Memory Reset */}
        <div className="p-4 sm:p-5 bg-[#111E30] border border-[#25364D] rounded space-y-4">
          <div className="border-b border-[#25364D] pb-3">
            <h3 className="text-xs font-semibold font-mono text-[#F1F5F9] uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#38BDF8]" />
              <span>Ingestion Engine Tuning</span>
            </h3>
            <span className="text-[10px] font-mono text-[#94A3B8]">Pacing and state retention</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Speed Multiplier */}
            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#F1F5F9] font-semibold">Tick Speed Multiplier</span>
                <span className="text-[#22D3EE] font-bold">{config.speedMultiplier}x</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0.5, 1, 2, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setSpeedMultiplier(s)}
                    className={`py-1.5 rounded text-[11px] font-bold cursor-pointer min-h-[36px] ${
                      config.speedMultiplier === s ? 'bg-[#22D3EE] text-[#080D18]' : 'bg-[#16243A] text-[#94A3B8]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Memory Control */}
            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D] space-y-2">
              <div>
                <span className="text-[#F1F5F9] font-semibold block">Flush In-Memory State</span>
                <span className="text-[10px] text-[#94A3B8]">Restores baseline fixtures and clears session records</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded bg-[#FB7185]/20 hover:bg-[#FB7185]/30 border border-[#FB7185]/50 text-[#FB7185] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors min-h-[36px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Baseline Dataset</span>
                </button>
                {resetSuccess && (
                  <span className="text-xs text-[#34D399] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Flushed!</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Walkthrough / Evaluation Guide */}
      <div className="p-4 sm:p-6 bg-[#111E30] border border-[#22D3EE]/30 rounded space-y-4">
        <div className="flex items-center gap-2 text-[#22D3EE] border-b border-[#25364D] pb-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-semibold text-sm text-[#F1F5F9] font-mono uppercase tracking-wider">
            Threat Operations Walkthrough
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="space-y-3">
            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D]">
              <span className="font-mono font-bold text-[#22D3EE] block mb-1">
                Step 1: Command Overview & Live Threat Radar
              </span>
              <p className="text-[#94A3B8]">
                Open the <strong>Command Overview</strong>. Observe the rotating cyber threat radar, operational KPI counters, and live threat telemetry feed. Radar targets pulse based on risk severity.
              </p>
            </div>

            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D]">
              <span className="font-mono font-bold text-[#22D3EE] block mb-1">
                Step 2: Deep Threat Investigation
              </span>
              <p className="text-[#94A3B8]">
                Click any radar marker or event feed row. The right-hand <strong>Threat Investigation</strong> drawer slides open with extracted warning signs, raw ingress samples, and prescribed citizen countermeasures.
              </p>
            </div>

            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D]">
              <span className="font-mono font-bold text-[#22D3EE] block mb-1">
                Step 3: Attack Signature Tuning
              </span>
              <p className="text-[#94A3B8]">
                Navigate to <strong>Scam Pattern Analysis</strong>. Toggle any signature OFF (e.g. JOB-FEE-001). The audit log immediately records the operator action, and incoming ticks adapt.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D]">
              <span className="font-mono font-bold text-[#22D3EE] block mb-1">
                Step 4: Interactive Operations Control Console
              </span>
              <p className="text-[#94A3B8]">
                Visit the <strong>Operations Control Console</strong>. Click <em>"+ Inject Digital Arrest"</em> or <em>"Trigger +5 Surge"</em>. Watch all metrics, radar markers, and category charts update in real-time.
              </p>
            </div>

            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D]">
              <span className="font-mono font-bold text-[#22D3EE] block mb-1">
                Step 5: Dynamic Threat Analytics
              </span>
              <p className="text-[#94A3B8]">
                Open <strong>Threat Analytics</strong>. Hover over the interactive SVG donut chart and inspect the severity matrix and hourly velocity. All metrics compute dynamically from the active dataset.
              </p>
            </div>

            <div className="p-3 bg-[#0B1220] rounded border border-[#25364D]">
              <span className="font-mono font-bold text-[#22D3EE] block mb-1">
                Step 6: CSV Export & Fullscreen
              </span>
              <p className="text-[#94A3B8]">
                Check <strong>Network Monitor</strong> to inspect node topology, use the fullscreen toggle in the top bar for an immersive NOC wall display, and download incident records via <strong>Export CSV</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="p-4 sm:p-5 bg-[#0B1220] border border-[#25364D] rounded space-y-2">
        <div className="flex items-center gap-2 text-[#22D3EE]">
          <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
          <h4 className="font-mono font-bold text-xs uppercase text-[#F1F5F9]">
            SURAKSHA INTEL Operations Mission
          </h4>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          SURAKSHA INTEL provides automated cyber threat intelligence, pattern detection, and defensive telemetry to shield citizens from social engineering attacks, digital extortion, and financial deception.
        </p>
        <div className="pt-2 border-t border-[#25364D] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#94A3B8]">
          <span>SURAKSHA INTEL — CYBER THREAT OPERATIONS CENTER</span>
          <span>TAGLINE: “Observe. Analyse. Protect.”</span>
        </div>
      </div>
    </div>
  );
};
