"use client";

import { motion } from "framer-motion";
import { Shield, Search, Code, Lock, Server, Mail, Linkedin, FileText, Terminal, Zap } from "lucide-react";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const SKILLS_PREVIEW = [
  { label: "Python", pct: 80 },
  { label: "Linux", pct: 80 },
  { label: "JavaScript", pct: 80 },
  { label: "SIEM Tools", pct: 50 },
  { label: "SEMrush / GSC", pct: 90 },
];

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white">

      {/* ── Header ── */}
      <motion.header
        custom={0}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-16 mt-8"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-foreground">
          Cybersecurity Portfolio <br className="hidden md:block" />
          <span className="text-neutral-500">Moris Khoudari</span>
        </h1>
        <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
          Lead Portfolio Architect &amp; Security Auditor. Specializing in zero-trust development, technical SEO, and scalable programming.
        </p>
      </motion.header>

      {/* ── Bento Grid ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto" aria-label="Portfolio overview">

        {/* ── HERO: MockSOC / SentinelSimulation ── */}
        <motion.article
          custom={1}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.015, borderColor: "#333333" }}
          className="md:col-span-2 bg-card border border-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer transition-colors shadow-sm shadow-black/50 min-h-[280px]"
        >
          <Link href="/portfolio" className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-neutral-900 w-12 h-12 rounded-xl flex items-center justify-center border border-neutral-800">
                  <Shield className="w-6 h-6 text-neutral-300" />
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-wider">Engine Running</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium text-neutral-600 tracking-widest uppercase font-mono">Featured Project</span>
              </div>
              <h2 className="text-2xl font-medium mb-3 text-foreground">MockSOC — SentinelSimulation</h2>
              <p className="text-neutral-400 mb-6 max-w-md leading-relaxed text-sm">
                An interactive SOC dashboard with a live Python-based detection engine. Identifies brute-force patterns, directory traversal, and credential stuffing in real-time. Enriched with AbuseIPDB threat intelligence.
              </p>

              {/* Mini terminal preview */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 font-mono text-[11px] space-y-1 mb-6">
                <div className="flex gap-3">
                  <span className="text-neutral-600">14:17:31</span>
                  <span className="text-red-400">185.220.101.47</span>
                  <span className="text-red-400">401</span>
                  <span className="text-red-500">RU/Moscow</span>
                  <span className="text-red-500">POST /api/login [BRUTE FORCE DETECTED]</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-neutral-600">14:17:29</span>
                  <span className="text-neutral-500">43.227.72.162</span>
                  <span className="text-green-500">200</span>
                  <span className="text-neutral-500">US/NY</span>
                  <span className="text-neutral-500">GET /index.html 200</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-neutral-600">14:17:28</span>
                  <span className="text-red-400">175.45.176.0</span>
                  <span className="text-red-400">403</span>
                  <span className="text-red-500">KP/Pyongyang</span>
                  <span className="text-yellow-500">GET /../../../etc/passwd [DIR TRAVERSAL]</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Python 3.11", "Next.js 16", "Framer Motion", "AbuseIPDB API", "SIGMA Rules"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-neutral-900 text-xs font-medium text-neutral-400 rounded-full border border-neutral-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center text-sm font-medium text-neutral-500 group-hover:text-neutral-300 transition-colors mt-8">
              View Project &rarr;
            </div>
          </Link>
        </motion.article>

        {/* ── About Me ── */}
        <motion.article
          custom={2}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.015, borderColor: "#333333" }}
          className="bg-card border border-border rounded-xl p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm shadow-black/50 min-h-[280px]"
        >
          <Link href="/about" className="flex flex-col h-full justify-between">
            <div>
              <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-neutral-800">
                <Lock className="w-5 h-5 text-neutral-400" />
              </div>
              <h2 className="text-xl font-medium mb-3 text-foreground">About Me</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Self-taught &amp; professionally certified Software Engineer. Passionate about Cybersecurity, AI, and building toward a more secure cyber environment.
              </p>
            </div>
            <span className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors mt-6">Learn more &rarr;</span>
          </Link>
        </motion.article>

        {/* ── Skills Preview ── */}
        <motion.article
          custom={3}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.015, borderColor: "#333333" }}
          className="bg-card border border-border rounded-xl p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm shadow-black/50"
        >
          <Link href="/skills" className="flex flex-col h-full justify-between">
            <div className="w-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center border border-neutral-800">
                  <Code className="w-5 h-5 text-neutral-400" />
                </div>
                <h2 className="text-xl font-medium text-foreground">Skills</h2>
              </div>
              <div className="space-y-3">
                {SKILLS_PREVIEW.map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
                      <span>{label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                      <div className="h-full bg-neutral-300 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors mt-6">View all skills &rarr;</span>
          </Link>
        </motion.article>

        {/* ── Experience / Certifications ── */}
        <motion.article
          custom={4}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.015, borderColor: "#333333" }}
          className="bg-card border border-border rounded-xl p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm shadow-black/50"
        >
          <Link href="/experience" className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center border border-neutral-800">
                  <Server className="w-5 h-5 text-neutral-400" />
                </div>
                <h2 className="text-xl font-medium text-foreground">Certifications</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    <img src="/galogo.jpg" alt="General Assembly" className="w-full h-full object-contain p-0.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-300">Software Engineering Immersive</p>
                    <p className="text-[11px] text-neutral-600">General Assembly · Feb 2023 · 420 hrs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    <img src="/googlelogo.png" alt="Google" className="w-full h-full object-contain p-0.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-300">Google Cybersecurity Certificate</p>
                    <p className="text-[11px] text-neutral-600">Google via Coursera · Professional</p>
                  </div>
                </div>
              </div>
            </div>
            <span className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors mt-6">View experience &rarr;</span>
          </Link>
        </motion.article>

        {/* ── SEO ── */}
        <motion.article
          custom={5}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.015, borderColor: "#333333" }}
          className="bg-card border border-border rounded-xl p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm shadow-black/50"
        >
          <Link href="/skills" className="flex flex-col h-full justify-between">
            <div>
              <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-neutral-800">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <h2 className="text-xl font-medium mb-2 text-foreground">Technical SEO</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                5+ years with SEMrush, Google Search Console &amp; Analytics. 100/100 Core Web Vitals. JSON-LD, structured data &amp; invisible SEO.
              </p>
            </div>
            <span className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors mt-6">View skills &rarr;</span>
          </Link>
        </motion.article>

        {/* ── Contact Row: LinkedIn + Email + Resume ── */}
        <motion.article
          custom={6}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <a
            id="home-linkedin-link"
            href="https://www.linkedin.com/in/moris-khoudari/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-6 bg-card border border-border rounded-xl hover:scale-[1.015] hover:border-neutral-700 transition-all duration-300 shadow-sm shadow-black/50"
          >
            <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center border border-neutral-800 shrink-0">
              <Linkedin className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-300">LinkedIn</p>
              <p className="text-xs text-neutral-600">moris-khoudari</p>
            </div>
            <span className="ml-auto text-neutral-600 group-hover:text-neutral-300 transition-colors">&rarr;</span>
          </a>

          <a
            id="home-email-link"
            href="mailto:moriskhoudari@gmail.com"
            className="group flex items-center gap-4 p-6 bg-card border border-border rounded-xl hover:scale-[1.015] hover:border-neutral-700 transition-all duration-300 shadow-sm shadow-black/50"
          >
            <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center border border-neutral-800 shrink-0">
              <Mail className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-300">Email</p>
              <p className="text-xs text-neutral-600">moriskhoudari@gmail.com</p>
            </div>
            <span className="ml-auto text-neutral-600 group-hover:text-neutral-300 transition-colors">&rarr;</span>
          </a>

          <a
            id="home-resume-link"
            href="/MORIS%20RESUME.pdf"
            download="MORIS RESUME.pdf"
            className="group flex items-center gap-4 p-6 bg-card border border-border rounded-xl hover:scale-[1.015] hover:border-neutral-700 transition-all duration-300 shadow-sm shadow-black/50"
          >
            <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center border border-neutral-800 shrink-0">
              <FileText className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-300">Resume</p>
              <p className="text-xs text-neutral-600">Download PDF</p>
            </div>
            <span className="ml-auto text-neutral-600 group-hover:text-neutral-300 transition-colors">&rarr;</span>
          </a>
        </motion.article>

      </section>

      {/* JSON-LD Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Moris Khoudari",
            jobTitle: "Lead Portfolio Architect & Security Auditor",
            description: "Self-taught and professionally certified Software Engineer specializing in Cybersecurity, Technical SEO, and scalable programming.",
            url: "https://moriskhoudari.com",
            sameAs: [
              "https://www.linkedin.com/in/moris-khoudari/",
              "https://github.com/moris96",
            ],
            knowsAbout: ["Cybersecurity", "Python", "Next.js", "Technical SEO", "SIEM Tools", "Zero-Trust Development"],
          }),
        }}
      />
    </main>
  );
}
