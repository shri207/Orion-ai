import { motion, AnimatePresence } from 'framer-motion';
import { useInterviewStore } from '../store/useInterviewStore';

interface Props {
  onRestart: () => void;
}

function CircleScore({ score }: { score: number }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <circle 
          className="drop-shadow-[0_0_8px_rgba(33,245,212,0.5)] transition-all duration-1000 ease-out" 
          cx="50" cy="50" fill="none" r="45" stroke="#21F5D4" 
          strokeDasharray={`${dash} ${circ}`} 
          strokeWidth="2" 
        />
      </svg>
      <div className="text-center">
        <div className="font-display text-5xl text-primary font-medium tracking-tighter">{score}</div>
        <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">Overall Score</div>
      </div>
    </div>
  );
}

export function InlineReport({ onRestart }: Props) {
  const { answerHistory, elapsedSeconds, selectedCurriculum, selectedCandidateId } = useInterviewStore();

  const totalScore = answerHistory.length > 0
    ? Math.round(answerHistory.reduce((s, r) => s + r.score, 0) / answerHistory.length)
    : 0;

  // Group by topic for the breakdown
  const topicScores = answerHistory.reduce((acc, curr) => {
    const t = curr.topic || 'General Concepts';
    if (!acc[t]) acc[t] = { total: 0, count: 0 };
    acc[t].total += curr.score;
    acc[t].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);

  const topics = Object.entries(topicScores).map(([name, data]) => ({
    name,
    score: Math.round(data.total / data.count)
  }));

  const strengths = answerHistory.filter(a => a.score >= 75);
  const weaknesses = answerHistory.filter(a => a.score < 65);

  const mm = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const ss = (elapsedSeconds % 60).toString().padStart(2, '0');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-2xl overflow-y-auto custom-scrollbar pt-12 pb-24"
      >
        <div className="noise-overlay pointer-events-none" />
        <div className="volumetric-glow absolute top-[-100px] left-[-100px]" />
        <div className="volumetric-glow absolute bottom-[-200px] right-[-200px] opacity-50" />

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10 flex flex-col gap-12">
          
          {/* Hero Section */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col md:flex-row justify-between items-center gap-12"
          >
            <div className="flex-1 space-y-4">
              <h1 className="font-display text-4xl md:text-6xl text-primary font-normal tracking-tight leading-tight">
                Technical Assessment Report
              </h1>
              <p className="font-body text-lg text-on-surface-variant">
                Candidate: <span className="text-on-surface font-medium">{selectedCandidateId || 'Anonymous'}</span> | 
                Curriculum: <span className="text-on-surface font-medium">{selectedCurriculum || 'General Technical'}</span> |
                Duration: <span className="text-on-surface font-medium">{mm}:{ss}</span>
              </p>
            </div>
            <CircleScore score={totalScore} />
          </motion.header>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Topic Breakdown */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card rounded-xl p-8 col-span-1 md:col-span-7 flex flex-col gap-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <h2 className="font-headline text-2xl text-on-surface mb-2 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">bar_chart</span>
                Topic Breakdown
              </h2>
              <div className="space-y-5">
                {topics.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">No topics covered.</p>
                ) : topics.map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-body text-on-surface">{t.name}</span>
                      <span className="font-body text-primary-container">{t.score}%</span>
                    </div>
                    <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container rounded-full opacity-90 transition-all duration-1000" style={{ width: `${t.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Strengths & Weaknesses */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card rounded-xl p-8 col-span-1 md:col-span-5 flex flex-col gap-8"
            >
              <h2 className="font-headline text-2xl text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">balance</span>
                Assessment
              </h2>
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">add_circle</span> Strengths
                  </h3>
                  <ul className="space-y-3 font-body text-sm text-on-surface">
                    {strengths.length === 0 ? (
                      <li className="text-on-surface-variant text-xs">No distinct strengths identified yet.</li>
                    ) : strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 opacity-70 shrink-0" />
                        <span className="line-clamp-2" title={s.topic}>{s.topic}: Solid understanding demonstrated.</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full h-px bg-outline-variant/30" />
                <div>
                  <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-error/70">remove_circle</span> Areas to Probe
                  </h3>
                  <ul className="space-y-3 font-body text-sm text-on-surface">
                    {weaknesses.length === 0 ? (
                      <li className="text-on-surface-variant text-xs">No major weaknesses identified.</li>
                    ) : weaknesses.slice(0, 3).map((w, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-error/50 mt-1.5 opacity-70 shrink-0" />
                        <span className="line-clamp-2" title={w.topic}>{w.topic}: Requires deeper discussion.</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Answer History Deep Dive */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card rounded-xl p-8 col-span-1 md:col-span-12 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <h2 className="font-headline text-2xl text-on-surface mb-6 flex items-center gap-3 relative z-10">
                <span className="material-symbols-outlined text-primary-container">lightbulb</span>
                Detailed Q&A Log
              </h2>
              <div className="space-y-4 relative z-10">
                {answerHistory.map((record, i) => {
                  const pct = record.score;
                  const color = pct >= 75 ? 'text-emerald-400' : pct >= 55 ? 'text-amber-400' : 'text-red-400';
                  
                  return (
                    <div key={i} className="bg-surface-container/40 rounded-xl p-5 border border-border-glass/40 hover:bg-surface-container/60 transition-colors">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <p className="font-body-md text-sm text-on-surface font-medium leading-snug">
                          <span className="text-on-surface-variant mr-2">Q{i + 1}.</span> 
                          {record.question}
                        </p>
                        <span className={`font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-border-glass shrink-0 ${color}`}>
                          Score: {pct}%
                        </span>
                      </div>
                      <div className="bg-background/40 rounded-lg p-3">
                        <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Candidate Answer</p>
                        <p className="font-body text-xs text-on-surface/90 leading-relaxed">{record.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-4"
          >
            <button
              onClick={onRestart}
              className="px-8 py-4 rounded font-label text-sm uppercase tracking-widest bg-primary text-on-primary hover:bg-primary-fixed-dim transition-colors flex items-center justify-center gap-2"
            >
              Start New Interview
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-4 rounded font-label text-sm uppercase tracking-widest border border-outline-variant text-on-surface-variant hover:border-primary-container/40 hover:text-on-surface transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              Save Report
            </button>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
