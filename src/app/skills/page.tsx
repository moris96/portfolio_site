import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills | Moris Khoudari',
  description: 'Technical skills and cybersecurity proficiencies.',
};

type SkillProps = {
  name: string;
  percentage: number;
  proficiency: string;
  experience: string;
};

function SkillBar({ name, percentage, proficiency, experience }: SkillProps) {
  return (
    <div className="mb-8 last:mb-0 group">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-white">{name}</h3>
        <span className="text-sm font-medium text-white">{percentage}%</span>
      </div>
      
      {/* Progress Track */}
      <div className="h-1.5 w-full bg-[#1F1F1F] rounded-full overflow-hidden mb-4">
        {/* Progress Fill */}
        <div 
          className="h-full bg-white rounded-full transition-all duration-[1500ms] ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[11px] px-2 py-1 rounded-md bg-[#0A0A0A] border border-[#1F1F1F] text-zinc-400 font-medium tracking-wide uppercase">
          {proficiency}
        </span>
        <span className="text-[11px] px-2 py-1 rounded-md bg-[#0A0A0A] border border-[#1F1F1F] text-zinc-400 font-medium tracking-wide uppercase">
          {experience}
        </span>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const programmingSkills = [
    { name: 'Python', percentage: 80, proficiency: 'Professional', experience: '6 Years Experience' },
    { name: 'SQL', percentage: 30, proficiency: 'Beginner-Intermediate', experience: '1 Year Experience' },
    { name: 'Linux', percentage: 80, proficiency: 'Professional', experience: '7 Years Experience' },
    { name: 'JavaScript', percentage: 80, proficiency: 'Professional', experience: '7 Years Experience' },
    { name: 'HTML', percentage: 80, proficiency: 'Professional', experience: '7 Years Experience' },
    { name: 'C#', percentage: 50, proficiency: 'Intermediate', experience: '2 Years Experience' },
  ];

  const cybersecuritySkills = [
    { name: 'Network Traffic Analysis: Packet Capture', percentage: 50, proficiency: 'Beginner-Intermediate', experience: '1 Year Experience' },
    { name: 'Network Traffic Analysis: Mapping', percentage: 50, proficiency: 'Beginner-Intermediate', experience: '1 Year Experience' },
    { name: 'Threat Intel: Artifact Analysis (VirusTotal)', percentage: 50, proficiency: 'Beginner-Intermediate', experience: '1 Year Experience' },
    { name: 'SIEM Tools & Security Monitoring', percentage: 50, proficiency: 'Beginner-Intermediate', experience: '1 Year Experience' },
  ];

  const seoSkills = [
    { name: 'Keyword Analysis', percentage: 90, proficiency: 'Professional', experience: '5 Years Experience' },
    { name: 'SEMrush', percentage: 90, proficiency: 'Professional', experience: '5 Years Experience' },
    { name: 'Google Search Console', percentage: 90, proficiency: 'Professional', experience: '5 Years Experience' },
    { name: 'Google Analytics', percentage: 90, proficiency: 'Professional', experience: '5 Years Experience' },
  ];

  const aiSkills = [
    { name: 'ChatGPT', percentage: 90, proficiency: 'Professional', experience: '3 Years Experience' },
    { name: 'Google Gemini', percentage: 90, proficiency: 'Professional', experience: '3 Years Experience' },
    { name: 'Claude Code', percentage: 80, proficiency: 'Professional', experience: '2 Years Experience' },
  ];

  return (
    <main className="min-h-screen p-8 md:p-24 max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white">
      <div className="mb-16 mt-8">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-foreground">
          Skills & Proficiencies
        </h1>
        <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed mb-12">
          Mastery across system architecture, technical SEO, and adversarial threat modeling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Tech & Programming & AI Column */}
        <div className="flex flex-col gap-6">
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 lg:p-8 flex flex-col gap-8 transition-transform hover:scale-[1.01] duration-300">
            <div className="border-b border-[#1F1F1F] pb-4">
              <h2 className="text-xl font-medium text-white tracking-tight">Tech & Programming</h2>
            </div>
            <div>
              {programmingSkills.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </section>

          {/* AI & Prompting Card */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 lg:p-8 flex flex-col gap-8 transition-transform hover:scale-[1.01] duration-300">
            <div className="border-b border-[#1F1F1F] pb-4">
              <h2 className="text-xl font-medium text-white tracking-tight">AI & Prompting</h2>
            </div>
            <div>
              {aiSkills.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </section>
        </div>

        {/* Cybersecurity & SEO Column */}
        <div className="flex flex-col gap-6">
          {/* Cybersecurity Card */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 lg:p-8 flex flex-col gap-8 transition-transform hover:scale-[1.01] duration-300">
            <div className="border-b border-[#1F1F1F] pb-4">
              <h2 className="text-xl font-medium text-white tracking-tight">Cybersecurity</h2>
            </div>
            <div>
              {cybersecuritySkills.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </section>

          {/* SEO Card */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 lg:p-8 flex flex-col gap-8 transition-transform hover:scale-[1.01] duration-300">
            <div className="border-b border-[#1F1F1F] pb-4">
              <h2 className="text-xl font-medium text-white tracking-tight">SEO</h2>
            </div>
            <div>
              {seoSkills.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
