"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
type WindowState = "open" | "minimized" | "closed";

interface TechTag {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ProjectWindowProps {
  /** Filename shown in the title bar (e.g. "sentinel-simulation.local") */
  windowTitle: string;
  /** Human-readable project name shown in the thumbnail card */
  projectName: string;
  /** Short description shown on the closed/thumbnail card */
  description: string;
  /** Tech stack tags */
  tags: TechTag[];
  /** Path to the thumbnail image (in /public) */
  thumbnail: string;
  /** The live interactive content rendered when open */
  children: React.ReactNode;
  /** Optional status indicator label, e.g. "Engine Running" */
  statusLabel?: string;
}

// ─── Traffic Light Button ─────────────────────────────────────────────────────
function TrafficLight({
  color,
  symbol,
  onClick,
  title,
}: {
  color: string;
  symbol: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`group relative w-3 h-3 rounded-full flex items-center justify-center transition-all duration-150 ${color}`}
      style={{ flexShrink: 0 }}
    >
      {/* Icon revealed on hover */}
      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 text-black/70 font-bold"
        style={{ fontSize: "7px", lineHeight: 1 }}>
        {symbol}
      </span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectWindow({
  windowTitle,
  projectName,
  description,
  tags,
  thumbnail,
  children,
  statusLabel = "Live",
}: ProjectWindowProps) {
  const [windowState, setWindowState] = useState<WindowState>("open");

  const open = () => setWindowState("open");
  const minimize = () => setWindowState("minimized");
  const close = () => setWindowState("closed");

  // ── Closed state: thumbnail card ──────────────────────────────────────────
  if (windowState === "closed") {
    return (
      <motion.div
        layoutId={`window-${windowTitle}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={open}
        className="cursor-pointer group rounded-xl border border-border bg-card overflow-hidden shadow-lg shadow-black/60 hover:border-neutral-700 transition-colors"
        role="button"
        aria-label={`Expand ${projectName}`}
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-video overflow-hidden bg-neutral-950">
          <Image
            src={thumbnail}
            alt={`${projectName} preview`}
            fill
            className="object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Reopen hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium tracking-wide">
              Click to open
            </span>
          </div>
        </div>

        {/* Meta footer */}
        <div className="px-5 py-4 border-t border-border">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-medium mb-1">Project</p>
              <h3 className="text-sm font-medium text-foreground">{projectName}</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-2">{description}</p>
            </div>
            <span className="shrink-0 mt-1 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-500 font-mono whitespace-nowrap">
              ⊞ closed
            </span>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.slice(0, 4).map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-500 rounded-full"
              >
                {Icon && <Icon className="w-2.5 h-2.5" />}
                {label}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] text-neutral-700">+{tags.length - 4} more</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Open / Minimized state: Mac window chrome ─────────────────────────────
  return (
    <motion.div
      layoutId={`window-${windowTitle}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-xl border border-border bg-card overflow-hidden shadow-lg shadow-black/60"
    >
      {/* ── Title Bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-neutral-950 select-none">
        {/* Traffic lights */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <TrafficLight
              color="bg-red-500 hover:bg-red-400"
              symbol="✕"
              onClick={close}
              title="Close (collapse to thumbnail)"
            />
            <TrafficLight
              color="bg-yellow-400 hover:bg-yellow-300"
              symbol="−"
              onClick={minimize}
              title="Minimize"
            />
            <TrafficLight
              color="bg-green-500 hover:bg-green-400"
              symbol="⤢"
              onClick={open}
              title="Expand"
            />
          </div>
          <span className="text-xs text-neutral-600 font-mono ml-2">{windowTitle}</span>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-wider">{statusLabel}</span>
        </div>
      </div>

      {/* ── Collapsable Body ── */}
      <AnimatePresence initial={false}>
        {windowState === "open" && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {/* Info strip: left meta + right highlights */}
            <div className="grid md:grid-cols-2 gap-0 border-b border-border">
              {/* Left: Project meta */}
              <div className="p-8 border-r border-border">
                <div className="flex items-center gap-3 mb-5">
                  <div>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-medium">Project</p>
                    <h2 className="text-lg font-medium text-foreground leading-tight">{projectName}</h2>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">{description}</p>
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2">
                  {tags.map(({ label, icon: Icon }) => (
                    <span
                      key={label}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 text-xs font-medium text-neutral-400 rounded-full border border-neutral-800"
                    >
                      {Icon && <Icon className="w-3 h-3" />}
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: slot for extra meta (passed as children via named prop pattern) */}
              <div className="p-8 flex flex-col justify-center">
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-medium mb-4">Preview</p>
                <div className="relative rounded-lg overflow-hidden border border-neutral-800 aspect-video bg-neutral-950">
                  <Image
                    src={thumbnail}
                    alt={`${projectName} preview`}
                    fill
                    className="object-cover object-top opacity-70"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>
            </div>

            {/* Full-width interactive content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized hint bar */}
      {windowState === "minimized" && (
        <motion.div
          key="minimized-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 py-2 bg-neutral-950/50 border-t border-border"
        >
          <button
            onClick={open}
            className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors font-mono"
          >
            ▶ Click to restore {projectName}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
