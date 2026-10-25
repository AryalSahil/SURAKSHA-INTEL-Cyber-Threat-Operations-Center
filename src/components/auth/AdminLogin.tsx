import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Terminal, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const REQUIRED_PASSCODE = '782447';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please input your security clearance passcode.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      if (password.trim() === REQUIRED_PASSCODE) {
        sessionStorage.setItem('suraksha_intel_auth', 'true');
        onLoginSuccess();
      } else {
        setIsAuthenticating(false);
        setError('ACCESS DENIED // Invalid security clearance passcode.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen w-screen bg-[#080D18] text-[#F1F5F9] font-sans flex flex-col justify-between items-center relative overflow-hidden bg-tactical-grid select-none p-4 sm:p-6">
      {/* Background Ambience Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#22D3EE]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Classification Banner */}
      <header className="w-full max-w-5xl flex items-center justify-between py-3 border-b border-[#25364D]/60 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
          <span className="text-[#dee2f2]">SEC-OPS GATEWAY</span>
          <span className="text-[#25364D]">|</span>
          <span className="text-[#22D3EE]">NODE-01 ACTIVE</span>
        </div>
        <div className="text-[11px] text-[#94A3B8]">
          CLASSIFICATION: <span className="text-[#FBBF24] font-bold">RESTRICTED // LEVEL 1</span>
        </div>
      </header>

      {/* Center Authentication Modal Card */}
      <main className="w-full max-w-md my-auto relative z-10 py-6">
        <div className="bg-[#111E30] border border-[#25364D] rounded-lg shadow-[0_12px_40px_rgba(8,13,24,0.9)] overflow-hidden">
          {/* Card Header */}
          <div className="p-6 bg-[#0B1220] border-b border-[#25364D] text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#16243A] border border-[#22D3EE]/40 text-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.25)] relative">
              <ShieldAlert className="w-7 h-7 text-[#22D3EE]" />
              <div className="absolute inset-0 rounded-full border border-[#22D3EE]/30 animate-ping pointer-events-none" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9] font-sans">
                SURAKSHA INTEL
              </h1>
              <p className="text-xs font-mono tracking-wider text-[#22D3EE] font-semibold">
                CYBER THREAT OPERATIONS CENTER
              </p>
              <p className="text-[11px] text-[#94A3B8] font-mono">
                Observe. Analyse. Protect.
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between text-xs font-mono border-b border-[#25364D]/60 pb-2.5">
              <span className="text-[#94A3B8] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" />
                ADMIN INTEL CLEARANCE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#16243A] text-[#34D399] border border-[#34D399]/30 font-bold">
                ENCRYPTED
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Only Password Field */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="admin-password" 
                  className="text-xs font-mono text-[#F1F5F9] font-medium flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Security Clearance Passcode</span>
                </label>

                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter security passcode..."
                    autoFocus
                    autoComplete="current-password"
                    className={`w-full bg-[#080D18] border rounded px-3.5 py-3 text-sm text-[#F1F5F9] font-mono outline-none tracking-wider placeholder:text-[#94A3B8]/40 transition-colors ${
                      error 
                        ? 'border-[#FB7185] focus:border-[#FB7185] shadow-[0_0_12px_rgba(251,113,133,0.2)]' 
                        : 'border-[#25364D] focus:border-[#22D3EE] focus:shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F1F5F9] p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-1.5 p-2.5 rounded bg-[#FB7185]/15 border border-[#FB7185]/40 text-[#FB7185] text-xs font-mono animate-in fade-in duration-150">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 px-4 rounded bg-[#22D3EE] hover:bg-[#5de0f5] text-[#080D18] font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 shadow-[0_0_16px_rgba(34,211,238,0.35)] disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#080D18] border-t-transparent rounded-full animate-spin" />
                    <span>VERIFYING CLEARANCE...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>AUTHENTICATE & REDIRECT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="p-3 bg-[#090E19] border-t border-[#25364D] text-center text-[10px] font-mono text-[#94A3B8]/70">
            PROTECTED SYSTEM · CITIZEN SAFETY THREAT INTELLIGENCE
          </div>
        </div>
      </main>

      {/* Footer System Status */}
      <footer className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between py-3 border-t border-[#25364D]/60 text-[11px] font-mono text-[#94A3B8] gap-2">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
          <span>SURAKSHA AI SECURITY OPERATIONS CENTER</span>
        </div>
        <div>
          TERMINAL PROTOCOL: <strong className="text-[#F1F5F9]">TLS 1.3 / ECDHE-RSA</strong>
        </div>
      </footer>
    </div>
  );
};
