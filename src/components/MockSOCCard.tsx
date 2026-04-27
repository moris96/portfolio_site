"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, Zap, X, Terminal } from "lucide-react";

type LogSeverity = "INFO" | "WARN" | "CRITICAL";

interface LogEntry {
  id: number;
  timestamp: string;
  src_ip: string;
  status_code: number;
  geo_loc: string;
  event: string;
  severity: LogSeverity;
}

// Benign geo locations — legitimate traffic sources only
const BENIGN_GEOS = ["US/NY", "DE/Berlin", "NL/Amsterdam", "BR/São Paulo", "GB/London", "CA/Toronto", "AU/Sydney", "FR/Paris"];

// High-risk state-actor origins — ALWAYS treated as suspicious/malicious
// KP = DPRK (Lazarus Group), RU = APT28/Sandworm, CN = APT41, IR = APT35
const HIGH_RISK_GEOS = ["KP/Pyongyang", "RU/Moscow", "CN/Beijing", "IR/Tehran"];
const NORMAL_EVENTS = [
  "GET /index.html 200",
  "GET /api/health 200",
  "POST /api/login 200",
  "GET /static/main.css 304",
  "GET /robots.txt 200",
];
const ATTACK_EVENTS: { event: string; severity: LogSeverity; status: number }[] = [
  { event: "POST /api/login 401 [BRUTE FORCE DETECTED]", severity: "CRITICAL", status: 401 },
  { event: "GET /../../../etc/passwd [DIR TRAVERSAL]", severity: "CRITICAL", status: 403 },
  { event: "GET /wp-admin/login.php [SCANNING]", severity: "WARN", status: 404 },
  { event: "POST /xmlrpc.php [EXPLOIT ATTEMPT]", severity: "CRITICAL", status: 403 },
  { event: "GET /api/login 401 [CRED STUFFING]", severity: "CRITICAL", status: 401 },
  { event: "GET /.env [RECON PROBE]", severity: "WARN", status: 403 },
  { event: "PUT /api/admin/users [UNAUTH ACCESS]", severity: "CRITICAL", status: 403 },
  { event: "GET /admin/config.php [SCANNING]", severity: "WARN", status: 404 },
];

function randomIp(malicious = false) {
  if (malicious) {
    // Known TOR exit nodes, APT infrastructure, and state-sponsored IPs
    const suspects = ["185.220.101.47", "45.155.205.233", "199.195.249.79", "23.129.64.218", "175.45.176.0", "210.52.109.22"];
    return suspects[Math.floor(Math.random() * suspects.length)];
  }
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function nowTimestamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

let _idCounter = 0;
function makeNormalLog(): LogEntry {
  return {
    id: _idCounter++,
    timestamp: nowTimestamp(),
    src_ip: randomIp(),
    status_code: 200,
    // Only benign geos for normal traffic — state-actor origins are never "INFO"
    geo_loc: BENIGN_GEOS[Math.floor(Math.random() * BENIGN_GEOS.length)],
    event: NORMAL_EVENTS[Math.floor(Math.random() * NORMAL_EVENTS.length)],
    severity: "INFO",
  };
}

function makeAttackLog(): LogEntry {
  const atk = ATTACK_EVENTS[Math.floor(Math.random() * ATTACK_EVENTS.length)];
  return {
    id: _idCounter++,
    timestamp: nowTimestamp(),
    src_ip: randomIp(true),
    status_code: atk.status,
    // Attack traffic is routed through high-risk state-actor geos
    geo_loc: HIGH_RISK_GEOS[Math.floor(Math.random() * HIGH_RISK_GEOS.length)],
    event: atk.event,
    severity: atk.severity,
  };
}

const SEVERITY_STYLES: Record<LogSeverity, string> = {
  INFO: "text-neutral-500",
  WARN: "text-yellow-500",
  CRITICAL: "text-red-500",
};

const STATUS_STYLES: Record<number, string> = {};
function getStatusStyle(code: number) {
  if (code >= 200 && code < 300) return "text-green-500";
  if (code >= 300 && code < 400) return "text-blue-400";
  if (code >= 400) return "text-red-400";
  return "text-neutral-400";
}

export default function MockSOCCard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [chaosActive, setChaosActive] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const chaosTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addLog = useCallback((log: LogEntry) => {
    setLogs((prev) => [log, ...prev].slice(0, 80));
    if (log.severity === "CRITICAL") {
      setAlertMsg(`CRITICAL: ${log.event} — src: ${log.src_ip} [${log.geo_loc}]`);
      setAlertVisible(true);
    }
  }, []);

  // Normal ambient traffic
  useEffect(() => {
    const interval = setInterval(() => {
      addLog(makeNormalLog());
    }, 1800);
    return () => clearInterval(interval);
  }, [addLog]);

  // Chaos mode: rapid attack burst
  const triggerChaos = () => {
    if (chaosActive) return;
    setChaosActive(true);
    let count = 0;
    const burst = setInterval(() => {
      addLog(makeAttackLog());
      count++;
      if (count >= 12) {
        clearInterval(burst);
        chaosTimerRef.current = setTimeout(() => setChaosActive(false), 1500);
      }
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (chaosTimerRef.current) clearTimeout(chaosTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full font-mono text-xs">
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-neutral-500 text-[11px] tracking-widest uppercase">SentinelSimulation v1.0 — Live Feed</span>
        </div>
        <motion.button
          id="chaos-button"
          onClick={triggerChaos}
          disabled={chaosActive}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-[11px] font-medium transition-all ${
            chaosActive
              ? "border-red-800 bg-red-950 text-red-400 cursor-not-allowed animate-pulse"
              : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-red-700 hover:text-red-400 cursor-pointer"
          }`}
        >
          <Zap className="w-3 h-3" />
          {chaosActive ? "ATTACK IN PROGRESS..." : "Chaos Mode"}
        </motion.button>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[110px_120px_60px_70px_1fr] gap-2 px-2 py-1 border-b border-neutral-800 text-[10px] text-neutral-600 uppercase tracking-wider mb-1">
        <span>Timestamp</span>
        <span>Src IP</span>
        <span>Status</span>
        <span>Geo</span>
        <span>Event</span>
      </div>

      {/* Log Feed */}
      <div
        ref={feedRef}
        className="h-52 overflow-y-auto overflow-x-hidden space-y-0.5 pr-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#1f1f1f transparent" }}
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className={`grid grid-cols-[110px_120px_60px_70px_1fr] gap-2 px-2 py-0.5 rounded-sm hover:bg-neutral-900/60 ${
                log.severity === "CRITICAL" ? "bg-red-950/20" : log.severity === "WARN" ? "bg-yellow-950/20" : ""
              }`}
            >
              <span className="text-neutral-600 truncate">{log.timestamp.slice(11)}</span>
              <span className={`truncate ${log.severity !== "INFO" ? "text-red-400" : "text-neutral-400"}`}>{log.src_ip}</span>
              <span className={getStatusStyle(log.status_code)}>{log.status_code}</span>
              <span className="text-neutral-500 truncate">{log.geo_loc}</span>
              <span className={`truncate ${SEVERITY_STYLES[log.severity]}`}>{log.event}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="flex items-center justify-center h-full text-neutral-700">Initializing engine...</div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 px-1">
        <span className="flex items-center gap-1 text-[10px] text-neutral-600"><span className="w-1.5 h-1.5 rounded-full bg-neutral-600 inline-block" />INFO</span>
        <span className="flex items-center gap-1 text-[10px] text-yellow-700"><span className="w-1.5 h-1.5 rounded-full bg-yellow-700 inline-block" />WARN</span>
        <span className="flex items-center gap-1 text-[10px] text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-700 inline-block" />CRITICAL</span>
        <span className="ml-auto text-[10px] text-neutral-700">{logs.length} events</span>
      </div>

      {/* Critical Alert Modal */}
      <AnimatePresence>
        {alertVisible && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-4 left-4 right-4 z-50 bg-red-950/90 border border-red-800 rounded-lg p-3 flex items-start gap-3 backdrop-blur-sm shadow-lg shadow-red-950/50"
          >
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-0.5">⚠ Critical Alert</p>
              <p className="text-[11px] text-red-300 truncate">{alertMsg}</p>
            </div>
            <button
              onClick={() => setAlertVisible(false)}
              className="text-red-600 hover:text-red-300 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
