import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  FileText, 
  Briefcase, 
  Code, 
  ChevronLeft, 
  ExternalLink,
  Linkedin,
  Mail,
  Github,
  Award,
  Zap
} from 'lucide-react';

// --- Background Components ---

const Background = () => {
  const circles = [300, 600, 900, 1200, 1500, 1800];
  
  return (
    <div className="bg-concentric flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 1400 1400" preserveAspectRatio="xMidYMid slice">
        {circles.map((radius, idx) => (
          <React.Fragment key={radius}>
            <circle 
              className="circle-line" 
              cx="700" cy="700" 
              r={radius / 2} 
              strokeOpacity={0.35 - (idx * 0.05)}
              strokeWidth="0.8"
            />
            {/* Elegant Energy Particles */}
            {[0, 120, 240].map((offset) => (
              <circle key={`${radius}-${offset}`} className="particle" r="1.5" opacity={0.6}>
                <animateMotion 
                  dur={`${30 + idx * 12}s`} 
                  begin={`${offset / 10}s`}
                  repeatCount="indefinite" 
                  path={`M 700, ${700 - radius/2} a ${radius/2},${radius/2} 0 1,1 0,${radius} a ${radius/2},${radius/2} 0 1,1 0,-${radius}`} 
                />
              </circle>
            ))}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

// --- Page Components ---

const PageLayout = ({ children, onBack, title, subtitle }: { children?: React.ReactNode, onBack: () => void, title: string, subtitle?: string }) => (
  <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-xl overflow-y-auto px-6 py-16 md:py-24 fade-in">
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={onBack} 
        className="fixed top-8 left-8 flex items-center text-gray-400 hover:text-black transition-all group z-[60] bg-white/80 p-3 rounded-full md:bg-transparent md:p-0"
      >
        <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden md:block ml-2 uppercase tracking-[0.4em] text-[10px] font-bold">Return to Center</span>
      </button>
      
      <header className="mb-20 border-b border-gray-100 pb-12">
        <h2 className="text-xs uppercase tracking-[0.6em] text-gray-400 font-bold mb-6">{subtitle}</h2>
        <h1 className="text-5xl md:text-9xl font-bold tracking-tighter leading-none text-black drop-shadow-sm">{title}</h1>
      </header>
      
      <div className="pb-32">
        {children}
      </div>

      <footer className="mt-24 pt-14 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[10px] tracking-[0.3em] uppercase font-bold gap-8">
        <div className="flex flex-col items-center md:items-start">
          <span>Armand Richelet-Kleinberg</span>
          <span className="text-[8px] opacity-60">Architect | Designer | Developer</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-black transition-colors">GitHub</a>
          <a href="#" className="hover:text-black transition-colors">Email</a>
        </div>
        <span className="opacity-50">© 2025</span>
      </footer>
    </div>
  </div>
);

const CVContent = () => (
  <div className="space-y-24">
    <section>
      <p className="text-2xl md:text-5xl font-light leading-tight text-gray-800 max-w-4xl tracking-tight">
        Mastering the intersection of <span className="font-bold">Artificial Intelligence</span>, 
        <span className="font-bold italic text-gray-400"> Product Design</span>, 
        and <span className="font-bold underline decoration-gray-200 underline-offset-8">Robust Technical Architecture</span>.
      </p>
    </section>

    <div className="grid md:grid-cols-3 gap-16">
      <div className="md:col-span-2 space-y-16">
        <section>
          <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-black mb-10 opacity-30">Professional Trajectory</h3>
          <div className="space-y-12">
            {[
              { role: "Principal Solutions Architect", company: "AI Enterprise Labs", period: "2022 — Present", desc: "Leading the architectural vision for generative AI ecosystems within Fortune 500 infrastructures." },
              { role: "Senior Product Designer", company: "NextGen Systems", period: "2019 — 2022", desc: "Crafting intuitive digital experiences for complex analytical data tools." },
              { role: "Full Stack Engineer", company: "Creative Tech Corp", period: "2016 — 2019", desc: "Building scalable web applications with a focus on high-performance rendering." }
            ].map((job, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-baseline border-b border-gray-50 pb-4 group-hover:border-black transition-colors duration-500">
                  <h4 className="text-2xl font-bold tracking-tight">{job.role}</h4>
                  <span className="text-xs font-mono text-gray-300">{job.period}</span>
                </div>
                <p className="text-sm uppercase tracking-widest text-gray-400 font-bold mt-2">{job.company}</p>
                <p className="text-gray-600 mt-4 leading-relaxed font-light">{job.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-12">
        <section>
          <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-black mb-10 opacity-30">Core Engine</h3>
          <div className="flex flex-wrap gap-2">
            {["LLMs", "RAG", "Python", "React", "TypeScript", "UI/UX", "GraphQL", "Rust", "Node.js", "Docker"].map(skill => (
              <span key={skill} className="px-3 py-1 border border-gray-100 text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:border-black hover:text-black transition-all cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </section>
        <section className="bg-gray-50 p-8 rounded-sm">
          <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-black mb-6">Education</h3>
          <p className="font-bold text-sm tracking-tight uppercase">MSc Artificial Intelligence</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Polytechnique Institute</p>
        </section>
      </aside>
    </div>
  </div>
);

// --- Main Application ---

const App = () => {
  const [activePage, setActivePage] = useState<'home' | 'cv' | 'portfolio' | 'projects'>('home');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const radius = useMemo(() => {
    if (typeof window === 'undefined') return 120;
    const base = Math.min(window.innerWidth, window.innerHeight);
    return isMobile ? base * 0.36 : base * 0.32;
  }, [isMobile]);

  const menuItems = [
    { id: 'cv', label: 'Resume', icon: <FileText size={isMobile ? 22 : 28} strokeWidth={1.5} />, angle: -90 },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase size={isMobile ? 22 : 28} strokeWidth={1.5} />, angle: 30 },
    { id: 'projects', label: 'Projects', icon: <Code size={isMobile ? 22 : 28} strokeWidth={1.5} />, angle: 150 },
  ];

  const titleSegments = [
    "AI Principal Solutions Architect",
    "Full Stack Developer",
    "Business & Technical Analyst"
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white select-none">
      <Background />

      {/* Main Orchestrator */}
      <div className={`relative w-full transition-all duration-1000 ease-in-out ${activePage !== 'home' ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        
        {/* Typographic Core Hierarchy */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center pointer-events-none px-3">
          
          {/* 1. THE NAME: Refined spacing and weight for aesthetic alignment */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 mb-2 md:mb-4">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[-0.04em] text-gray-400 leading-none">
              Armand
            </h1>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[-0.04em] text-gray-400 leading-none">
              Richelet-Kleinberg
            </h1>
          </div>

          {/* 2. THE TITLE: Perfectly balanced width and vertical spacing */}
          <div className="w-full max-w-3xl pt-3 border-t border-gray-100 mt-2">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 max-w-2xl mx-auto">
              {titleSegments.map((segment, i) => (
                <React.Fragment key={i}>
                  <span className="text-[10px] md:text-[13px] font-bold tracking-[0.3em] uppercase text-black drop-shadow-sm text-center leading-relaxed">
                    {segment}
                  </span>
                  {i < titleSegments.length - 1 && (
                    <span className="hidden md:inline-block w-1 h-1 rounded-full bg-gray-800 opacity-60 self-center"></span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="h-px w-24 md:w-32 bg-gray-50 mt-12 opacity-50"></div>
        </div>

        {/* The Balanced Star System */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {menuItems.map((item) => {
            const rad = (item.angle * Math.PI) / 180;
            const x = radius * Math.cos(rad);
            const y = radius * Math.sin(rad);

            return (
              <React.Fragment key={item.id}>
                {/* Visual Connector: Adjusted opacity and origin for seamless 'plug-in' feel */}
                <div 
                  className="absolute star-branch-container origin-left z-0"
                  style={{
                    width: `${radius}px`,
                    height: '1px',
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${item.angle}deg)`,
                  }}
                >
                  <div className="star-branch w-full h-full bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200" />
                </div>

                {/* The Round Button Node */}
                <div
                  style={{ 
                    transform: `translate(${x}px, ${y}px)`
                  }}
                  className="absolute z-20 flex items-center justify-center pointer-events-auto"
                >
                  <button
                    onClick={() => setActivePage(item.id as any)}
                    className="menu-btn group relative flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-white border border-gray-100 shadow-xl shadow-gray-200/50 active:scale-95 transition-all outline-none"
                  >
                    {/* Centered Icon Container */}
                    <div className="flex items-center justify-center text-gray-400 group-hover:text-black transition-colors duration-500 z-10 w-full h-full p-1">
                      {item.icon}
                    </div>
                    
                    {/* Ripple/Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    
                    {/* Centered Label beneath Circle */}
                    <span className="absolute -bottom-10 md:-bottom-14 w-40 text-center text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-gray-300 group-hover:text-black transition-all">
                      {item.label}
                    </span>
                  </button>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Pages Integration */}
      {activePage === 'cv' && (
        <PageLayout title="CAREER" subtitle="Architectural Path" onBack={() => setActivePage('home')}>
          <CVContent />
        </PageLayout>
      )}

      {activePage === 'portfolio' && (
        <PageLayout title="WORKS" subtitle="Digital Artifacts" onBack={() => setActivePage('home')}>
          <div className="grid md:grid-cols-2 gap-20">
            {[
              { title: "NeuroSync", desc: "A neural-symbolic AI interface for real-time strategic modeling.", role: "Architect & Designer", tech: "PyTorch + React" },
              { title: "Prism OS", desc: "Design system for distributed cloud computing environments.", role: "Product Lead", tech: "TypeScript + Figma" },
              { title: "Flux Insight", desc: "High-frequency data visualization for market liquidity flows.", role: "Full Stack Developer", tech: "Rust + WebGL" },
              { title: "Cognito Lab", desc: "Experimental R&D workspace for Human-AI collaboration.", role: "Lead Analyst", tech: "Next.js + OpenAI API" }
            ].map((item, i) => (
              <div key={i} className="group border-l border-gray-100 pl-10 py-4 hover:border-black transition-all duration-700">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-[1px] bg-gray-200"></span>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-gray-300 font-bold">{item.role}</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 group-hover:translate-x-4 transition-transform duration-700">{item.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed text-lg mb-8 max-w-md">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gray-300">{item.tech}</span>
                  <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                    Detail <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </PageLayout>
      )}

      {activePage === 'projects' && (
        <PageLayout title="ENGINEERING" subtitle="Technical Stacks" onBack={() => setActivePage('home')}>
          <div className="space-y-12">
            {[
              { name: "Global RAG Pipeline", status: "In Production", impact: "Reduced latency by 45%", icon: <Zap size={18} /> },
              { name: "Modular Micro-Frontend", status: "Architecture Phase", impact: "Scaling to 200+ micro-apps", icon: <Award size={18} /> },
              { name: "Auto-UI Gen", status: "R&D", impact: "Dynamic interface generation via LLMs", icon: <Code size={18} /> }
            ].map((p, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between group p-10 bg-white border border-gray-50 hover:border-black transition-all rounded-sm">
                <div className="flex items-center gap-10">
                  <div className="text-gray-200 group-hover:text-black transition-colors">{p.icon}</div>
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight">{p.name}</h3>
                    <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">{p.status}</p>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 text-right">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">{p.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </PageLayout>
      )}

      {/* Social Links - Balanced Bottom Center Alignment */}
      <nav className={`fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-row items-center justify-center gap-10 md:gap-14 transition-all duration-1000 delay-500 z-[45] ${activePage === 'home' ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <a href="#" className="p-3 bg-white/40 backdrop-blur-md shadow-sm border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"><Linkedin size={22} strokeWidth={1.2} /></a>
        <a href="#" className="p-3 bg-white/40 backdrop-blur-md shadow-sm border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"><Github size={22} strokeWidth={1.2} /></a>
        <a href="#" className="p-3 bg-white/40 backdrop-blur-md shadow-sm border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"><Mail size={22} strokeWidth={1.2} /></a>
      </nav>
      
      {/* Central Visual Anchor */}
      {activePage === 'home' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-200 rounded-full pointer-events-none opacity-40 z-0" />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);