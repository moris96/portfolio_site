"use client";

import { Metadata } from "next";
import { motion } from "framer-motion";
import { Shield, Terminal, Zap, Code2, Database, Globe } from "lucide-react";
import dynamic from "next/dynamic";

const MockSOCCard = dynamic(() => import("@/components/MockSOCCard"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const TECH_TAGS = [
  { label: "Python 3.11", icon: Code2 },
  { label: "Next.js 16", icon: Globe },
  { label: "Framer Motion", icon: Zap },
  { label: "AbuseIPDB API", icon: Shield },
  { label: "Elasticsearch", icon: Database },
  { label: "SIGMA Rules", icon: Terminal },
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
        <p className="text-sm font-medium text-neutral-500 italic">
          Fun fact: this website was made using Next.js &amp; Google Antigravity (what the cool kids use to build websites, but I prefer Antigravity over Claude Code because of the cleaner UI)
        </p>
      </motion.div>

      {/* ───── HERO PROJECT: MockSOC ───── */}
      <motion.section
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        aria-label="MockSOC SentinelSimulation project"
        className="mb-20"
      >
        {/* Label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[11px] font-medium text-neutral-600 tracking-widest uppercase">Featured Project</span>
          <div className="flex-1 h-px bg-neutral-900" />
        </div>

        {/* Hero Card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg shadow-black/60">
          {/* Card Top Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-neutral-800 border border-neutral-700" />
                <span className="w-3 h-3 rounded-full bg-neutral-800 border border-neutral-700" />
                <span className="w-3 h-3 rounded-full bg-neutral-800 border border-neutral-700" />
              </div>
              <span className="text-xs text-neutral-600 font-mono">sentinel-simulation.local</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-wider">Engine Running</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: Info */}
            <div className="p-8 border-r border-border">
              <div className="flex items-center gap-2 mb-5">
                <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center border border-neutral-800">
                  <Shield className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-medium">Project</p>
                  <h2 className="text-lg font-medium text-foreground leading-tight">SentinelSimulation</h2>
                </div>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                An interactive Security Operations Center (SOC) dashboard that runs a live Python-based detection engine directly in the browser. Press{" "}
                <span className="font-mono text-xs bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                  Chaos Mode
                </span>{" "}
                to simulate a Hydra brute-force attack and watch the engine respond in real-time.
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {TECH_TAGS.map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 text-xs font-medium text-neutral-400 rounded-full border border-neutral-800"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                ))}
              </div>

              {/* Key Highlights */}
              <div className="space-y-2.5">
                {[
                  "Sliding-window brute-force detection (≥10 401s/60s)",
                  "AbuseIPDB real-time IP reputation enrichment",
                  "SIGMA-aligned custom rule engine (Python)",
                  "\"Chaos Mode\" — live attack simulation for visitors",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-neutral-500">
                    <span className="mt-0.5 text-neutral-700">▸</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Dashboard */}
            <div className="p-6 relative">
              <MockSOCCard />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ───── CASE STUDY ───── */}
      <motion.section
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        aria-label="MockSOC case study"
        className="mb-20"
      >
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[11px] font-medium text-neutral-600 tracking-widest uppercase">Case Study</span>
          <div className="flex-1 h-px bg-neutral-900" />
        </div>

        {/* STAR Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {STAR_ITEMS.map((item, i) => (
            <motion.div
              key={item.letter}
              custom={3 + i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-card border border-border rounded-xl p-6 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-2xl font-medium text-neutral-700 font-mono">{item.letter}</span>
                <span className="text-sm font-medium text-neutral-300 uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ───── CODE SNIPPET ───── */}
      <motion.section
        custom={7}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        aria-label="Detection engine code snippet"
        className="mb-16"
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[11px] font-medium text-neutral-600 tracking-widest uppercase">Core Detection Logic</span>
          <div className="flex-1 h-px bg-neutral-900" />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Code Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-neutral-950">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-neutral-600" />
              <span className="text-xs text-neutral-600 font-mono">detection_engine.py</span>
            </div>
            <span className="text-[10px] text-neutral-700 font-mono uppercase tracking-wider">Python 3.11</span>
          </div>
          {/* Code Body */}
          <pre className="p-6 text-xs leading-relaxed text-neutral-400 font-mono overflow-x-auto">
            <code>{CODE_SNIPPET}</code>
          </pre>
        </div>
      </motion.section>

      {/* ───── SEO KEYWORDS NOTE (hidden, for crawlers) ───── */}
      <div className="sr-only">
        Entry-level Cybersecurity Analyst Portfolio. Python Security Project. SIEM Dashboard Development. SOC Analyst Tools. Threat Detection Dashboard.
      </div>
    </main>
  );
}
