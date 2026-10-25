import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  SimulatedEvent, 
  ScamPattern, 
  CitizenSession, 
  NetworkNode, 
  AuditLogEntry, 
  SimulationConfig, 
  ScamCategory, 
  RiskLevel 
} from '../types/threat';
import { 
  INITIAL_PATTERNS, 
  INITIAL_EVENTS, 
  INITIAL_CITIZEN_SESSIONS, 
  INITIAL_NETWORK_NODES, 
  INITIAL_AUDIT_LOGS,
  calculateRadarCoordinates 
} from '../data/initialData';
import { soundEffects } from '../services/soundEffects';
import { getUniqueEventId, getUniqueLogId, getUniqueSessionId, registerExistingId } from '../utils/idGenerator';

// Register initial fixtures
INITIAL_EVENTS.forEach(e => registerExistingId(e.id));
INITIAL_CITIZEN_SESSIONS.forEach(s => registerExistingId(s.id));
INITIAL_AUDIT_LOGS.forEach(l => registerExistingId(l.id));

interface SimulationContextValue {
  events: SimulatedEvent[];
  patterns: ScamPattern[];
  citizenSessions: CitizenSession[];
  networkNodes: NetworkNode[];
  auditLogs: AuditLogEntry[];
  selectedEvent: SimulatedEvent | null;
  selectedPattern: ScamPattern | null;
  selectedNode: NetworkNode | null;
  config: SimulationConfig;
  eventsGeneratedInSession: number;
  
  // Actions
  toggleSimulation: () => void;
  setSpeedMultiplier: (speed: number) => void;
  setRadarAnimation: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAutoIntervalSeconds: (seconds: number) => void;
  setShowScanlines: (show: boolean) => void;
  
  generateEvent: (category?: ScamCategory, risk?: RiskLevel, customTitle?: string, customDesc?: string) => SimulatedEvent;
  generateBatch: (count: number) => void;
  togglePattern: (patternId: string) => void;
  resetSimulation: () => void;
  
  selectEvent: (event: SimulatedEvent | null) => void;
  selectPattern: (pattern: ScamPattern | null) => void;
  selectNode: (node: NetworkNode | null) => void;
  
  exportEventsCSV: () => void;
  exportAuditLogsCSV: () => void;
  addAuditLog: (action: string, detail: string, relatedId?: string) => void;
}

const SimulationContext = createContext<SimulationContextValue | undefined>(undefined);

const SCENARIO_TEMPLATES: Record<ScamCategory, {
  titles: string[];
  descriptions: string[];
  signals: string[][];
  actions: string[];
  samples: string[];
  patterns: string[];
}> = {
  'phishing': {
    titles: [
      'NetBanking Credential Probe Intercept',
      'SIM Biometric KYC Deactivation Notice',
      'Overdue Utility Power Disconnection Alert',
      'Deceptive Tax Refund Deposit Form',
    ],
    descriptions: [
      'Phishing vector impersonating financial institution using uncertified dynamic subdomains.',
      'Citizen received SMS threatening immediate SIM deactivation within 60 minutes unless OTP is verified.',
      'Lookalike utility portal requesting full card number and CVV to clear fictional ₹12 penalty.',
      'Deceptive income tax refund portal harvesting NetBanking user IDs and transaction passwords.',
    ],
    signals: [
      ['Typo-squatted URL domain', 'Urgent countdown timer', 'Requests card CVV & MPIN', 'Unverified SMS gateway'],
      ['Threat of immediate SIM blocking', 'Demands SMS OTP verification', 'High-pressure wording', 'Non-telecom phone number'],
      ['Punycode character spoofing', 'Unsecured HTTP endpoint', 'Generic unpersonalized greeting', 'Mismatched SSL certificate']
    ],
    actions: [
      'Never enter credentials or OTPs on links sent via SMS. Verify directly on official bank portal.',
      'Telecom operators never demand OTPs to prevent disconnection. Report to 1930.',
      'Check utility bills on official state electricity board app or trusted payment aggregators.',
    ],
    samples: [
      'SMS: "Dear customer, your KYC is incomplete. Update now at http://secure-netbank-auth.vip or services terminate tonight."',
      'SMS: "Electricity bill overdue by ₹450. Connection will be cut at 8:00 PM. Pay via http://power-clearing.online"',
    ],
    patterns: ['URL-PHISH-003', 'OTP-REQ-002'],
  },
  'fake-job': {
    titles: [
      'Remote Video Reviewer Advance Fee Scheme',
      'Part-Time Product Liker Commission Bait',
      'International Ground Staff Hiring Trap',
    ],
    descriptions: [
      'Unsolicited recruiter offered ₹5,000 daily wage for reviewing trailers, asking ₹850 security deposit.',
      'Victim given initial ₹120 demo profit on Telegram, followed by demand for ₹3,000 prepaid tier upgrade.',
      'Fictional airport staffing agency issued fake appointment letter requiring ₹2,500 uniform bond.',
    ],
    signals: [
      ['Demands advance onboarding fee', 'Telegram-only supervisor contact', 'Guaranteed unrealistic daily earnings', 'Grammatical inconsistencies'],
      ['Initial small bait credit', 'Escalating deposit requirements', 'No physical office or registered CIN', 'High-pressure quota countdown'],
    ],
    actions: [
      'Legitimate employers never demand upfront fees or equipment deposits. Reject and block contact.',
      'Beware of task groups; cease engagement and do not transfer further funds.',
    ],
    samples: [
      'WhatsApp: "Earn ₹300-₹500 per video liked. Instant payout. Deposit ₹500 refundable trial kit fee to register."',
      'Telegram: "VIP Level 3 unlocked! Deposit ₹4,000 to withdraw your accumulated commission of ₹14,200."',
    ],
    patterns: ['JOB-FEE-001'],
  },
  'upi-fraud': {
    titles: [
      'Reverse QR Code Marketplace Purchase Scam',
      'UPI Autopay Mandate Misrepresentation',
      'Wrong Account Credit Refund Extortion',
    ],
    descriptions: [
      'Buyer claimed to be purchasing second-hand appliance, sending QR code falsely labeled "Scan to Receive ₹12,000".',
      'Fraudster initiated high-value recurring Autopay mandate disguised as a cashback voucher.',
      'Caller claimed ₹25,000 was mistakenly transferred to user and demanded instant refund via UPI.',
    ],
    signals: [
      ['Requires entering UPI PIN to receive money', 'Forged bank balance notification screenshot', 'Urgent demand to scan QR code', 'Refuses cash settlement'],
      ['Autopay mandate amount disguised in merchant name', 'High frequency collect requests', 'Unverified VPA handle'],
    ],
    actions: [
      'Entering your UPI PIN ALWAYS deducts money from your account. You NEVER need a PIN to receive payments.',
      'Decline unknown UPI collect requests and mandate authorizations in PhonePe, Google Pay, or Paytm.',
    ],
    samples: [
      'QR Code label: "Merchant Refund Authorization — Input UPI PIN to verify and accept ₹8,500."',
      'Collect Request: "VPA request of ₹9,999 from Merchant-Settlement. Enter PIN to accept."',
    ],
    patterns: ['UPI-REQ-005'],
  },
  'fake-loan': {
    titles: [
      'Paperless Instant Loan Processing Advance Lure',
      'Forged Micro-Finance Sanction Letter Scheme',
      'Low-Interest Emergency Credit Trap',
    ],
    descriptions: [
      'Instant loan app offered ₹2,00,000 with 1% interest, demanding ₹1,800 insurance clearance deposit.',
      'Forged sanction certificate bearing government emblem demanding GST processing advance.',
      'Unsolicited WhatsApp loan approval with threats of legal notices if processing fee is withheld.',
    ],
    signals: [
      ['Zero credit check or documentation required', 'Mandatory advance deposit before disbursal', 'Non-NBFC unregistered entity', 'Forged regulatory seals'],
      ['Personal savings account provided for processing fee', 'High-pressure deadline', 'Aggressive tone in communications'],
    ],
    actions: [
      'Genuine registered NBFCs and banks deduct processing charges from the loan disbursal amount. Never pay upfront.',
      'Verify NBFC registration on the official Reserve Bank of India (RBI) website before sharing documents.',
    ],
    samples: [
      'Sanction Letter PDF: "Approved Loan Amount: ₹4,00,000. Disbursal requires payment of 18% GST (₹1,999) upfront."',
      'WhatsApp: "Your loan file #8921 is ready for release. Send ₹1,499 stamp duty to activate RTGS transfer."',
    ],
    patterns: ['LOAN-ADV-004'],
  },
  'impersonation': {
    titles: [
      'Digital Arrest Video Call Extortion Attack',
      'Fake Customs Contraband Parcel Seizure Trap',
      'High Court Contempt Notice Audio Coercion',
    ],
    descriptions: [
      'Perpetrators claimed victim\'s identity was used in illegal international contraband syndicate.',
      'Caller posing as customs official at airport claimed seized courier contained passports and illegal chemicals.',
      'Fraudulent audio call demanding transfer to "National Verification Reserve Account" to avoid detention.',
    ],
    signals: [
      ['Demands staying on continuous video call', 'Threatens immediate arrest warrant', 'Displays forged police insignia and uniforms', 'Instructs secrecy from family'],
      ['Directs transfer to "safe holding account"', 'Refuses local police station verification', 'Manufactured urgency and fear'],
    ],
    actions: [
      'Hang up immediately. "Digital Arrest" does not exist under Indian or international law. Police never conduct video interrogations.',
      'Report extortion attempts immediately to national cybercrime helpline 1930.',
    ],
    samples: [
      'Skype: "Officer Vinod Kumar (Crime Branch): You are under virtual arrest. Do not disconnect until formal statement is recorded."',
      'Voice Call: "Customs Delhi: Parcel DHL-9812 intercepted with illegal items registered in your name."',
    ],
    patterns: ['IMPERSON-006'],
  },
  'investment': {
    titles: [
      'Guaranteed Returns Algorithmic Arbitrage Syndicate',
      'Pre-IPO Institutional Allocation Funnel Trap',
      'High-Yield Crypto Currency Pool Advisory',
    ],
    descriptions: [
      'Victim invited to messaging group showing manipulated screenshots of members earning 250% weekly gains.',
      'Fake institutional portal allowed initial deposit of ₹10,000, but blocked withdrawal demanding ₹25,000 tax clearance.',
      'Celebrity deepfake video endorsing proprietary quantum trading platform with guaranteed daily yields.',
    ],
    signals: [
      ['Guaranteed high returns with zero risk claim', 'Bait withdrawals permitted initially', 'Withdrawal blocked behind "tax clearance fee"', 'Unregulated overseas trading terminal'],
      ['Celebrity deepfake endorsement', 'Anonymous group admins', 'High pressure to reinvest profits'],
    ],
    actions: [
      'No legitimate investment platform guarantees fixed extraordinary returns. Always verify SEBI registration.',
      'Do not transfer money to individual personal accounts for stock or crypto investments.',
    ],
    samples: [
      'VIP Group: "Daily returns today: +14.2%. Transfer minimum ₹15,000 to master wallet to participate in tonight\'s block trade."',
      'Portal Prompt: "Withdrawal of ₹85,000 pending. Remit 20% Capital Gains Duty (₹17,000) to unlock funds."',
    ],
    patterns: ['INVEST-007'],
  },
  'remote-access': {
    titles: [
      'Technical Support Screen Sharing Device Hijack',
      'Banking App Security Patch Diagnostic Lure',
      'Device Diagnostics Malicious APK Warning',
    ],
    descriptions: [
      'Scammer claimed victim\'s device was transmitting banking trojans, instructing installation of AnyDesk/TeamViewer.',
      'Fraudster guided user to download "Security Patch APK" which requested Accessibility and Notification permissions.',
      'Caller instructed user to open mobile banking while screen sharing was active to "clear cache".',
    ],
    signals: [
      ['Instructs installing remote screen-sharing tool', 'Requests 9-digit remote access session key', 'Instructs opening banking or UPI app during call', 'Attempts to obscure screen'],
      ['Demands Accessibility service permissions', 'Requests Notification listener access to steal 2FA codes'],
    ],
    actions: [
      'Never install remote-access apps or share session codes with unknown callers. Bank employees never request screen sharing.',
      'If code was shared, immediately disconnect Wi-Fi/data, uninstall the remote tool, and alert your bank.',
    ],
    samples: [
      'Caller: "Download QuickSupport from Play Store and read me the 9-digit Partner ID so our technician can clear your banking error."',
      'SMS: "Critical vulnerability detected on Android device. Install FixTool.apk from http://device-patch.xyz"',
    ],
    patterns: ['REMOTE-008'],
  },
};

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<SimulatedEvent[]>(INITIAL_EVENTS);
  const [patterns, setPatterns] = useState<ScamPattern[]>(INITIAL_PATTERNS);
  const [citizenSessions, setCitizenSessions] = useState<CitizenSession[]>(INITIAL_CITIZEN_SESSIONS);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>(INITIAL_NETWORK_NODES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  
  const [selectedEvent, setSelectedEvent] = useState<SimulatedEvent | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<ScamPattern | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  
  const [eventsGeneratedInSession, setEventsGeneratedInSession] = useState<number>(0);

  const [config, setConfig] = useState<SimulationConfig>({
    isRunning: true,
    speedMultiplier: 1,
    radarAnimation: true,
    soundEnabled: false, // Default quiet to avoid unexpected audio
    autoIntervalSeconds: 6,
    showScanlines: true,
    activeCategoryFilter: 'all',
    activeRiskFilter: 'all',
  });

  const addAuditLog = useCallback((action: string, detail: string, relatedId?: string) => {
    const newLog: AuditLogEntry = {
      id: getUniqueLogId(),
      timestamp: new Date().toISOString(),
      action,
      detail,
      relatedId,
      source: 'SOC_CONSOLE',
    };
    setAuditLogs(prev => {
      if (prev.some(l => l.id === newLog.id)) return prev;
      return [newLog, ...prev.slice(0, 99)];
    });
  }, []);

  const generateEvent = useCallback((
    categoryParam?: ScamCategory,
    riskParam?: RiskLevel,
    customTitle?: string,
    customDesc?: string
  ): SimulatedEvent => {
    // Determine enabled patterns
    const enabledPatterns = patterns.filter(p => p.enabled);
    const availableCategories: ScamCategory[] = Array.from(
      new Set(enabledPatterns.map(p => p.category))
    );

    // Pick category
    let chosenCategory: ScamCategory = categoryParam || (
      availableCategories.length > 0 
        ? availableCategories[Math.floor(Math.random() * availableCategories.length)]
        : 'phishing'
    );

    // Check templates
    const template = SCENARIO_TEMPLATES[chosenCategory] || SCENARIO_TEMPLATES['phishing'];
    const titleIndex = Math.floor(Math.random() * template.titles.length);
    const descIndex = Math.floor(Math.random() * template.descriptions.length);
    const signalIndex = Math.floor(Math.random() * template.signals.length);
    const actionIndex = Math.floor(Math.random() * template.actions.length);
    const sampleIndex = Math.floor(Math.random() * template.samples.length);

    // Match with corresponding pattern
    const patternCandidates = enabledPatterns.filter(p => p.category === chosenCategory);
    const matchedPattern = patternCandidates[0] || patterns.find(p => p.category === chosenCategory) || patterns[0];

    // Determine risk
    let chosenRisk: RiskLevel = riskParam || matchedPattern.configuredRisk;
    if (!riskParam && Math.random() > 0.7) {
      chosenRisk = 'critical';
    }

    const eventId = getUniqueEventId();
    const timestamp = new Date().toISOString();
    const coords = calculateRadarCoordinates(eventId);

    const newEvent: SimulatedEvent = {
      id: eventId,
      timestamp,
      category: chosenCategory,
      risk: chosenRisk,
      patternId: matchedPattern.id,
      patternName: matchedPattern.name,
      title: customTitle || template.titles[titleIndex],
      description: customDesc || template.descriptions[descIndex],
      matchedSignals: template.signals[signalIndex],
      citizenSafetyAction: template.actions[actionIndex],
      rawSample: template.samples[sampleIndex],
      forensicDetails: {
        originChannel: 'Active Ingress Telemetry',
        targetVector: matchedPattern.name,
        confidenceScore: Number((0.85 + Math.random() * 0.14).toFixed(2)),
        urgencyIndicator: chosenRisk === 'critical' ? 'Urgent / Immediate Action' : 'Elevated Caution',
        financialLure: 'Threat Model Signature',
      },
      source: 'SURAKSHA HEURISTIC ENGINE',
      radarCoords: coords,
      status: chosenRisk === 'critical' ? 'flagged' : 'analyzed',
    };

    setEvents(prev => {
      if (prev.some(e => e.id === newEvent.id)) return prev;
      return [newEvent, ...prev.slice(0, 99)];
    });
    setEventsGeneratedInSession(prev => prev + 1);

    // Also update citizen session telemetry
    const sessionActions: CitizenSession['actionType'][] = [
      'Suspicious Message Scan',
      'URL Security Verification',
      'Interactive Threat Drill',
      'APK Permission Audit',
      'Reporting Guidance Opened'
    ];
    const newSession: CitizenSession = {
      id: getUniqueSessionId(),
      timestamp,
      actionType: sessionActions[Math.floor(Math.random() * sessionActions.length)],
      analysisType: `${chosenCategory.toUpperCase()} Signature Correlation`,
      riskReturned: chosenRisk,
      sessionStatus: chosenRisk === 'critical' ? 'Blocked' : 'Flagged',
      details: newEvent.title,
      citizenGuidance: newEvent.citizenSafetyAction,
    };
    setCitizenSessions(prev => {
      if (prev.some(s => s.id === newSession.id)) return prev;
      return [newSession, ...prev.slice(0, 49)];
    });

    // Sound effect
    if (chosenRisk === 'critical') {
      soundEffects.playAlert(config.soundEnabled);
    } else {
      soundEffects.playClick(config.soundEnabled);
    }

    addAuditLog('Threat Incident Detected', `${newEvent.id} (${newEvent.category.toUpperCase()}) - ${newEvent.title}`, newEvent.id);

    return newEvent;
  }, [patterns, config.soundEnabled, addAuditLog]);

  const generateBatch = useCallback((count: number) => {
    for (let i = 0; i < count; i++) {
      generateEvent();
    }
    soundEffects.playAlert(config.soundEnabled);
    addAuditLog('Incident Burst Recorded', `Ingress surge of ${count} threat events logged.`);
  }, [generateEvent, config.soundEnabled, addAuditLog]);

  const toggleSimulation = useCallback(() => {
    setConfig(prev => {
      const nextState = !prev.isRunning;
      soundEffects.playSwitch(prev.soundEnabled);
      addAuditLog(
        nextState ? 'Stream Engaged' : 'Stream Paused',
        `Telemetry ingestion stream ${nextState ? 'engaged' : 'halted'} by operator.`
      );
      return { ...prev, isRunning: nextState };
    });
  }, [addAuditLog]);

  const setSpeedMultiplier = useCallback((speed: number) => {
    setConfig(prev => {
      soundEffects.playClick(prev.soundEnabled);
      addAuditLog('Speed Multiplier Adjusted', `Telemetry ingestion pace set to ${speed}x.`);
      return { ...prev, speedMultiplier: speed };
    });
  }, [addAuditLog]);

  const setRadarAnimation = useCallback((enabled: boolean) => {
    setConfig(prev => {
      soundEffects.playSwitch(prev.soundEnabled);
      return { ...prev, radarAnimation: enabled };
    });
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setConfig(prev => {
      if (enabled) {
        soundEffects.playClick(true);
      }
      return { ...prev, soundEnabled: enabled };
    });
  }, []);

  const setAutoIntervalSeconds = useCallback((seconds: number) => {
    setConfig(prev => ({ ...prev, autoIntervalSeconds: seconds }));
  }, []);

  const setShowScanlines = useCallback((show: boolean) => {
    setConfig(prev => ({ ...prev, showScanlines: show }));
  }, []);

  const togglePattern = useCallback((patternId: string) => {
    setPatterns(prev => {
      const updated = prev.map(p => {
        if (p.id === patternId) {
          const nextVal = !p.enabled;
          addAuditLog(
            nextVal ? 'Signature Enabled' : 'Signature Muted',
            `Signature ${p.id} (${p.name}) set to ${nextVal ? 'ACTIVE' : 'MUTED'} in heuristic engine.`,
            p.id
          );
          return { ...p, enabled: nextVal };
        }
        return p;
      });
      return updated;
    });
    soundEffects.playSwitch(config.soundEnabled);
  }, [addAuditLog, config.soundEnabled]);

  const resetSimulation = useCallback(() => {
    setEvents(INITIAL_EVENTS);
    setPatterns(INITIAL_PATTERNS);
    setCitizenSessions(INITIAL_CITIZEN_SESSIONS);
    setNetworkNodes(INITIAL_NETWORK_NODES);
    setSelectedEvent(null);
    setSelectedPattern(null);
    setSelectedNode(null);
    setEventsGeneratedInSession(0);
    soundEffects.playAlert(config.soundEnabled);
    addAuditLog('System Reset', 'Telemetry memory purged and baseline catalog reloaded.');
  }, [config.soundEnabled, addAuditLog]);

  // Periodic automated event generation
  useEffect(() => {
    if (!config.isRunning) return;

    const intervalMs = Math.max(1200, (config.autoIntervalSeconds * 1000) / config.speedMultiplier);
    const timer = setInterval(() => {
      generateEvent();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [config.isRunning, config.autoIntervalSeconds, config.speedMultiplier, generateEvent]);

  // Export Events as CSV
  const exportEventsCSV = useCallback(() => {
    const headers = ['EventID', 'Timestamp', 'Category', 'Risk', 'PatternID', 'PatternName', 'Title', 'Description', 'CitizenSafetyAction', 'Source'];
    const rows = events.map(e => [
      e.id,
      e.timestamp,
      e.category,
      e.risk,
      e.patternId,
      `"${e.patternName.replace(/"/g, '""')}"`,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${e.citizenSafetyAction.replace(/"/g, '""')}"`,
      e.source,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `suraksha_intel_threats_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('CSV Telemetry Exported', `Exported ${events.length} threat incident records.`);
  }, [events, addAuditLog]);

  // Export Audit Logs as CSV
  const exportAuditLogsCSV = useCallback(() => {
    const headers = ['LogID', 'Timestamp', 'Action', 'Detail', 'RelatedID', 'Source'];
    const rows = auditLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.detail.replace(/"/g, '""')}"`,
      l.relatedId || '',
      l.source,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `suraksha_intel_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [auditLogs]);

  const value = useMemo(() => ({
    events,
    patterns,
    citizenSessions,
    networkNodes,
    auditLogs,
    selectedEvent,
    selectedPattern,
    selectedNode,
    config,
    eventsGeneratedInSession,
    toggleSimulation,
    setSpeedMultiplier,
    setRadarAnimation,
    setSoundEnabled,
    setAutoIntervalSeconds,
    setShowScanlines,
    generateEvent,
    generateBatch,
    togglePattern,
    resetSimulation,
    selectEvent: setSelectedEvent,
    selectPattern: setSelectedPattern,
    selectNode: setSelectedNode,
    exportEventsCSV,
    exportAuditLogsCSV,
    addAuditLog,
  }), [
    events,
    patterns,
    citizenSessions,
    networkNodes,
    auditLogs,
    selectedEvent,
    selectedPattern,
    selectedNode,
    config,
    eventsGeneratedInSession,
    toggleSimulation,
    setSpeedMultiplier,
    setRadarAnimation,
    setSoundEnabled,
    setAutoIntervalSeconds,
    setShowScanlines,
    generateEvent,
    generateBatch,
    togglePattern,
    resetSimulation,
    exportEventsCSV,
    exportAuditLogsCSV,
    addAuditLog,
  ]);

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
