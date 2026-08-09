import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AccessPage() {
  const navigate = useNavigate();

  // Floating particles
  useEffect(() => {
    const container = document.getElementById('particles-container-access');
    if (!container) return;
    
    const particleCount = 15;
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full blur-[1px] pointer-events-none';
      
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}vw`;
      particle.style.top = `${y}vh`;
      particle.style.backgroundColor = Math.random() > 0.7 ? '#44e9ce' : '#21f5d4';
      particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
      
      container.appendChild(particle);
      particles.push(particle);
    }
    
    return () => particles.forEach(p => p.remove());
  }, []);

  return (
    <div className="antialiased font-body min-h-screen flex flex-col relative overflow-hidden bg-background text-text-primary">
      {/* Cinematic Overlays */}
      <div className="noise-overlay" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[radial-gradient(ellipse_at_top,rgba(33,245,212,0.15)_0%,transparent_70%)] pointer-events-none opacity-60 z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(circle_at_center,rgba(33,245,212,0.15)_0%,transparent_60%)] pointer-events-none opacity-30 z-0" />
      <div id="particles-container-access" className="fixed inset-0 overflow-hidden pointer-events-none z-0" />

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center relative z-10 px-6 py-20 w-full max-w-[1440px] mx-auto">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-display text-4xl md:text-display-lg text-text-primary tracking-tight mb-4">
            Access the Orian Protocol
          </h1>
          <p className="font-body text-lg md:text-body-lg text-text-muted max-w-2xl mx-auto">
            Secure your session within the Orian ecosystem.
          </p>
        </motion.div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          
          {/* Left Card: Candidate Login */}
          <motion.div 
            className="glass-card p-10 flex flex-col h-full relative group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(33,245,212,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none -z-10" />
            <div className="mb-8 flex items-center justify-between">
              <span className="material-symbols-outlined text-primary-container text-4xl">person</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-text-muted bg-surface-container-high px-3 py-1 rounded-sm border border-border-glass">Portal Alpha</span>
            </div>
            <h2 className="font-headline text-4xl md:text-headline-lg text-text-primary mb-4">Candidate Login</h2>
            <p className="font-body text-base md:text-body-md text-text-muted mb-10 flex-grow">
              Enter your interview session and showcase your expertise. Connect securely to your Orian evaluation protocol.
            </p>
            <button 
              onClick={() => navigate('/prepare')}
              className="btn-primary w-full group flex items-center justify-center gap-2 py-3 px-6 rounded"
            >
              Enter Session
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </button>
          </motion.div>

          {/* Right Card: Interviewer Login */}
          <motion.div 
            className="glass-card p-10 flex flex-col h-full relative group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(33,245,212,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none -z-10" />
            <div className="mb-8 flex items-center justify-between">
              <span className="material-symbols-outlined text-secondary text-4xl">admin_panel_settings</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-text-muted bg-surface-container-high px-3 py-1 rounded-sm border border-border-glass">Portal Omega</span>
            </div>
            <h2 className="font-headline text-4xl md:text-headline-lg text-text-primary mb-4">Interviewer Login</h2>
            <p className="font-body text-base md:text-body-md text-text-muted mb-10 flex-grow">
              Review assessments, manage talent pools, and access Orian’s AI insights. Authenticate to oversee ongoing protocols.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full group flex items-center justify-center gap-2 py-3 px-6 rounded border border-border-glass text-text-primary hover:bg-white/5 transition-colors duration-300 font-label text-sm font-semibold tracking-widest uppercase"
            >
              Access Dashboard
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </button>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 py-12 w-full max-w-[1440px] mx-auto opacity-60">
          <div className="font-headline text-xl text-primary mb-4 md:mb-0">
            Orian
          </div>
          <div className="flex gap-6 mb-4 md:mb-0">
            {['Privacy Policy', 'Terms of Service', 'Security'].map(l => (
              <a key={l} href="#" className="font-body text-label-md tracking-widest uppercase text-on-surface-variant hover:text-secondary transition-all">{l}</a>
            ))}
          </div>
          <div className="font-body text-label-md tracking-widest uppercase text-on-surface-variant text-center md:text-right">
            © 2025 Orian — The Interviewer. High-fidelity cinematic intelligence.
          </div>
        </div>
      </footer>
    </div>
  );
}
