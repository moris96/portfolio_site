"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, ChevronUp, Code2, X } from "lucide-react";

export interface AlertItem {
  id: string;
  severity: "CRITICAL" | "HIGH" | "WARN";
  rule: string;
  src_ip: string;
  geo: string;
  ts: string;
  attempts: number;
}

type AlertStatus = "New" | "Triage" | "Resolved";

const SIGMA_RULE = `title: Web Brute Force Detection
id: sigma-web-bf-001
status: stable
logsource:
  category: webserver
detection:
  selection:
    status: 401
  condition: selection | count() > 10
level: high
tags:
  - attack.credential_access
  - attack.t1110`;

const STATUS_STYLES: Record<AlertStatus, string> = {
  New: "text-red-400 bg-red-950/50 border-red-800",
  Triage: "text-yellow-400 bg-yellow-950/50 border-yellow-800",
  Resolved: "text-green-500 bg-green-950/50 border-green-800",
};

const NEXT_STATUS: Record<AlertStatus, AlertStatus> = {
  New: "Triage",
  Triage: "Resolved",
  Resolved: "New",
};

interface Props {
  alerts: AlertItem[];
  onDrillDown: (ip: string | null) => void;
  activeIp: string | null;
  onDismiss: (id: string) => void;
}

export default function AlertQueue({ alerts, onDrillDown, activeIp, onDismiss }: Props) {
  const [statuses, setStatuses] = useState<Record<string, AlertStatus>>({});
  const [showSigma, setShowSigma] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  const getStatus = (id: string): AlertStatus => statuses[id] ?? "New";
  const cycleStatus = (id: string) =>
    setStatuses((p) => ({ ...p, [id]: NEXT_STATUS[getStatus(id)] }));
  const toggleSigma = (id: string) =>
    setShowSigma((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden mb-4 font-mono text-xs">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-950 border-b border-neutral-800 hover:bg-neutral-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[11px] uppercase tracking-widest text-neutral-400">
            Alert Queue
          </span>
          {alerts.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-400 text-[9px] font-bold">
              {alerts.length}
            </span>
          )}
        </div>
        {collapsed ? (
          <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-neutral-600" />
        )}
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {alerts.length === 0 ? (
              <div className="px-4 py-6 text-center text-neutral-700">
                No active alerts — system nominal
              </div>
            ) : (
              <div className="divide-y divide-neutral-900">
                <AnimatePresence>
                  {alerts.map((a) => {
                    const status = getStatus(a.id);
                    const isActive = activeIp === a.src_ip;
                    return (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`p-4 transition-colors ${
                          isActive ? "bg-red-950/20" : "bg-neutral-950/60 hover:bg-neutral-900/40"
                        }`}
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-red-400 font-bold">{a.id}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded border border-red-800 bg-red-950/60 text-red-400 uppercase font-bold">
                              {a.severity}
                            </span>
                            <span className="text-neutral-600">·</span>
                            <span className="text-neutral-500">{a.rule}</span>
                          </div>
                          <button
                            onClick={() => onDismiss(a.id)}
                            className="text-neutral-700 hover:text-neutral-400 transition-colors shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-[10px]">
                          <span className="text-neutral-600">
                            src: <span className="text-red-400">{a.src_ip}</span>
                          </span>
                          <span className="text-neutral-600">
                            geo: <span className="text-neutral-400">{a.geo}</span>
                          </span>
                          <span className="text-neutral-600">
                            attempts:{" "}
                            <span className="text-orange-400 font-bold">{a.attempts}</span>
                          </span>
                          <span className="text-neutral-600">{a.ts}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => onDrillDown(isActive ? null : a.src_ip)}
                            className={`px-2.5 py-1 rounded border text-[10px] font-medium transition-all ${
                              isActive
                                ? "border-red-700 bg-red-950 text-red-300"
                                : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-red-700 hover:text-red-400"
                            }`}
                          >
                            {isActive ? "▶ Filtering Feed" : "▶ Investigate"}
                          </button>
                          <button
                            onClick={() => toggleSigma(a.id)}
                            className="px-2.5 py-1 rounded border border-neutral-800 bg-neutral-900 text-neutral-500 hover:text-neutral-300 text-[10px] transition-colors flex items-center gap-1"
                          >
                            <Code2 className="w-2.5 h-2.5" />
                            View Logic
                          </button>
                          <button
                            onClick={() => cycleStatus(a.id)}
                            className={`ml-auto px-2 py-0.5 rounded border text-[9px] font-bold uppercase transition-colors ${STATUS_STYLES[status]}`}
                          >
                            {status}
                          </button>
                        </div>

                        {/* SIGMA Rule */}
                        <AnimatePresence>
                          {showSigma[a.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden"
                            >
                              <pre className="mt-3 p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] text-green-400/80 leading-relaxed overflow-x-auto">
                                {SIGMA_RULE}
                              </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
