import { Metadata } from 'next';
import { Mail, Linkedin, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Moris Khoudari',
  description: 'Get in touch for cybersecurity auditing and architecture consulting.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen p-8 md:p-24 max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white">
      <div className="mb-16 mt-8">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-foreground">
          Contact
        </h1>
        <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed mb-12">
          Let's drink some coffee and get to know each other
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
          <a
            href="https://www.linkedin.com/in/moris-khoudari/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-center gap-4 p-6 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl hover:scale-[1.02] hover:border-[#3F3F46] hover:bg-[#111] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2 text-white">
              <Linkedin className="w-6 h-6" />
              <h2 className="font-medium">LinkedIn</h2>
            </div>
            <p className="text-[#A1A1AA] text-sm">Click here to visit my Linkedin</p>
          </a>

          <a
            href="mailto:moriskhoudari@gmail.com"
            className="group flex flex-col justify-center gap-4 p-6 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl hover:scale-[1.02] hover:border-[#3F3F46] hover:bg-[#111] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2 text-white">
              <Mail className="w-6 h-6" />
              <h2 className="font-medium">Email</h2>
            </div>
            <p className="text-[#A1A1AA] text-sm">Click here to send me an email</p>
          </a>

          <a
            href="/MORIS%20RESUME.pdf"
            download="MORIS RESUME.pdf"
            className="group flex flex-col justify-center gap-4 p-6 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl hover:scale-[1.02] hover:border-[#3F3F46] hover:bg-[#111] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2 text-white">
              <FileText className="w-6 h-6 shrink-0" />
              <h2 className="font-medium leading-tight">My Resume (for recruiters & hiring managers)</h2>
            </div>
            <p className="text-[#A1A1AA] text-sm">Click here to download my resume</p>
          </a>
        </div>
      </div>
    </main>
  );
}
