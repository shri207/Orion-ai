import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { useInterviewStore } from '../store/useInterviewStore';
import { getGuestToken, startInterview } from '../services/interview';
import { fetchCandidates, type Candidate } from '../services/candidates';
import curriculumData from '../data/curriculum.json';

const getIconForRole = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes('ai') || r.includes('machine learning')) return 'psychology';
  if (r.includes('data')) return 'database';
  if (r.includes('devops') || r.includes('infrastructure')) return 'terminal';
  if (r.includes('software') || r.includes('backend') || r.includes('frontend')) return 'code';
  if (r.includes('business') || r.includes('product') || r.includes('manager')) return 'person';
  return 'engineering';
};

export default function PreparePage() {
  const navigate = useNavigate();
  const { setToken, selectCandidate, selectCurriculum, setSession, resetSession } = useInterviewStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCurriculum = curriculumData.cohort;
  const selectedCandidateObj = candidates.find(c => c.member.id === selectedId);

  const filteredCandidates = candidates.filter(c => 
    c.member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.member.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchCandidates()
      .then(data => setCandidates(data))
      .catch(() => setCandidates([]))
      .finally(() => setCandidatesLoading(false));
  }, []);

  const handleStart = async () => {
    if (!selectedId) {
      setError('Please select a candidate.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Get guest token (required before any protected call)
      let token: string;
      try {
        token = await getGuestToken();
      } catch (tokenErr: any) {
        const msg = tokenErr?.response?.data?.error || tokenErr?.message || '';
        throw new Error(`Auth failed: ${msg || 'Could not get guest token. Check backend API_KEYS env var.'}`);
      }

      if (!token) {
        throw new Error('Backend returned an empty token. Check JWT_SECRET and API_KEYS in .env');
      }

      setToken(token);

      // 2. Store selections
      selectCandidate(selectedId);
      selectCurriculum(selectedCurriculum);

      // 3. Start interview
      let data;
      try {
        data = await startInterview(selectedId, selectedCurriculum);
      } catch (startErr: any) {
        const msg = startErr?.response?.data?.error || startErr?.response?.data?.message || startErr?.message || '';
        throw new Error(`Interview start failed: ${msg || 'Unknown error — check backend logs.'}`);
      }

      // 4. Reset any previous session state (clears timer, history, score), then save new session
      resetSession();
      setSession(data.sessionId, data.question);
      navigate('/interview');
    } catch (err: any) {
      console.error('[PreparePage] handleStart error:', err);
      setError(err?.message || 'Failed to start interview. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6 md:p-8">
      {/* Backgrounds */}
      <div className="noise-overlay" />
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="volumetric-glow top-[-100px] left-[-100px]" />
      <div className="volumetric-glow bottom-[-200px] right-[-200px] opacity-50" />

      <div className="relative w-full max-w-5xl z-10">
        {/* Back */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-muted hover:text-secondary transition-colors mb-8 font-label text-xs uppercase tracking-widest"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </motion.button>

        <div className="glass-card rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">

          {/* ── LEFT: Candidate Picker ── */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-border-glass flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="font-headline-xl text-headline-xl text-text-primary mb-2">
                Initialize Candidate
              </h1>
              <p className="font-body-md text-body-md text-text-muted">
                Select a candidate profile to begin. The AI Cohort curriculum is pre-selected.
              </p>
            </motion.div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container/50 border border-border-glass rounded-lg py-2.5 pl-10 pr-4 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container/50 focus:bg-surface-container input-glow transition-all duration-300"
                />
              </div>
            </div>

            {/* Candidate Cards */}
            <div className="mb-8 overflow-y-auto max-h-[400px] pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                {candidatesLoading ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl p-5 border border-border-glass bg-surface-container/30 animate-pulse h-24" />
                  ))
                ) : filteredCandidates.length === 0 ? (
                  <p className="col-span-full text-text-muted text-sm font-body-md">
                    No candidates found.
                  </p>
                ) : (
                  filteredCandidates.map((c, i) => (
                  <motion.div
                    key={c.member.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 26, delay: (i % 6) * 0.04 }}
                    className={`candidate-card rounded-xl p-5 border cursor-pointer group relative overflow-hidden shrink-0
                      ${selectedId === c.member.id
                        ? 'selected border-primary-container/50 bg-primary-container/10'
                        : 'border-border-glass bg-surface-container/50 hover:border-outline/40'
                      }`}
                    onClick={() => { setSelectedId(c.member.id); setError(''); }}
                  >
                    {selectedId === c.member.id && (
                      <div className="absolute inset-0 bg-primary-container/5 pointer-events-none rounded-xl" />
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                        ${selectedId === c.member.id
                          ? 'bg-primary-container/20 border border-primary-container'
                          : 'bg-surface-container border border-border-glass'
                        }`}>
                        <span className={`material-symbols-outlined text-[18px] ${selectedId === c.member.id ? 'text-primary-container' : 'text-text-muted'}`}>
                          {getIconForRole(c.member.jobRole)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0" title={`${c.member.name}, ${c.member.jobRole}`}>
                        <p className="font-body-md text-body-md text-text-primary font-medium">{c.member.name}</p>
                        <p className="font-label-md text-label-md text-text-muted">{c.member.jobRole}</p>
                        <p className="font-label text-[10px] text-primary-container mt-1">
                          {c.member.yearsExperience === 0 ? 'Entry level' : `${c.member.yearsExperience} yrs exp`}
                        </p>
                      </div>
                    </div>
                    {selectedId === c.member.id && (
                      <div className="absolute top-3 right-3">
                        <span className="material-symbols-outlined text-[18px] text-primary-container">check_circle</span>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-error font-body-md text-sm mb-4"
              >
                {error}
              </motion.p>
            )}

            <Button
              onClick={handleStart}
              loading={loading}
              disabled={!selectedId}
              icon="play_arrow"
              className="w-full rounded"
            >
              Begin Interview
            </Button>
          </div>

          {/* ── RIGHT: Curriculum + Preview ── */}
          <div className="w-full lg:w-1/2 bg-surface-elevated/40 p-8 lg:p-12 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="font-headline-lg text-headline-lg text-text-primary mb-2">Curriculum</h2>
              <div className="flex items-center gap-2 font-label text-[10px] text-primary-container uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary-container breathing-glow shadow-glow" />
                SELECTED: {selectedCurriculum.toUpperCase()}
              </div>
            </motion.div>

            {/* Curriculum Modules */}
            <div className="flex flex-col gap-2 mb-8 h-full max-h-[300px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {curriculumData.modules.map((mod, i) => {
                const isExpanded = expandedModule === mod.n;
                const moduleDays = curriculumData.days.filter(d => d.day >= mod.days[0] && d.day <= mod.days[1]);

                return (
                  <div key={mod.n} className="flex flex-col">
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      onClick={() => setExpandedModule(isExpanded ? null : mod.n)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-label text-[11px] tracking-widest transition-all duration-200 border flex items-center justify-between
                        ${isExpanded 
                          ? 'bg-primary-container/15 border-primary-container/50 text-primary-container shadow-glow' 
                          : 'bg-surface-card border-border-glass text-text-muted hover:border-outline/40 hover:text-on-surface'
                        }`}
                    >
                      <span className="uppercase truncate pr-4">{mod.title}</span>
                      <span className="material-symbols-outlined text-[16px] shrink-0">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </motion.button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pl-6 border-l border-border-glass ml-4 mt-2 mb-2 flex flex-col gap-3">
                            {moduleDays.map(day => (
                              <div key={day.day}>
                                <div className="font-label text-[10px] text-primary-container mb-0.5 uppercase tracking-widest">Day {day.day}</div>
                                <div className="font-body-md text-sm text-on-surface-variant leading-tight">{day.title}</div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Preview Panel */}
            <div className={`flex-grow flex flex-col gap-6 transition-all duration-700 ${selectedId ? 'opacity-100' : 'opacity-30 grayscale'}`}>
              <div className="w-full border border-primary-container/20 bg-primary-container/5 rounded-lg p-5 flex flex-col gap-3 relative overflow-hidden group my-2">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50" />
                
                <h4 className="font-label text-[10px] text-primary-container uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-container breathing-glow shadow-glow" />
                  Interview Protocol
                </h4>
                
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="flex flex-col gap-1 border-r border-border-glass">
                    <span className="font-label text-[9px] text-text-muted uppercase tracking-widest">Base Duration</span>
                    <span className="font-body-md text-sm text-text-primary">8+ Questions</span>
                  </div>
                  <div className="flex flex-col gap-1 border-r border-border-glass pl-3">
                    <span className="font-label text-[9px] text-text-muted uppercase tracking-widest">Topology</span>
                    <span className="font-body-md text-sm text-text-primary">Adaptive Depth</span>
                  </div>
                  <div className="flex flex-col gap-1 pl-3 min-w-0">
                    <span className="font-label text-[9px] text-text-muted uppercase tracking-widest">Target Context</span>
                    <span className="font-body-md text-sm text-text-primary truncate" title={selectedId ? selectedCandidateObj?.member.jobRole : 'Awaiting Profile'}>
                      {selectedId ? selectedCandidateObj?.member.jobRole : 'Awaiting'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-card p-4 rounded-lg border border-border-glass flex flex-col justify-start overflow-hidden max-h-[250px]">
                  <h4 className="font-label text-[10px] text-text-muted uppercase tracking-widest mb-3 flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-sm">task_alt</span>Missions
                  </h4>
                  <div className="overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                    <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
                      {selectedCandidateObj ? (
                        selectedCandidateObj.missions.map(m => (
                          <li key={m.title} className="flex flex-col gap-0.5" title={`${m.title} - ${m.passed ? 'Passed' : m.skipped ? 'Skipped' : 'Failed'}`}>
                            <div className="flex items-center gap-2">
                              {m.passed ? (
                                <span className="material-symbols-outlined text-[14px] text-primary-container shrink-0">check</span>
                              ) : m.skipped ? (
                                <span className="material-symbols-outlined text-[14px] text-text-muted shrink-0">horizontal_rule</span>
                              ) : (
                                <span className="material-symbols-outlined text-[14px] text-error shrink-0">close</span>
                              )}
                              <span className="truncate flex-1 text-xs">{m.title}</span>
                            </div>
                            <div className="pl-5 font-label text-[9px] text-text-muted tracking-widest uppercase">
                              {m.skipped ? 'Skipped' : `${m.passed ? 'Passed' : 'Failed'} · ${m.attempts} attempt${m.attempts !== 1 ? 's' : ''}`}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-text-muted text-xs italic">Select candidate</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="bg-surface-card p-4 rounded-lg border border-border-glass flex flex-col justify-between max-h-[250px]">
                  <div>
                    <h4 className="font-label text-[10px] text-text-muted uppercase tracking-widest mb-4 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">monitoring</span>Signals
                    </h4>
                    
                    {selectedCandidateObj ? (
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="font-label text-[9px] text-text-muted uppercase tracking-widest">Commitment</div>
                          <div className="font-headline text-lg text-text-primary">{selectedCandidateObj.signals.commitDays} <span className="text-sm text-text-muted">days</span></div>
                        </div>
                        <div>
                          <div className="font-label text-[9px] text-text-muted uppercase tracking-widest">Missions</div>
                          <div className="font-headline text-lg text-text-primary">{selectedCandidateObj.signals.missionsCompleted} <span className="text-sm text-text-muted">completed</span></div>
                        </div>
                        <div>
                          <div className="font-label text-[9px] text-text-muted uppercase tracking-widest">First Try</div>
                          <div className="font-headline text-lg text-primary-container">{selectedCandidateObj.signals.missionsFirstTry}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-text-muted text-xs italic">Select candidate to view signals</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
