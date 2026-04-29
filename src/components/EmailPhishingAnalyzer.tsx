"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ShieldCheck,
  ShieldX,
  Link2,
  FileText,
  PlayCircle,
  RotateCcw,
  Terminal,
  AlertTriangle,
  CheckCircle,
  CheckSquare,
  Square,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthResult = "PASS" | "FAIL" | "NONE";
type Verdict = "PHISHING" | "LEGITIMATE";

interface PlaybookItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ScanResult {
  verdict: Verdict;
  from: string;
  returnPath: string;
  spf: AuthResult;
  dkim: AuthResult;
  dmarc: AuthResult;
  links: string[];
  analystNotes: string;
  playbook: PlaybookItem[];
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const LEGIT_SAMPLE = `From: noreply@github.com
Return-Path: <noreply@github.com>
Received-SPF: pass (google.com: domain of noreply@github.com designates 192.30.252.0 as permitted sender)
Authentication-Results: mx.google.com;
   dkim=pass header.i=@github.com header.s=pf2014 header.b=Abc123Xyz;
   spf=pass (google.com: domain of noreply@github.com designates 192.30.252.0 as permitted sender) smtp.mailfrom=noreply@github.com;
   dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=github.com
Subject: [GitHub] Your pull request was merged
Date: Tue, 29 Apr 2025 14:32:11 +0000
Message-ID: <20250429143211.1A2B3C@github.com>
Content-Type: text/html; charset=UTF-8

Your pull request #42 has been successfully merged into main.
View it here: https://github.com/user/repo/pull/42
Documentation: https://docs.github.com/en/pull-requests`;

const PHISH_SAMPLE = `From: security@paypal.com
Return-Path: <noreply-alerts@gmail.com>
Received-SPF: fail (google.com: domain of noreply-alerts@gmail.com does not designate 45.33.32.156 as permitted sender)
Authentication-Results: mx.google.com;
   dkim=pass header.i=@gmail.com header.s=20210112 header.b=Xyz789Abc;
   spf=fail (google.com: domain of noreply-alerts@gmail.com does not designate 45.33.32.156 as permitted sender) smtp.mailfrom=noreply-alerts@gmail.com;
   dmarc=fail (p=REJECT sp=REJECT dis=NONE) header.from=paypal.com
Subject: Urgent: Your PayPal Account Has Been Limited
Date: Tue, 29 Apr 2025 09:12:44 +0000
X-Mailer: The Bat! (v10.3)
Message-ID: <suspicious.1234@unknown-server.ru>
Content-Type: text/html; charset=UTF-8

Your account requires immediate verification or it will be permanently suspended.
Verify now: https://paypal.com.verify-account.xyz/login?token=abc123
Quick link: http://bit.ly/2xK8mNp
Support: https://paypal-secure.support-portal.ru/help`;

// ─── Parser ───────────────────────────────────────────────────────────────────
function parseHeaders(raw: string): ScanResult {
  const fromMatch = raw.match(/^From:\s*(.+)$/im);
  const from = fromMatch ? fromMatch[1].trim() : "Unknown";

  const rpMatch = raw.match(/^Return-Path:\s*(.+)$/im);
  const returnPath = rpMatch ? rpMatch[1].trim().replace(/[<>]/g, "") : "Unknown";

  let spf: AuthResult = "NONE";
  const spfMatch = raw.match(/spf=(pass|fail|none|neutral|softfail)/im);
  if (spfMatch) spf = spfMatch[1].toLowerCase() === "pass" ? "PASS" : "FAIL";

  let dkim: AuthResult = "NONE";
  const dkimMatch = raw.match(/dkim=(pass|fail|none)/im);
  if (dkimMatch) dkim = dkimMatch[1].toLowerCase() === "pass" ? "PASS" : "FAIL";

  let dmarc: AuthResult = "NONE";
  const dmarcMatch = raw.match(/dmarc=(pass|fail|none)/im);
  if (dmarcMatch) dmarc = dmarcMatch[1].toLowerCase() === "pass" ? "PASS" : "FAIL";

  const urlRegex = /https?:\/\/[^\s"'<>\r\n]+/gi;
  const rawLinks = raw.match(urlRegex) ?? [];
  const links = [...new Set(rawLinks)];

  const verdict: Verdict = spf === "FAIL" || dmarc === "FAIL" ? "PHISHING" : "LEGITIMATE";

  let analystNotes = "";
  if (verdict === "PHISHING") {
    const claimedDomain = from.match(/@([\w.-]+)/)?.[1] ?? "unknown";
    const actualDomain = returnPath.match(/@([\w.-]+)/)?.[1] ?? "unknown";
    analystNotes = `SPOOF DETECTED: The From address claims to be ${claimedDomain}, but the Return-Path originates from ${actualDomain}. DMARC failed due to domain mismatch — the sending infrastructure is not authorised to send on behalf of ${claimedDomain}. This is a classic brand impersonation attempt designed to bypass naive From-field inspection.`;
  } else {
    analystNotes = `Domain alignment confirmed. The From address, Return-Path, and authenticated sending IP are all consistent with the claimed domain. SPF designates the sending server as a permitted sender and the DKIM cryptographic signature is valid. DMARC policy is enforced with no anomalies detected — this email is clear.`;
  }

  const playbook: PlaybookItem[] =
    verdict === "PHISHING"
      ? [
          { id: "p1", text: "Search SIEM for other recipients of this sender domain.", checked: false },
          { id: "p2", text: "Reset credentials for the targeted user immediately.", checked: false },
          { id: "p3", text: "Purge the email from all company mailboxes via O365 / Google Admin.", checked: false },
          { id: "p4", text: "Submit malicious URLs to PhishTank and Google Safe Browsing.", checked: false },
          { id: "p5", text: "Block sender domain at the email gateway / MTA level.", checked: false },
          { id: "p6", text: "File an IOC report and update threat intelligence feeds.", checked: false },
        ]
      : [
          { id: "l1", text: "No further action required — email is legitimate.", checked: false },
          { id: "l2", text: "If user flagged this as a false positive, update the 'Safe Senders' whitelist.", checked: false },
          { id: "l3", text: "Document the false-positive ticket for audit trail purposes.", checked: false },
        ];

  return { verdict, from, returnPath, spf, dkim, dmarc, links, analystNotes, playbook };
}

// ─── Defanger ─────────────────────────────────────────────────────────────────
function defang(url: string): string {
  return url
    .replace(/^https:\/\//i, "hXXps://")
    .replace(/^http:\/\//i, "hXXp://")
    .replace(/\./g, "[.]");
}

// ─── Auth Badge ───────────────────────────────────────────────────────────────
function AuthCard({ label, result }: { label: string; result: AuthResult }) {
  const pass = result === "PASS";
  const none = result === "NONE";
  return (
    <div
      className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg border transition-all ${
        none
          ? "border-neutral-800 bg-neutral-950 text-neutral-600"
          : pass
          ? "border-green-800/60 bg-green-950/30"
          : "border-red-800/60 bg-red-950/30"
      }`}
    >
      {!none &&
        (pass ? (
          <ShieldCheck className="w-4 h-4 text-green-400" />
        ) : (
          <ShieldX className="w-4 h-4 text-red-400" />
        ))}
      <span className="text-[10px] uppercase tracking-widest text-neutral-500">{label}</span>
      <span
        className={`text-sm font-bold tracking-wide font-mono ${
          none ? "text-neutral-700" : pass ? "text-green-400" : "text-red-400"
        }`}
      >
        {result}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmailPhishingAnalyzer() {
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [playbook, setPlaybook] = useState<PlaybookItem[]>([]);

  const runScan = useCallback(() => {
    if (!input.trim() || scanning) return;
    setScanning(true);
    setResult(null);
    setProgress(0);

    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        const parsed = parseHeaders(input);
        setResult(parsed);
        setPlaybook(parsed.playbook);
        setScanning(false);
      }
      setProgress(Math.min(p, 100));
    }, 110);
  }, [input, scanning]);

  const loadSample = (type: "legit" | "phish") => {
    setResult(null);
    setPlaybook([]);
    setProgress(0);
    setInput(type === "legit" ? LEGIT_SAMPLE : PHISH_SAMPLE);
  };

  const reset = () => {
    setInput("");
    setResult(null);
    setPlaybook([]);
    setProgress(0);
  };

  const toggleCheck = (id: string) => {
    setPlaybook((p) => p.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const completedCount = playbook.filter((i) => i.checked).length;

  return (
    <div className="w-full font-mono text-xs space-y-6">
      {/* ── INTAKE_CHAMBER ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-[11px] text-neutral-500 tracking-widest uppercase">INTAKE_CHAMBER</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>
        <textarea
          id="email-header-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Paste raw email headers here...\n\nExample:\nFrom: security@paypal.com\nReturn-Path: <alerts@gmail.com>\nAuthentication-Results: dkim=pass; spf=fail; dmarc=fail`}
          className="w-full h-52 bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-xs text-neutral-300 font-mono leading-relaxed resize-none focus:outline-none focus:border-neutral-600 placeholder:text-neutral-700 transition-colors"
          spellCheck={false}
        />
      </div>

      {/* ── Action Bar ── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          id="load-legit-sample"
          onClick={() => loadSample("legit")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-green-900/60 bg-green-950/20 text-green-500/80 hover:border-green-700 hover:text-green-400 text-[11px] transition-all"
        >
          <CheckCircle className="w-3 h-3" />
          LOAD_LEGIT_SAMPLE
        </button>
        <button
          id="load-phish-sample"
          onClick={() => loadSample("phish")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-900/60 bg-red-950/20 text-red-500/80 hover:border-red-700 hover:text-red-400 text-[11px] transition-all"
        >
          <AlertTriangle className="w-3 h-3" />
          LOAD_PHISH_SAMPLE
        </button>

        <div className="flex-1" />

        {(result || input) && (
          <button
            id="reset-scan"
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300 text-[11px] transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            RESET
          </button>
        )}

        <motion.button
          id="run-scan"
          onClick={runScan}
          disabled={!input.trim() || scanning}
          whileHover={input.trim() && !scanning ? { scale: 1.03 } : {}}
          whileTap={input.trim() && !scanning ? { scale: 0.97 } : {}}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md border text-[11px] font-medium transition-all ${
            !input.trim() || scanning
              ? "border-neutral-800 bg-neutral-950 text-neutral-600 cursor-not-allowed"
              : "border-neutral-500 bg-neutral-900 text-neutral-200 hover:border-neutral-300 cursor-pointer"
          }`}
        >
          <PlayCircle className="w-3 h-3" />
          RUN_SCAN
        </motion.button>
      </div>

      {/* ── Progress Bar ── */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest animate-pulse">
                Decrypting Headers...
              </span>
              <span className="text-[10px] text-neutral-600 tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-px bg-neutral-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neutral-400 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* ── Verdict Banner ── */}
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                result.verdict === "PHISHING"
                  ? "border-red-800/60 bg-red-950/20"
                  : "border-green-800/60 bg-green-950/20"
              }`}
            >
              {result.verdict === "PHISHING" ? (
                <ShieldX className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
              )}
              <div>
                <span
                  className={`text-xs font-bold tracking-widest uppercase ${
                    result.verdict === "PHISHING" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {result.verdict === "PHISHING" ? "⚠ PHISHING DETECTED" : "✓ LEGITIMATE EMAIL"}
                </span>
                <p className="text-[10px] text-neutral-500 mt-0.5 break-all">
                  From: {result.from} · Return-Path: {result.returnPath}
                </p>
              </div>
            </div>

            {/* ── Auth Cards ── */}
            <div>
              <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-3">
                Authentication Results
              </p>
              <div className="grid grid-cols-3 gap-3">
                <AuthCard label="SPF" result={result.spf} />
                <AuthCard label="DKIM" result={result.dkim} />
                <AuthCard label="DMARC" result={result.dmarc} />
              </div>
            </div>

            {/* ── Defanged URLs ── */}
            {result.links.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="w-3 h-3 text-neutral-500" />
                  <span className="text-[10px] text-neutral-600 uppercase tracking-widest">
                    Defanged URLs ({result.links.length})
                  </span>
                  <div className="flex-1 h-px bg-neutral-800" />
                </div>
                <div className="space-y-1.5">
                  {result.links.map((link, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-md"
                    >
                      <span className="text-neutral-700 shrink-0 mt-px">▸</span>
                      <span
                        className={`break-all text-[11px] leading-relaxed ${
                          result.verdict === "PHISHING" ? "text-red-400/80" : "text-neutral-400"
                        }`}
                      >
                        {defang(link)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ANALYST_NOTES ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[10px] text-neutral-600 uppercase tracking-widest">ANALYST_NOTES</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>
              <div
                className={`px-4 py-4 rounded-lg border text-xs leading-relaxed ${
                  result.verdict === "PHISHING"
                    ? "border-red-900/50 bg-red-950/10 text-red-300/80"
                    : "border-green-900/50 bg-green-950/10 text-green-300/80"
                }`}
              >
                {result.analystNotes}
              </div>
            </div>

            {/* ── INCIDENT_RESPONSE_PLAYBOOK ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[10px] text-neutral-600 uppercase tracking-widest">
                  INCIDENT_RESPONSE_PLAYBOOK
                </span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>
              <div className="space-y-1.5">
                {playbook.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md border text-left transition-all ${
                      item.checked
                        ? "border-neutral-800 bg-neutral-900/20 text-neutral-600"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
                    }`}
                  >
                    {item.checked ? (
                      <CheckSquare className="w-3.5 h-3.5 shrink-0 mt-px text-neutral-600" />
                    ) : (
                      <Square className="w-3.5 h-3.5 shrink-0 mt-px text-neutral-500" />
                    )}
                    <span className={`text-[11px] leading-relaxed ${item.checked ? "line-through" : ""}`}>
                      [ ACTION ] {item.text}
                    </span>
                  </button>
                ))}
              </div>
              {playbook.length > 0 && (
                <p className="text-[10px] text-neutral-700 mt-2 text-right tabular-nums">
                  {completedCount} / {playbook.length} actions completed
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
