import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { Progress } from '../components/Progress';
import { Button } from '../components/Button';
import { useInterviewStore, MAX_QUESTIONS } from '../store/useInterviewStore';
import { submitAnswer, endInterview } from '../services/interview';
import { InlineReport } from '../components/InlineReport';

const QUESTION_TIME_LIMIT = 120; // seconds

/* ── Countdown Ring Component ──────────────────────────────────────────── */
function CountdownRing({ secondsLeft }: { secondsLeft: number }) {
  const pct = secondsLeft / QUESTION_TIME_LIMIT;
  const circumference = 2 * Math.PI * 16; // r=16
  const offset = circumference - pct * circumference;
  const isUrgent = secondsLeft <= 15;
  const isWarning = secondsLeft <= 30 && !isUrgent;

  const ringColor = isUrgent ? '#f87171' : isWarning ? '#fbbf24' : '#21F5D4'; // red / yellow / teal

  return (
    <div className={`relative w-12 h-12 flex items-center justify-center shrink-0 ${
      isUrgent ? 'animate-pulse' : ''
    }`}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <circle
          cx="20" cy="20" r="16" fill="none"
          stroke={ringColor}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
        />
      </svg>
      <span className={`font-label text-[10px] font-bold z-10 ${
        isUrgent ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-primary-container'
      }`}>
        {secondsLeft}
      </span>
    </div>
  );
}

/* AI Reasoning Right Panel */
function ReasoningPanel() {
  const { agentReasoning, confidenceScore, completedTopics } = useInterviewStore();

  const confidencePct = Math.min(100, Math.max(0, confidenceScore));
  const confidenceLabel =
    confidencePct >= 75 ? 'Confident' :
    confidencePct >= 50 ? 'Measured' : 'Hesitant';

  const barColor =
    confidencePct >= 75 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]' :
    confidencePct >= 50 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' :
    'bg-primary-container shadow-[0_0_10px_rgba(33,245,212,0.5)]';

  return (
    <aside className="hidden xl:flex w-72 flex-col gap-4 shrink-0 h-full justify-center">

      {/* Confidence */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-label text-[10px] text-primary-container uppercase tracking-widest">Confidence</h3>
          <span className="material-symbols-outlined text-primary-container text-[18px]">analytics</span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <p className="font-headline-xl text-headline-xl text-text-primary font-bold leading-none">
            {confidencePct}<span className="text-2xl">%</span>
          </p>
          <span className={`font-label text-[10px] uppercase tracking-widest pb-1
            ${confidencePct >= 75 ? 'text-emerald-400' : confidencePct >= 50 ? 'text-amber-400' : 'text-primary-container'}`}>
            {confidenceLabel}
          </span>
        </div>
        <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden mt-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
        {confidencePct === 0 && (
          <p className="font-label text-[9px] text-text-muted mt-2 uppercase tracking-widest">
            Updates after each answer
          </p>
        )}
      </div>

      {/* Topics Covered */}
      {completedTopics.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-label text-[10px] text-primary-container uppercase tracking-widest mb-4">
            Topics Covered
          </h3>
          <div className="flex flex-wrap gap-2">
            {completedTopics.map((t) => (
              <span key={t} className="topic-done px-3 py-1.5 rounded-full font-label text-[10px] uppercase">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Agent Reasoning */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-text-muted text-[16px]">memory</span>
          <h3 className="font-label text-[10px] text-text-muted uppercase tracking-widest">Agent Reasoning</h3>
        </div>
        <p className="font-body-md text-body-md text-text-primary italic leading-relaxed border-l-2 border-primary-container/30 pl-3 py-1 text-sm">
          {agentReasoning ||
            '"Analyzing candidate\'s response patterns to determine optimal follow-up strategy..."'}
        </p>
      </div>
    </aside>
  );
}

export default function InterviewPage() {
  const navigate = useNavigate();
  const {
    sessionId, status, setStatus, setNextQuestion,
    setReportId, addMessage, tickTimer,
  } = useInterviewStore();

  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [mobileTab, setMobileTab] = useState<'progress' | 'chat' | 'reasoning'>('chat');
  /** Seconds remaining for current question (120s limit) */
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_TIME_LIMIT);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  /** Timestamp (ms) when the current question was first displayed */
  const questionStartTimeRef = useRef<number>(Date.now());

  // Redirect if no session
  useEffect(() => {
    if (!sessionId) navigate('/prepare');
  }, [sessionId, navigate]);

  // Global timer tick (elapsed)
  useEffect(() => {
    const iv = setInterval(tickTimer, 1000);
    return () => clearInterval(iv);
  }, [tickTimer]);

  // ── Feature 4: Countdown Timer (120s) ───────────────────────────────────
  useEffect(() => {
    setSecondsLeft(QUESTION_TIME_LIMIT); // Reset on new question
    const iv = setInterval(() => {
      setSecondsLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionStartTimeRef.current]);

  // Auto-submit when timer hits 0
  const handleTimeExpired = useCallback(async () => {
    if (!sessionId || submitting || showReport) return;
    addMessage('user', '⏰ Time expired — no answer submitted.');
    setSubmitting(true);
    setStatus('thinking');
    try {
      const data = await submitAnswer(sessionId, 'Time expired.', QUESTION_TIME_LIMIT * 1000);
      if (data.completed) {
        setShowReport(true);
        setStatus('done');
        return;
      }
      if (data.nextQuestion) {
        questionStartTimeRef.current = Date.now();
        setSecondsLeft(QUESTION_TIME_LIMIT);
        setNextQuestion(data.nextQuestion, data.reasoning, data.difficulty, undefined, data.score ?? undefined, data.topic ?? undefined);
      }
    } catch { /* silent */ } finally {
      setSubmitting(false);
    }
  }, [sessionId, submitting, showReport, addMessage, setStatus, setNextQuestion]);

  useEffect(() => {
    if (secondsLeft === 0) {
      handleTimeExpired();
    }
  }, [secondsLeft, handleTimeExpired]);

  // Auto-resize textarea
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !sessionId || submitting) return;

    const myAnswer = answer.trim();
    // Capture time since question was displayed
    const timeTakenMs = Date.now() - questionStartTimeRef.current;

    setAnswer('');
    setSubmitting(true);
    addMessage('user', myAnswer);
    setStatus('thinking');

    try {
      const data = await submitAnswer(sessionId, myAnswer, timeTakenMs);

      if (data.completed) {
        setShowReport(true);
        setStatus('done');
        return;
      }

      if (data.nextQuestion) {
        // Reset the countdown clock as soon as the new question arrives
        questionStartTimeRef.current = Date.now();
        setSecondsLeft(QUESTION_TIME_LIMIT);
        setNextQuestion(data.nextQuestion, data.reasoning, data.difficulty, myAnswer, data.score ?? undefined, data.topic ?? undefined);

        // Enforce 10 question hard limit on the frontend
        const newQ = useInterviewStore.getState().questionNumber;
        if (newQ >= MAX_QUESTIONS) {
          setShowReport(true);
          setStatus('done');
        }
      }
    } catch (err: any) {
      setStatus('active');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleEnd = async () => {
    if (!sessionId || endLoading) return;
    setEndLoading(true);
    setStatus('ending');

    try {
      const data = await endInterview(sessionId);
      setReportId(data.reportId);
      navigate(`/report/${data.reportId}`);
    } catch (err) {
      console.error('End error:', err);
      setEndLoading(false);
      setStatus('active');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-background h-screen w-screen overflow-hidden flex flex-col relative">
      <div className="noise-overlay" />
      <div className="volumetric-glow absolute top-[-150px] left-[30%] w-[500px] h-[500px] opacity-40" />

      {/* ── INLINE REPORT OVERLAY ── */}
      {showReport && <InlineReport onRestart={() => navigate('/prepare')} />}

      {/* ── TOP BAR ── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border-glass">
        <div className="flex items-center justify-between px-6 md:px-20 py-4 max-w-[1440px] mx-auto">
          <button
            onClick={() => navigate('/')}
            className="font-headline text-xl text-primary tracking-tighter"
          >
            Orian
          </button>
          <div className="flex items-center gap-3">
            {/* Countdown Timer Ring */}
            {status === 'active' && !showReport && (
              <div className="flex items-center gap-2">
                <CountdownRing secondsLeft={secondsLeft} />
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hidden sm:block">
                  {secondsLeft <= 30 ? 'Time running out!' : 'Time left'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-secondary">
              <span className="w-2 h-2 rounded-full bg-secondary breathing-glow" />
              {status === 'thinking' ? 'Orian Thinking...' : status === 'ending' ? 'Generating Report...' : 'Session Active'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              onClick={handleEnd}
              loading={endLoading}
              icon="stop_circle"
              className="py-2 px-4 text-[10px]"
            >
              End Interview
            </Button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-row pt-16 pb-28 px-6 md:px-20 gap-8 max-w-[1440px] mx-auto w-full h-full items-center">

        {/* Left: Progress Timeline — desktop only */}
        <Progress className="hidden md:flex h-full py-4 justify-center" />

        {/* Center: Conversation Canvas */}
        <main className="flex-1 flex flex-col h-full relative max-w-3xl mx-auto w-full">
          {/* Mobile: show only the active tab panel */}
          <div className={`flex-1 glass-card rounded-xl relative overflow-hidden flex flex-col
            ${mobileTab === 'chat' ? 'flex' : 'hidden md:flex'}`}>
            <div className="volumetric-glow" />
            <QuestionCard className="flex-1" />
          </div>
          {/* Mobile: Progress tab */}
          <div className={`flex-1 mobile-panel-content overflow-y-auto
            ${mobileTab === 'progress' ? 'flex md:hidden flex-col py-4' : 'hidden'}`}>
            <Progress className="flex h-full py-4 justify-center" />
          </div>
          {/* Mobile: Reasoning tab */}
          <div className={`flex-1 mobile-panel-content overflow-y-auto
            ${mobileTab === 'reasoning' ? 'flex md:hidden flex-col py-4' : 'hidden'}`}>
            <ReasoningPanel />
          </div>
        </main>

        {/* Right: Agent Reasoning — desktop only */}
        <div className="hidden xl:flex">
          <ReasoningPanel />
        </div>
      </div>

      {/* ── BOTTOM INPUT BAR ── */}
      <div className="fixed bottom-0 left-0 w-full px-6 md:px-20 pb-6 pt-4 z-40 bg-gradient-to-t from-background via-background/90 to-transparent">
        <div className="max-w-3xl mx-auto flex items-end gap-3 relative">

          {/* Textarea */}
          <div className="flex-1 glass-card rounded-xl relative group focus-within:border-primary-container/40 input-glow transition-all duration-300">
            <div className="absolute inset-0 rounded-xl bg-primary-container/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center min-h-[56px] px-4">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent border-none text-text-primary font-body-lg text-body-md placeholder-text-muted focus:outline-none focus:ring-0 resize-none py-4 custom-scrollbar"
                placeholder="Type your response... (Ctrl+Enter to submit)"
                rows={1}
                value={answer}
                onChange={handleAnswerChange}
                onKeyDown={handleKeyDown}
                disabled={status === 'thinking' || status === 'ending'}
                style={{ maxHeight: '160px' }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || submitting || status === 'thinking' || status === 'ending'}
            className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
              ${answer.trim() && status === 'active'
                ? 'bg-primary-container text-on-primary shadow-glow hover:shadow-glow-lg hover:scale-110 active:scale-95'
                : 'bg-surface-container border border-border-glass text-text-muted opacity-50 cursor-not-allowed'
              }`}
            style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
          >
            {submitting
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <span className="material-symbols-outlined text-[22px]">send</span>
            }
          </button>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-2 font-label uppercase tracking-widest">
          Ctrl + Enter to submit
        </p>
      </div>

      {/* ── MOBILE TAB BAR (Phase 10) ── */}
      <nav className="mobile-tab-bar">
        <button
          className={`mobile-tab-btn ${mobileTab === 'progress' ? 'active' : ''}`}
          onClick={() => setMobileTab('progress')}
        >
          <span className="material-symbols-outlined">timeline</span>
          Progress
        </button>
        <button
          className={`mobile-tab-btn ${mobileTab === 'chat' ? 'active' : ''}`}
          onClick={() => setMobileTab('chat')}
        >
          <span className="material-symbols-outlined">chat</span>
          Chat
        </button>
        <button
          className={`mobile-tab-btn ${mobileTab === 'reasoning' ? 'active' : ''}`}
          onClick={() => setMobileTab('reasoning')}
        >
          <span className="material-symbols-outlined">analytics</span>
          Reasoning
        </button>
      </nav>
    </div>
  );
}
