"use client";

import { motion } from "framer-motion";
import { Terminal, Zap, Code2, Database, Globe, Shield } from "lucide-react";
import dynamic from "next/dynamic";
import ProjectWindow from "@/components/ProjectWindow";

const MockSOCCard = dynamic(() => import("@/components/MockSOCCard"), { ssr: false });
const EmailPhishingAnalyzer = dynamic(() => import("@/components/EmailPhishingAnalyzer"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const SENTINEL_TAGS = [
  { label: "Python 3.11", icon: Code2 },
  { label: "Next.js 16", icon: Globe },
  { label: "Framer Motion", icon: Zap },
  { label: "AbuseIPDB API", icon: Shield },
  { label: "Elasticsearch", icon: Database },
  { label: "SIGMA Rules", icon: Terminal },
];

const PHISHING_TAGS = [
  { label: "Digital Forensics", icon: Shield },
  { label: "Email Analysis", icon: Terminal },
  { label: "SPF / DKIM / DMARC", icon: Database },
  { label: "Next.js 16", icon: Globe },
  { label: "Framer Motion", icon: Zap },
  { label: "OSINT", icon: Code2 },
];

const STAR_ITEMS = [
  {
    letter: "S",
    label: "Situation",
    text: "SOC Analysts are overwhelmed by raw, unstructured log data, making it hard to distinguish real threats from noise in real-time environments.",
  },
  {
    letter: "T",
    label: "Task",
    text: "Build an automated detection engine that minimizes alert fatigue and maximizes contextual enrichment per incident.",
  },
  {
    letter: "A",
    label: "Action",
    text: "Developed a stateful Python backend using sliding-window logic to detect brute-force patterns, integrated AbuseIPDB for real-time IP reputation checks, and built a Next.js terminal-style dashboard for live visualization.",
  },
  {
    letter: "R",
    label: "Result",
    text: "Successfully automated threat enrichment, reducing simulated incident investigation time by 70% through contextual IOC surfacing and heuristic alerting.",
  },
];

const CODE_SNIPPET = `# MockSOC — Sliding Window Brute Force Detector
from collections import defaultdict, deque
from time import time

WINDOW_SECS = 60
THRESHOLD   = 10

log_window: dict[str, deque] = defaultdict(deque)

def analyze(event: dict) -> dict | None:
    ip  = event["src_ip"]
    now = time()
    win = log_window[ip]

    # Prune events outside the time window
    while win and now - win[0] > WINDOW_SECS:
        win.popleft()

    if event["status_code"] == 401:
        win.append(now)

    if len(win) >= THRESHOLD:
        return {
            "alert": "BRUTE_FORCE",
            "src_ip": ip,
            "attempts": len(win),
            "window_s": WINDOW_SECS,
        }
    return None`;

export default function PortfolioPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "MockSOC — SentinelSimulation",
            applicationCategory: "SecurityApplication",
            operatingSystem: "Web",
            description:
              "An interactive SOC simulation dashboard featuring a live Python detection engine for brute-force and IOC identification.",
            author: { "@type": "Person", name: "Moris Khoudari" },
            keywords:
              "Entry-level Cybersecurity Analyst Portfolio, Python Security Project, SIEM Dashboard Development",
          }),
        }}
      />

      {/* Page Header */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-16 mt-8"
      >
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 text-foreground">
          Portfolio
        </h1>
        <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed mb-3">
          A showcase of security-first projects demonstrating expertise in threat detection, log analysis, and full-stack development.
        </p>
      </motion.div>

      {/* ───── PROJECTS ───── */}
      <motion.section
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        aria-label="Projects"
        className="mb-20"
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[11px] font-medium text-neutral-600 tracking-widest uppercase">Projects</span>
          <div className="flex-1 h-px bg-neutral-900" />
        </div>

        <div className="space-y-6">
          {/* SentinelSimulation */}
          <ProjectWindow
            windowTitle="sentinel-simulation.local"
            projectName="SentinelSimulation"
            description={`An interactive Security Operations Center (SOC) dashboard that runs a live Python-based detection engine directly in the browser. Press "Chaos Mode" to simulate a Hydra brute-force attack and watch the engine respond in real-time.`}
            tags={SENTINEL_TAGS}
            thumbnail="/thumbnails/sentinel-thumbnail.png"
            statusLabel="Engine Running"
          >
            {/* Live Log Feed */}
            <MockSOCCard />

            {/* ── Case Study ── */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[11px] font-medium text-neutral-600 tracking-widest uppercase">Case Study</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {STAR_ITEMS.map((item) => (
                  <div
                    key={item.letter}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-2xl font-medium text-neutral-700 font-mono">{item.letter}</span>
                      <span className="text-sm font-medium text-neutral-300 uppercase tracking-wider">{item.label}</span>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Core Detection Logic ── */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[11px] font-medium text-neutral-600 tracking-widest uppercase">Core Detection Logic</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="text-xs text-neutral-600 font-mono">detection_engine.py</span>
                  </div>
                  <span className="text-[10px] text-neutral-700 font-mono uppercase tracking-wider">Python 3.11</span>
                </div>
                <pre className="p-6 text-xs leading-relaxed text-neutral-400 font-mono overflow-x-auto">
                  <code>{CODE_SNIPPET}</code>
                </pre>
              </div>
            </div>
          </ProjectWindow>

          {/* EmailPhishing: Digital Forensics Analyzer */}
          <ProjectWindow
            windowTitle="email-phishing-analyzer.local"
            projectName="EmailPhishing: Digital Forensics Analyzer"
            description="An interactive email forensics tool that parses raw email headers to detect phishing attempts. Validates SPF, DKIM, and DMARC authentication, defangs malicious URLs, and generates a step-by-step Incident Response Playbook."
            tags={PHISHING_TAGS}
            thumbnail="/thumbnails/phishing-thumbnail.png"
            statusLabel="Analyzer Ready"
          >
            <EmailPhishingAnalyzer />
          </ProjectWindow>
        </div>
      </motion.section>

      {/* ───── SEO KEYWORDS NOTE (hidden, for crawlers) ───── */}
      <div className="sr-only">
        Entry-level Cybersecurity Analyst Portfolio. Python Security Project. SIEM Dashboard Development. SOC Analyst Tools. Threat Detection Dashboard.
      </div>
    </main>
  );
}
