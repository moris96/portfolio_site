"use client";

import { motion } from "framer-motion";
import { Shield, Search, Code, Lock, Server } from "lucide-react";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="min-h-screen p-8 md:p-24 max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white">
      <motion.header 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-16 mt-8"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-foreground">
          Cybersecurity Portfolio <br className="hidden md:block" />
          <span className="text-neutral-500">Moris Khoudari</span>
        </h1>
        <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
          Lead Portfolio Architect & Security Auditor. Specializing in zero-trust development, technical SEO, and scalable programming.
        </p>
      </motion.header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
        
        {/* Hero Cell: Project Alpha */}
        <motion.article 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          whileHover={{ scale: 1.02, borderColor: "#333333" }}
          className="md:col-span-2 md:row-span-2 bg-card border border-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer transition-colors shadow-sm shadow-black/50"
        >
          <div>
            <div className="bg-neutral-900 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-neutral-800">
              <Shield className="w-6 h-6 text-neutral-300" />
            </div>
            <h2 className="text-3xl font-medium mb-4 text-foreground">Threat Intelligence Platform</h2>
            <p className="text-neutral-400 mb-8 max-w-md leading-relaxed">
              A comprehensive enterprise-grade threat modeling system that aggregates data from disparate sources to identify emerging security vulnerabilities and system anomalies.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-neutral-900 text-xs font-medium text-neutral-300 rounded-full border border-neutral-800">Next.js 14</span>
              <span className="px-3 py-1.5 bg-neutral-900 text-xs font-medium text-neutral-300 rounded-full border border-neutral-800">Python Analysis</span>
              <span className="px-3 py-1.5 bg-neutral-900 text-xs font-medium text-neutral-300 rounded-full border border-neutral-800">OWASP Hardened</span>
            </div>
          </div>
          <div className="flex items-center text-sm font-medium text-neutral-500 group-hover:text-neutral-300 transition-colors mt-8">
            View Live System &rarr;
          </div>
        </motion.article>

        {/* Small Cell: Security */}
        <motion.article 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          whileHover={{ scale: 1.02, borderColor: "#333333" }}
          className="bg-card border border-border rounded-xl p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm shadow-black/50"
        >
          <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-neutral-800">
            <Lock className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2 text-foreground">Security-First</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">Default deny configuration, rigorous RBAC, and Argon2 cryptographic hashing.</p>
          </div>
        </motion.article>

        {/* Small Cell: SEO */}
        <motion.article 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          whileHover={{ scale: 1.02, borderColor: "#333333" }}
          className="bg-card border border-border rounded-xl p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm shadow-black/50"
        >
          <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-neutral-800">
            <Search className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2 text-foreground">Technical SEO</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">Achieving 100/100 Core Web Vitals with precise semantic JSON-LD structures.</p>
          </div>
        </motion.article>

        {/* Medium Cell: Project Beta */}
        <motion.article 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          whileHover={{ scale: 1.02, borderColor: "#333333" }}
          className="md:col-span-2 bg-card border border-border rounded-xl p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm shadow-black/50"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-neutral-800">
                <Server className="w-5 h-5 text-neutral-400" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground">Secure Architecture Shift</h3>
              <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">Privacy-first infrastructure implementation utilizing zero-trust encrypted algorithms to secure user data.</p>
            </div>
            <div className="text-neutral-500 group-hover:text-neutral-300 transition-colors">
              &rarr;
            </div>
          </div>
        </motion.article>

        {/* Small Cell: Personal/Stack */}
        <motion.article 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          whileHover={{ scale: 1.02, borderColor: "#333333" }}
          className="bg-card border border-border rounded-xl p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm shadow-black/50"
        >
          <div className="bg-neutral-900 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-neutral-800">
            <Code className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2 text-foreground">Tech Stack</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">Next.js App Router, Tailwind v4, & Framer Motion.</p>
          </div>
        </motion.article>

      </section>

      {/* SoftwareApplication Schema for Tools */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Threat Intelligence Platform",
            applicationCategory: "SecurityApplication",
            operatingSystem: "Web",
            description: "Advanced threat modeling system utilizing telemetry aggregation to detect anomalies."
          })
        }}
      />
    </main>
  );
}
