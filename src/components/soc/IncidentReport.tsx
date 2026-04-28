"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ReportData {
  alertId: string;
  srcIp: string;
  geo: string;
  attempts: number;
  ts: string;
  totalLogs: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: ReportData | null;
}

function buildReport(d: ReportData): string {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  return `INCIDENT REPORT — ${d.alertId}
Generated: ${now} UTC
Analyst: SOC Tier-1 (SentinelSimulation)
Classification: CONFIDENTIAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY
─────────────────
A brute-force credential attack was detected against the web
authentication endpoint. The sliding-window detection engine
triggered alert ${d.alertId} after recording ${d.attempts} HTTP 401
responses from a single source IP within a 60-second window,
exceeding the SIGMA threshold of 10.

INCIDENT DETAILS
────────────────
Alert ID      : ${d.alertId}
Severity      : CRITICAL
Rule          : SIGMA_WEB_BRUTEFORCE (sigma-web-bf-001)
Source IP     : ${d.srcIp}
Geo Location  : ${d.geo}
First Seen    : ${d.ts} UTC
Total Events  : ${d.totalLogs} in current session
401 Attempts  : ${d.attempts} within 60s window

THREAT INTELLIGENCE (AbuseIPDB)
────────────────────────────────
Confidence Score : 100%
Country          : Unknown / VPN
ISP              : DigitalOcean (Common Botnet Origin)
Category         : Brute-Force / Web Attack

AFFECTED SYSTEMS
────────────────
Endpoint  : POST /api/login
Service   : Authentication API
Impact    : Credential stuffing / account lockout risk

RECOMMENDED ACTIONS
───────────────────
[1] Block src IP ${d.srcIp} at WAF/firewall (immediate)
[2] Enable rate-limiting on /api/login (≤5 req/min per IP)
[3] Force MFA for all accounts targeted in this window
[4] Escalate to Tier-2 for attribution analysis
[5] Submit IP to AbuseIPDB for community flagging

STATUS: Awaiting Tier-2 Escalation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

export default function IncidentReport({ open, onClose, data }: Props) {
  const [copied, setCopied] = useState(false);
  const report = data ? buildReport(data) : "";

  const copy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && data && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] max-h-[80vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl font-mono text-xs overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900/80 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[11px] uppercase tracking-widest text-neutral-400">Incident Report — {data.alertId}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600 transition-colors text-[10px]"
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={onClose} className="text-neutral-600 hover:text-neutral-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <pre className="flex-1 overflow-y-auto p-5 text-[11px] leading-relaxed text-neutral-400 whitespace-pre-wrap"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a2a transparent" }}>
              {report}
            </pre>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
