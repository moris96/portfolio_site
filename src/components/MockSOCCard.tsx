"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Terminal, FileText } from "lucide-react";
import AlertQueue, { AlertItem } from "./soc/AlertQueue";
import IpModal from "./soc/IpModal";
import IncidentReport from "./soc/IncidentReport";

// ─── Types ───────────────────────────────────────────────────────────────────
type LogSeverity = "INFO" | "WARN" | "CRITICAL";

interface LogEntry {
  id: number;
  timestamp: string;
  src_ip: string;
  status_code: number;
  geo_loc: string;
  event: string;
  event_type: "FAILED_LOGIN" | "RECON" | "SUCCESS" | "EXPLOIT" | "SCAN";
  severity: LogSeverity;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const BENIGN_GEOS = ["US/NY", "DE/Berlin", "NL/Amsterdam", "BR/São Paulo", "GB/London", "CA/Toronto", "AU/Sydney", "FR/Paris"];
const HIGH_RISK_GEOS = ["KP/Pyongyang", "RU/Moscow", "CN/Beijing", "IR/Tehran"];
const SUSPECT_IPS = ["185.220.101.47", "45.155.205.233", "199.195.249.79", "23.129.64.218", "175.45.176.0", "210.52.109.22"];

const NORMAL_EVENTS: { event: string; event_type: LogEntry["event_type"] }[] = [
  { event: "GET /index.html", event_type: "SUCCESS" },
  { event: "GET /api/health", event_type: "SUCCESS" },
  { event: "POST /api/login", event_type: "SUCCESS" },
  { event: "GET /static/main.css", event_type: "SUCCESS" },
  { event: "GET /robots.txt", event_type: "SUCCESS" },
  { event: "GET /api/user/profile", event_type: "SUCCESS" },
];

const ATTACK_EVENTS: { event: string; event_type: LogEntry["event_type"]; severity: LogSeverity; status: number }[] = [
  { event: "POST /api/login — 401 Unauthorized", event_type: "FAILED_LOGIN", severity: "CRITICAL", status: 401 },
  { event: "GET /../../../etc/passwd — DIR TRAVERSAL", event_type: "RECON", severity: "CRITICAL", status: 403 },
  { event: "GET /wp-admin/login.php — SCANNING", event_type: "SCAN", severity: "WARN", status: 404 },
  { event: "POST /xmlrpc.php — EXPLOIT ATTEMPT", event_type: "EXPLOIT", severity: "CRITICAL", status: 403 },
  { event: "GET /api/login — 401 Unauthorized", event_type: "FAILED_LOGIN", severity: "CRITICAL", status: 401 },
  { event: "GET /.env — RECON PROBE", event_type: "RECON", severity: "WARN", status: 403 },
  { event: "PUT /api/admin/users — UNAUTH ACCESS", event_type: "EXPLOIT", severity: "CRITICAL", status: 403 },
  { event: "POST /api/auth — 401 Unauthorized", event_type: "FAILED_LOGIN", severity: "CRITICAL", status: 401 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function randomIp(malicious = false) {
  if (malicious) return SUSPECT_IPS[Math.floor(Math.random() * SUSPECT_IPS.length)];
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}
function nowTs() { return new Date().toISOString().replace("T", " ").slice(0, 19); }

let _id = 0;
let _alertId = 41;

function makeNormalLog(): LogEntry {
  const e = NORMAL_EVENTS[Math.floor(Math.random() * NORMAL_EVENTS.length)];
  return { id: _id++, timestamp: nowTs(), src_ip: randomIp(), status_code: 200, geo_loc: BENIGN_GEOS[Math.floor(Math.random() * BENIGN_GEOS.length)], event: e.event, event_type: e.event_type, severity: "INFO" };
}
function makeAttackLog(): LogEntry {
  const atk = ATTACK_EVENTS[Math.floor(Math.random() * ATTACK_EVENTS.length)];
  return { id: _id++, timestamp: nowTs(), src_ip: randomIp(true), status_code: atk.status, geo_loc: HIGH_RISK_GEOS[Math.floor(Math.random() * HIGH_RISK_GEOS.length)], event: atk.event, event_type: atk.event_type, severity: atk.severity };
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const EVENT_TYPE_STYLES: Record<LogEntry["event_type"], string> = {
  SUCCESS: "text-green-500 bg-green-950/40 border-green-900/50",
  FAILED_LOGIN: "text-red-400 bg-red-950/40 border-red-900/50",
  RECON: "text-orange-400 bg-orange-950/40 border-orange-900/50",
  EXPLOIT: "text-red-500 bg-red-950/60 border-red-800/60",
  SCAN: "text-yellow-400 bg-yellow-950/40 border-yellow-900/50",
};

function statusColor(code: number, chaos: boolean) {
  if (code === 401 && chaos) return "text-red-400 font-bold animate-pulse drop-shadow-[0_0_6px_rgba(248,113,113,0.8)]";
  if (code >= 200 && code < 300) return "text-green-500";
  if (code >= 300 && code < 400) return "text-blue-400";
  if (code >= 400) return "text-red-400";
  return "text-neutral-400";
}

function EventCell({ event, chaos }: { event: string; chaos: boolean }) {
  if (!chaos) return <span>{event}</span>;
  const parts = event.split(/(401 Unauthorized)/g);
  return (
    <>
      {parts.map((p, i) =>
        p === "401 Unauthorized" ? (
          <span key={i} className="text-red-400 font-bold drop-shadow-[0_0_8px_rgba(248,113,113,0.9)] animate-pulse">{p}</span>
        ) : <span key={i}>{p}</span>
      )}
    </>
  );
}

const MAX_LOGS = 120;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MockSOCCard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chaos, setChaos] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [drillIp, setDrillIp] = useState<string | null>(null);
  const [ipModal, setIpModal] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const chaosTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstIpRef = useRef<string>("");
  const burstGeoRef = useRef<string>("");
  const burstCountRef = useRef(0);

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = feedRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  const addLog = useCallback((log: LogEntry) => {
    setLogs((p) => [...p, log].slice(-MAX_LOGS));
    scrollBottom();
  }, [scrollBottom]);

  // Normal ambient traffic
  useEffect(() => {
    const rate = chaos ? 400 : 1800;
    const iv = setInterval(() => addLog(makeNormalLog()), rate);
    return () => clearInterval(iv);
  }, [chaos, addLog]);

  // Chaos burst
  const triggerChaos = () => {
    if (chaos) return;
    setChaos(true);
    burstIpRef.current = randomIp(true);
    burstGeoRef.current = HIGH_RISK_GEOS[Math.floor(Math.random() * HIGH_RISK_GEOS.length)];
    burstCountRef.current = 0;
    let count = 0;

    const burst = setInterval(() => {
      const atk = ATTACK_EVENTS[Math.floor(Math.random() * ATTACK_EVENTS.length)];
      const log: LogEntry = {
        id: _id++,
        timestamp: nowTs(),
        src_ip: burstIpRef.current,
        status_code: atk.status,
        geo_loc: burstGeoRef.current,
        event: atk.event,
        event_type: atk.event_type,
        severity: atk.severity,
      };
      addLog(log);
      count++;
      burstCountRef.current = count;

      if (count === 10) {
        // Trigger alert after 10 attempts
        _alertId++;
        const newAlert: AlertItem = {
          id: `ALRT-${_alertId}`,
          severity: "CRITICAL",
          rule: "SIGMA_WEB_BRUTEFORCE",
          src_ip: burstIpRef.current,
          geo: burstGeoRef.current,
          ts: nowTs(),
          attempts: count,
        };
        setAlerts((p) => [newAlert, ...p].slice(0, 10));
      }

      if (count >= 18) {
        clearInterval(burst);
        chaosTimerRef.current = setTimeout(() => setChaos(false), 2000);
      }
    }, 180);
  };

  useEffect(() => () => { if (chaosTimerRef.current) clearTimeout(chaosTimerRef.current); }, []);

  const dismissAlert = (id: string) => {
    setAlerts((p) => p.filter((a) => a.id !== id));
    if (drillIp && alerts.find((a) => a.id === id)?.src_ip === drillIp) setDrillIp(null);
  };

  const visibleLogs = drillIp ? logs.filter((l) => l.src_ip === drillIp) : logs;
  const latestAlert = alerts[0] ?? null;

  return (
    <div className="w-full font-mono text-xs">
      {/* ── Alert Queue ── */}
      <AlertQueue
        alerts={alerts}
        onDrillDown={setDrillIp}
        activeIp={drillIp}
        onDismiss={dismissAlert}
      />

      {/* ── Terminal Header ── */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Terminal className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-neutral-500 text-[11px] tracking-widest uppercase">
            SentinelSimulation v1.0 — Live Feed
          </span>
          {chaos && (
            <span className="text-[10px] text-red-400 animate-pulse font-bold tracking-widest">
              ⚡ BRUTE FORCE ACTIVE
            </span>
          )}
          {drillIp && (
            <span className="text-[10px] text-orange-400 font-bold">
              ▶ FILTERED: {drillIp}
              <button onClick={() => setDrillIp(null)} className="ml-2 text-neutral-600 hover:text-neutral-300">[clear]</button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {latestAlert && (
            <motion.button
              id="report-button"
              onClick={() => setReportOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200 text-[11px] transition-all"
            >
              <FileText className="w-3 h-3" />
              Generate Incident Report
            </motion.button>
          )}
          <motion.button
            id="chaos-button"
            onClick={triggerChaos}
            disabled={chaos}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-[11px] font-medium transition-all ${
              chaos
                ? "border-red-800 bg-red-950 text-red-400 cursor-not-allowed animate-pulse"
                : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-red-700 hover:text-red-400 cursor-pointer"
            }`}
          >
            <Zap className="w-3 h-3" />
            {chaos ? "ATTACK IN PROGRESS..." : "Chaos Mode"}
          </motion.button>
        </div>
      </div>

      {/* ── Column Headers ── */}
      <div className="grid grid-cols-[130px_110px_52px_90px_80px_1fr] gap-x-3 px-3 py-1.5 border-b border-neutral-800 text-[10px] text-neutral-600 uppercase tracking-wider mb-1">
        <span>Timestamp</span>
        <span>Src IP</span>
        <span>Status</span>
        <span>Geo</span>
        <span>Type</span>
        <span>Event</span>
      </div>

      {/* ── Log Feed ── */}
      <div
        ref={feedRef}
        className="h-96 overflow-y-auto overflow-x-hidden pr-1 space-y-px"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a2a transparent" }}
      >
        <AnimatePresence initial={false}>
          {visibleLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={`grid grid-cols-[130px_110px_52px_90px_80px_1fr] gap-x-3 px-3 py-1 rounded-sm items-start hover:bg-neutral-900/60 transition-colors ${
                log.severity === "CRITICAL" ? "bg-red-950/15" : log.severity === "WARN" ? "bg-yellow-950/10" : ""
              }`}
            >
              <span className="text-neutral-600 tabular-nums shrink-0">{log.timestamp.slice(11)}</span>

              {/* Clickable IP */}
              <button
                onClick={() => setIpModal(log.src_ip)}
                className={`tabular-nums shrink-0 text-left hover:underline transition-colors ${
                  log.severity !== "INFO" ? "text-red-400 hover:text-red-300" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {log.src_ip}
              </button>

              <span className={`tabular-nums shrink-0 ${statusColor(log.status_code, chaos)}`}>
                {log.status_code}
              </span>

              <span className="text-neutral-500 shrink-0 truncate">{log.geo_loc}</span>

              <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-bold tracking-wide uppercase shrink-0 whitespace-nowrap ${EVENT_TYPE_STYLES[log.event_type]}`}>
                {log.event_type.replace("_", " ")}
              </span>

              <span className={`leading-snug break-words ${
                log.severity === "CRITICAL" ? "text-red-400" : log.severity === "WARN" ? "text-yellow-500" : "text-neutral-500"
              }`}>
                <EventCell event={log.event} chaos={chaos} />
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {visibleLogs.length === 0 && (
          <div className="flex items-center justify-center h-full text-neutral-700 py-16">
            {drillIp ? `No logs from ${drillIp} yet…` : "Initializing engine…"}
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 mt-2 px-1">
        <span className="flex items-center gap-1 text-[10px] text-neutral-600"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />SUCCESS</span>
        <span className="flex items-center gap-1 text-[10px] text-yellow-700"><span className="w-1.5 h-1.5 rounded-full bg-yellow-700 inline-block" />WARN</span>
        <span className="flex items-center gap-1 text-[10px] text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-700 inline-block" />CRITICAL</span>
        <span className="ml-auto text-[10px] text-neutral-700 tabular-nums">{visibleLogs.length} / {MAX_LOGS} events</span>
      </div>

      {/* ── Modals ── */}
      <IpModal ip={ipModal} onClose={() => setIpModal(null)} />
      <IncidentReport
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        data={latestAlert ? {
          alertId: latestAlert.id,
          srcIp: latestAlert.src_ip,
          geo: latestAlert.geo,
          attempts: latestAlert.attempts,
          ts: latestAlert.ts,
          totalLogs: logs.length,
        } : null}
      />
    </div>
  );
}
