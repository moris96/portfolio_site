"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, ExternalLink } from 'lucide-react';

export default function GoogleCertCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.article 
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="group cursor-pointer p-8 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl hover:border-[#3F3F46] hover:bg-[#111] transition-colors relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-neutral-800 group-hover:bg-blue-500/50 transition-colors" />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="relative w-24 h-24 rounded-2xl bg-white p-3 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
            <ShieldCheck className="w-12 h-12 text-blue-600" />
          </div>
          <div className="max-w-[280px] md:max-w-[400px]">
            <h3 className="text-xl font-medium text-white mb-2 leading-snug">
              Google Cybersecurity Professional Certificate
            </h3>
            <p className="text-[#A1A1AA] text-lg mb-4">Coursera Foundation</p>
            
            <div className="w-full bg-neutral-900 rounded-full h-2 mb-2 border border-[#1F1F1F] overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-blue-500 h-full rounded-full" 
              />
            </div>
            <p className="text-sm text-neutral-500 font-medium">68% Completed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 self-start mt-2 md:mt-0">
          <div className="text-sm font-medium text-neutral-500 bg-neutral-900 px-3 py-1.5 rounded-full whitespace-nowrap border border-[#1F1F1F]">
            In Progress
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="p-2 rounded-full bg-neutral-900 border border-[#1F1F1F] text-neutral-400 group-hover:text-white group-hover:bg-neutral-800 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inner cards
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-8 mt-8 border-t border-[#1F1F1F]">
              <h4 className="text-neutral-400 text-sm mb-4 font-medium uppercase tracking-wider">Foundation Modules</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Foundations of Cybersecurity',
                    issued: 'Mar 2026',
                    credentialId: 'L5NILITYOOBB',
                    credentialLink: 'https://www.coursera.org/account/accomplishments/verify/L5NILITYOOBB'
                  },
                  {
                    title: 'Tools of the Trade: Linux and SQL',
                    issued: 'Mar 2026',
                    credentialId: 'GE5IMBONMAZV',
                    credentialLink: 'https://www.coursera.org/account/accomplishments/verify/GE5IMBONMAZV'
                  },
                  {
                    title: 'Assets, Threats, and Vulnerabilities',
                    issued: 'Mar 2026',
                    credentialId: 'RPLX0P634Q43',
                    credentialLink: 'https://www.coursera.org/account/accomplishments/verify/RPLX0P634Q43'
                  },
                  {
                    title: 'Play it Safe: Manage Security Risks',
                    issued: 'Mar 2026',
                    credentialId: '6AHCRZWKB7UV',
                    credentialLink: 'https://www.coursera.org/account/accomplishments/verify/6AHCRZWKB7UV'
                  },
                  {
                    title: 'Connect and Protect: Network and Network Security',
                    issued: 'Mar 2026',
                    credentialId: '80I5CY2KUFUE',
                    credentialLink: 'https://www.coursera.org/account/accomplishments/verify/80I5CY2KUFUE'
                  }
                ].map((mod, index) => (
                  <motion.div 
                    key={mod.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex flex-col p-6 bg-neutral-900 border border-[#1F1F1F] rounded-xl hover:bg-neutral-800 hover:border-[#3F3F46] transition-all cursor-default ${!mod.credentialLink ? 'items-center justify-center' : 'justify-between'}`}
                  >
                    <div className={!mod.credentialLink ? "text-center" : ""}>
                      <span className="text-white font-medium block mb-2">{mod.title}</span>
                      {mod.issued && (
                        <p className="text-xs text-neutral-400 mb-1">Issued {mod.issued}</p>
                      )}
                      {mod.credentialId && (
                        <p className="text-xs text-neutral-400 font-mono mb-6">Credential ID {mod.credentialId}</p>
                      )}
                    </div>
                    {mod.credentialLink && (
                      <a
                        href={mod.credentialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 mt-auto bg-neutral-800 hover:bg-white hover:text-black text-white text-xs font-medium rounded-lg transition-colors border border-[#1F1F1F]"
                      >
                        Show credential
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
