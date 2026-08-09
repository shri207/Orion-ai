import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Card } from '../components/Card';

/* WebGL shader background (from original Stitch screen) */
function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize();

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = vec3(0.027, 0.082, 0.078);
  float pulse = sin(u_time * 0.2) * 0.5 + 0.5;
  vec2 mouseNorm = u_mouse / u_resolution;
  float dist = distance(uv, mix(vec2(0.5, 0.7), mouseNorm, 0.3));
  color += vec3(0.129, 0.961, 0.831) * (1.0 - smoothstep(0.0, 0.8, dist)) * 0.15 * pulse;
  float streak = sin(uv.x * 2.0 + uv.y * 1.5 + u_time * 0.5) * 0.5 + 0.5;
  color += vec3(0.3, 0.94, 0.83) * streak * 0.05;
  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233) + u_time)) * 43758.5453);
  color += noise * 0.02;
  gl_FragColor = vec4(color, 1.0);
}`;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes  = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse= gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width && r.height) {
        mouse.x = ((e.clientX - r.left) / r.width) * canvas.width;
        mouse.y = (1 - (e.clientY - r.top) / r.height) * canvas.height;
      }
    };
    window.addEventListener('mousemove', onMove);

    let raf: number;
    const render = (t: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes)  gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse)gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-20"
      style={{ display: 'block' }}
    />
  );
}

const FEATURES = [
  {
    icon: 'psychology',
    title: 'Adaptive Intelligence',
    desc: 'The AI adjusts difficulty in real-time based on your answers, creating a truly personalized experience.',
    float: 1 as const,
  },
  {
    icon: 'analytics',
    title: 'Deep Analysis',
    desc: 'Multi-dimensional scoring across technical depth, communication, confidence, and problem-solving.',
    float: 2 as const,
  },
  {
    icon: 'auto_awesome',
    title: 'Cinematic Interface',
    desc: 'An interview experience as elegant as the intelligence behind it. Built for the AI era.',
    float: 3 as const,
  },
];

const TOPICS = ['Prompt Engineering', 'RAG', 'Vector DB', 'MCP', 'Deployment', 'Fine-tuning'];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setActiveTopic((p) => (p + 1) % TOPICS.length), 2000);
    return () => clearInterval(iv);
  }, []);

  // Spawn floating particles
  useEffect(() => {
    const container = document.getElementById('particle-container');
    if (!container) return;
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'floating-particle';
      const size = Math.random() * 4 + 1;
      p.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random()*100}vw;
        bottom:-10px;
        animation-duration:${Math.random()*15+10}s;
        animation-delay:${Math.random()*10}s;
      `;
      container.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach((p) => p.remove());
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Shader background */}
      <ShaderBackground />
      {/* Noise overlay */}
      <div className="noise-overlay" />
      {/* Particle container */}
      <div id="particle-container" className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border-glass">
        <div className="flex justify-between items-center px-6 md:px-20 py-5 max-w-[1440px] mx-auto">
          <div className="font-headline text-2xl text-primary tracking-tighter">Orian</div>
          <div className="hidden md:flex gap-8 font-label text-xs uppercase tracking-widest">
            {['Features','How It Works','Demo'].map((l) => (
              <a key={l} href="#" className="text-on-surface-variant hover:text-secondary transition-colors duration-300 px-3 py-1 rounded hover:bg-white/5">
                {l}
              </a>
            ))}
          </div>
          <button
            onClick={() => navigate('/prepare')}
            className="btn-primary rounded-full py-2 px-5"
          >
            Start Interview
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="flex-grow flex flex-col justify-center items-center relative z-20 px-6 md:px-20 mt-24 md:mt-0 min-h-screen">
        <div className="spotlight" />

        <motion.div
          className="text-center mb-16 relative z-30 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary-container breathing-glow" />
            <span className="font-label text-[10px] uppercase tracking-widest text-primary-container">
              AI-Powered Interview Intelligence by Orian
            </span>
          </div>

          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tighter mb-6 drop-shadow-2xl">
            Orian<br /><span className="text-secondary">The Interviewer</span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-4">
            Adaptive AI interviews, crafted for the cinematic era.
          </p>

          {/* Animated topic chip */}
          <div className="flex items-center justify-center gap-3 text-sm text-text-muted font-label uppercase tracking-widest">
            <span>Now covering:</span>
            <motion.span
              key={activeTopic}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="badge-medium px-3 py-1 rounded-full"
            >
              {TOPICS[activeTopic]}
            </motion.span>
          </div>
        </motion.div>

        {/* Hero glass panel */}
        <motion.div
          className="glass-card rounded-xl p-8 md:p-12 max-w-2xl w-full flex flex-col items-center gap-8 relative z-30"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="w-full h-32 bg-surface-container-low/50 rounded-lg border border-border-glass flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-glow-teal opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
            <span className="material-symbols-outlined text-primary text-6xl opacity-80 group-hover:scale-110 transition-transform duration-500">
              memory
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              id="start-interview-btn"
              onClick={() => navigate('/access')}
              className="btn-primary rounded-full py-4 px-8 text-sm flex-1"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              Start Interview
            </button>
            <button
              className="btn-ghost rounded-full py-4 px-8 text-sm flex-1"
              onClick={() => navigate('/access')}
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              Browse Curriculum
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-on-surface-variant bounce-subtle">
          <span className="font-label text-[10px] uppercase tracking-widest opacity-60">Discover</span>
          <span className="material-symbols-outlined opacity-60">expand_more</span>
        </div>
      </main>

      {/* ── FEATURES ── */}
      <section className="relative z-20 px-6 md:px-20 py-24 max-w-[1440px] mx-auto w-full">
        <motion.h2
          className="font-headline-lg text-headline-lg text-primary text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Intelligence, Engineered
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Card float={f.float} className="p-8 h-full">
                <div className="w-12 h-12 rounded-full bg-primary-container/15 border border-primary-container/20 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary-container text-[24px]">{f.icon}</span>
                </div>
                <h3 className="font-headline text-xl text-text-primary mb-3">{f.title}</h3>
                <p className="font-body-md text-body-md text-text-muted leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-surface-container-lowest border-t border-border-glass py-12 relative z-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-headline text-xl text-primary">Orian</div>
          <div className="flex gap-6 font-body-md text-body-md text-text-muted">
            {['Privacy','Terms','Contact','Status'].map((l) => (
              <a key={l} href="#" className="hover:text-secondary transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-text-muted font-body-md text-body-md text-sm">
            © 2025 Orian — The Interviewer. Engineered for the cinematic AI era.
          </div>
        </div>
      </footer>
    </div>
  );
}
