import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Moris Khoudari',
  description: 'View the security-first portfolio projects of Moris Khoudari.',
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white">
      <div className="mb-16 mt-8">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-foreground">
          Portfolio
        </h1>
        <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed mb-4">
          A showcase of robust, battle-tested applications, systems, and educational projects designed for maximum efficiency and hardened through industry-leading security practices.
        </p>
        <p className="text-sm font-medium text-neutral-500 italic mb-12">
          Fun fact: this website was made using Next.js & Google Antigravity (what the cool kids use to build websites, but I prefer Antigravity over Claude Code because of the cleaner UI)
        </p>
      </div>
    </main>
  );
}
