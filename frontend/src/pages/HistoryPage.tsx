import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { getSessions, type SessionSummary } from '../services/sessions';

/* ── Score badge ── */
function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full font-label text-[10px] uppercase tracking-widest bg-surface-container-high text-on-surface-variant">
        N/A
      </span>
    );
  }
  const cls =
    score >= 80 ? 'badge-medium' :
    score >= 60 ? 'badge-easy' :
                  'badge-hard';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-label text-[10px] uppercase tracking-widest ${cls}`}>
      {score}%
    </span>
  );
}

/* ── Status chip ── */
function StatusChip({ status }: { status: string }) {
  const icon = status === 'completed' ? 'check_circle' : status === 'active' ? 'radio_button_checked' : 'schedule';
  const color =
    status === 'completed' ? 'text-primary-container' :
    status === 'active'    ? 'text-secondary' :
                             'text-on-surface-variant';
  return (
    <span className={`flex items-center gap-1 font-label text-[10px] uppercase tracking-widest ${color}`}>
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {status}
    </span>
  );
}

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-outline-variant/10 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-surface-container-high shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-3 w-32 bg-surface-container-high rounded" />
        <div className="h-2.5 w-20 bg-surface-container-high rounded" />
      </div>
      <div className="h-6 w-16 bg-surface-container-high rounded-full" />
    </div>
  );
}

/* ── Session row ── */
function SessionRow({ s, index }: { s: SessionSummary; index: number }) {
  const navigate = useNavigate();
  const duration = s.duration
    ? `${Math.floor(s.duration / 60)}m ${s.duration % 60}s`
    : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 border-b border-outline-variant/10 hover:bg-surface-container-high/40 transition-colors duration-300 group"
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary-container text-[16px]">person</span>
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-on-surface">{s.candidateName}</p>
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">{s.curriculum}</span>
          <span className="text-outline-variant">·</span>
          <span className="font-label text-[10px] text-on-surface-variant">
            {s.startTime ? new Date(s.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
          </span>
          <span className="text-outline-variant">·</span>
          <span className="font-label text-[10px] text-on-surface-variant">{duration}</span>
        </div>
      </div>

      {/* Status */}
      <div className="hidden md:block">
        <StatusChip status={s.status} />
      </div>

      {/* Score */}
      <ScoreBadge score={s.score} />

      {/* View Report */}
      <div className="flex gap-2">
        {s.reportId ? (
          <button
            onClick={() => navigate(`/report/${s.reportId}`)}
            className="btn-primary py-1.5 px-4 text-[10px] rounded opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity"
          >
            Report
          </button>
        ) : (
          <span className="w-[72px]" />
        )}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   HISTORY PAGE
   ════════════════════════════════════════════ */
const PAGE_SIZE = 15;

export default function HistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(0);
  const [total, setTotal]       = useState(0);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getSessions(PAGE_SIZE, page * PAGE_SIZE);
        setSessions(data.sessions);
        setTotal(data.total);
      } catch {
        // API unavailable — show empty state, no mock data
        setSessions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const filtered = sessions.filter(s =>
    search.trim() === '' ||
    s.candidateName.toLowerCase().includes(search.toLowerCase()) ||
    s.curriculum.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex min-h-screen bg-background">
      <div className="noise-overlay" />
      <Sidebar />

      <main className="flex-1 md:pl-64 p-6 md:p-10 max-w-screen-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-headline text-headline-lg text-on-surface leading-tight">Interview History</h1>
            <p className="font-body text-body-md text-on-surface-variant mt-1">
              All past sessions — {total} total.
            </p>
          </div>
          <button onClick={() => navigate('/prepare')} className="btn-primary rounded self-start sm:self-auto">
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Interview
          </button>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mb-6 relative"
        >
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search by name or curriculum…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/20 rounded-lg
                       font-body text-sm text-on-surface placeholder-on-surface-variant
                       focus:outline-none focus:border-primary-container/40 focus:ring-1 focus:ring-primary-container/20
                       input-glow transition-all duration-300"
          />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          {/* Table header */}
          <div className="hidden sm:flex items-center gap-4 px-5 py-3 border-b border-outline-variant/15 bg-surface-container/50">
            <div className="w-9 shrink-0" />
            <div className="flex-1 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Candidate</div>
            <div className="hidden md:block w-28 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Status</div>
            <div className="w-16 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Score</div>
            <div className="w-[72px]" />
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[56px]">history</span>
                <p className="font-body text-sm text-on-surface-variant mt-3">
                  {search ? 'No results match your search.' : 'No interview sessions yet.'}
                </p>
                {!search && (
                  <button onClick={() => navigate('/prepare')} className="btn-primary mt-4 rounded mx-auto">
                    Start your first interview
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {filtered.map((s, i) => <SessionRow key={s.sessionId} s={s} index={i} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <button
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="btn-ghost py-1.5 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              Page {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              className="btn-ghost py-1.5 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
