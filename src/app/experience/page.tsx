import { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';
import GoogleCertCard from '@/components/GoogleCertCard';

export const metadata: Metadata = {
  title: 'Experience | Moris Khoudari',
  description: 'Professional experience and certifications.',
};

export default function ExperiencePage() {
  return (
    <main className="min-h-screen p-8 md:p-24 max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white">
      <div className="mb-16 mt-8">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-foreground">
          Experience
        </h1>
        <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed mb-12">
          A track record of my professional certifications, continuous learning, and previous experiences.
        </p>

        <section>
          <h2 className="text-2xl font-medium text-white mb-6">Professional Certifications</h2>
          
          <div className="grid grid-cols-1 gap-6 max-w-3xl">
            {/* General Assembly Card */}
            <article className="group p-8 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl hover:scale-[1.01] hover:border-[#3F3F46] hover:bg-[#111] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-neutral-800 group-hover:bg-neutral-500 transition-colors" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 mt-2">
                <div className="flex items-start gap-6">
                  <div className="relative w-24 h-24 rounded-2xl bg-white p-3 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src="/galogo.jpg"
                      alt="general assembly software engineering certification tech programming javascript python html"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="max-w-[280px] md:max-w-[400px]">
                    <h3 className="text-xl font-medium text-white mb-2 leading-snug">
                      Software Engineering Immersive Remote (Flex) | 420 hours
                    </h3>
                    <p className="text-[#A1A1AA] text-lg">General Assembly</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-neutral-500 bg-neutral-900 px-3 py-1.5 rounded-full whitespace-nowrap self-start border border-[#1F1F1F]">
                  Issued February 2023
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1F1F1F]">
                <a
                  href="https://docs.google.com/document/d/1gv9vTNJVEUrcnZJ9F7QITdZYD5UebjfcekpewuFyzMY/edit?tab=t.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors w-fit"
                >
                  <span>Show credential</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>

            {/* Expandalbe Google Cert Card */}
            <GoogleCertCard />

          </div>
        </section>
      </div>
    </main>
  );
}
