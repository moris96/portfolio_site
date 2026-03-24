import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Moris Khoudari',
  description: 'Learn more about Moris Khoudari, a Lead Portfolio Architect & Security Auditor.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white">
      <div className="mb-16 mt-8">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-foreground">
          About
        </h1>
        
        <div className="space-y-8 max-w-2xl">
          <h2 className="text-xl md:text-2xl font-medium text-neutral-300 leading-relaxed">
            A self taught & professionally certified Software Engineer with a lot of interest in Cybersecurity, with a background in technical SEO.
          </h2>
          
          <p className="text-neutral-400 text-lg leading-relaxed">
            Hi, I'm Moris. I am passionate about all things tech, especially in cybersecurity, AI, and programming. My goal is bringing my passion to work and contributing to a more secure cyber environment.
          </p>
        </div>
      </div>
    </main>
  );
}
