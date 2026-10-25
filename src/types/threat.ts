export type ScamCategory = 
  | 'phishing'
  | 'fake-job'
  | 'upi-fraud'
  | 'fake-loan'
  | 'impersonation'
  | 'investment'
  | 'remote-access';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface SimulatedEvent {
  id: string;
  timestamp: string; // ISO string
  category: ScamCategory;
  risk: RiskLevel;
  patternId: string;
  patternName: string;
  title: string;
  description: string;
  matchedSignals: string[];
  citizenSafetyAction: string;
  rawSample: string;
  forensicDetails: {
    originChannel: string;
    targetVector: string;
    confidenceScore: number;
    urgencyIndicator: string;
    financialLure?: string;
  };
  source: string; // e.g., "SURAKSHA HEURISTIC ENGINE"
  radarCoords: {
    angle: number; // 0 - 360
    distance: number; // 0.15 - 0.95 (normalized radius)
  };
  status: 'analyzed' | 'flagged' | 'mitigated';
}

export interface ScamPattern {
  id: string;
  name: string;
  category: ScamCategory;
  description: string;
  contributingSigns: string[];
  examplePayload: string;
  configuredRisk: RiskLevel;
  enabled: boolean;
}

export interface CitizenSession {
  id: string;
  timestamp: string;
  actionType: 
    | 'Suspicious Message Scan'
    | 'URL Security Verification'
    | 'Scam Awareness Lesson'
    | 'Interactive Threat Drill'
    | 'Reporting Guidance Opened'
    | 'APK Permission Audit';
  analysisType: string;
  riskReturned: RiskLevel;
  sessionStatus: 'Completed' | 'Ongoing' | 'Blocked' | 'Flagged';
  details: string;
  citizenGuidance: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  shortLabel: string;
  type: 'client' | 'service' | 'engine' | 'storage' | 'external';
  status: 'Operational' | 'Air-Gapped' | 'Online Gateway' | 'Encrypted Memory';
  statusType: 'active' | 'disconnected' | 'demo' | 'local';
  pingMs: number;
  uptime: string;
  role: string;
  demoLimitation: string;
  x: number;
  y: number;
  connections: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  relatedId?: string;
  source: 'SOC_CONSOLE';
}

export interface SimulationConfig {
  isRunning: boolean;
  speedMultiplier: number;
  radarAnimation: boolean;
  soundEnabled: boolean;
  autoIntervalSeconds: number;
  showScanlines: boolean;
  activeCategoryFilter: string;
  activeRiskFilter: string;
}
