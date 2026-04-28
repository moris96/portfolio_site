"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Globe } from "lucide-react";

const MOCK_INTEL: Record<string, { confidence: number; country: string; isp: string; reports: number; lastSeen: string }> = {
  "185.220.101.47": { confidence: 100, country: "Unknown / VPN", isp: "DigitalOcean (Common Botnet Origin)", reports: 847, lastSeen: "2 min ago" },
  "45.155.205.233":  { confidence: 98,  country: "Russia (RU)",   isp: "Serverius Holding (TOR Exit Node)",    reports: 612, lastSeen: "5 min ago" },
  "199.195.249.79":  { confidence: 97,  country: "Unknown / VPN", isp: "Frantech Solutions (Bulletproof Host)", reports: 391, lastSeen: "12 min ago" },
  "23.129.64.218":   { confidence: 95,  country: "Unknown / VPN", isp: "Quintex Alliance (TOR Exit)",           reports: 274, lastSeen: "8 min ago" },
  "175.45.176.0":    { confidence: 100, country: "North Korea (KP)", isp: "STAR-KP (State-Sponsored)",          reports: 503, lastSeen: "1 min ago" },
  "210.52.109.22":   { confidence: 93,  country: "China (CN)",    isp: "CHINANET (APT41 Infrastructure)",       reports: 228, lastSeen: "18 min ago" },
};

const DEFAULT_INTEL = { confidence: 72, country: "Unknown", isp: "Unknown ISP", reports: 14, lastSeen: "unknown" };

interface Props {
  ip: string | null;
  onClose: () => void;
}

export default function IpModal({ ip, onClose }: Props) {
  const intel = ip ? (MOCK_INTEL[ip] ?? DEFAULT_INTEL) : DEFAULT_INTEL;

  return (
    <AnimatePresence>
      {ip && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-neutral-950 border border-red-900/60 rounded-xl shadow-2xl shadow-red-950/50 font-mono text-xs overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/80">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[11px] uppercase tracking-widest text-neutral-400">AbuseIPDB Enrichment</span>
              </div>
              <button onClick={onClose} className="text-neutral-600 hover:text-neutral-300 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              {/* IP */}
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                <Globe className="w-3 h-3 text-neutral-600" />
                <span className="text-red-400 font-bold text-sm">{ip}</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded border border-red-800 bg-red-950/60 text-red-400 uppercase font-bold">
                  MALICIOUS
                </span>
              </div>

              {/* Fields */}
              {[
                { label: "Confidence Score", value: `${intel.confidence}%`, color: intel.confidence >= 90 ? "text-red-400" : "text-yellow-400" },
                { label: "Country", value: intel.country, color: "text-neutral-300" },
                { label: "ISP", value: intel.isp, color: "text-orange-400" },
                { label: "Total Reports", value: `${intel.reports} reports`, color: "text-neutral-300" },
                { label: "Last Seen", value: intel.lastSeen, color: "text-neutral-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-neutral-600 shrink-0">{label}</span>
                  <span className={`${color} text-right`}>{value}</span>
                </div>
              ))}

              {/* Confidence bar */}
              <div className="pt-1">
                <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${intel.confidence}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full"
                  />
                </div>
                <p className="text-[9px] text-neutral-700 mt-1">Abuse confidence score (AbuseIPDB API)</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
