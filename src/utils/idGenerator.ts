/**
 * Guaranteed unique ID generator for threat events, audit logs, and citizen sessions.
 * Prevents key collision errors across React rendering cycles and automated generation bursts.
 */

let eventCounter = 10000;
let logCounter = 1000;
let sessionCounter = 5000;

const seenIds = new Set<string>();

export function registerExistingId(id: string): void {
  seenIds.add(id);
}

export function getUniqueEventId(): string {
  let id: string;
  do {
    eventCounter += 1;
    const timePart = Date.now().toString(36).slice(-4).toUpperCase();
    id = `EVT-SEC-${eventCounter}-${timePart}`;
  } while (seenIds.has(id));
  seenIds.add(id);
  return id;
}

export function getUniqueLogId(): string {
  let id: string;
  do {
    logCounter += 1;
    const timePart = Date.now().toString(36).slice(-3).toUpperCase();
    id = `LOG-${logCounter}-${timePart}`;
  } while (seenIds.has(id));
  seenIds.add(id);
  return id;
}

export function getUniqueSessionId(): string {
  let id: string;
  do {
    sessionCounter += 1;
    const timePart = Date.now().toString(36).slice(-4).toUpperCase();
    id = `SEC-SESSION-${sessionCounter}-${timePart}`;
  } while (seenIds.has(id));
  seenIds.add(id);
  return id;
}
