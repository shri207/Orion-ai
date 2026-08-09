import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { getSessions, type SessionSummary } from '../services/sessions';
import { getLeaderboard, type LeaderboardEntry } from '../services/report';

/* ── tiny sparkline drawn with inline SVG ── */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 120, h = 36;
  const max = Math.max(...values, 1);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-24 h-9 overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke="#21F5D4"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="drop-shadow-[0_0_4px_rgba(33,245,212,0.5)]"
      />
    </svg>
  );
}

/* ── stat card ── */
function StatCard({
  icon,
  label,
  value,
  sub,
  delay = 0,
  sparkValues,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  delay?: number;
  sparkValues?: number[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="glass-card rounded-xl p-6 flex flex-col gap-3"
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-center justify-between">
        <span className="material-symbols-outlined text-primary-container text-[22px]">{icon}</span>
        {sparkValues && <Sparkline values={sparkValues} />}
      </div>
      <div>
        <p className="font-display text-3xl text-primary tracking-tight leading-none">{value}</p>
        {sub && (
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">{sub}</p>
        )}
      </div>
      <p className="font-body text-xs text-on-surface-variant">{label}</p>
    </motion.div>
  );
}

/* ── activity row ── */
function ActivityRow({ s, index }: { s: SessionSummary; index: number }) {
  const navigate = useNavigate();
  const scoreColor =
    s.score === null ? 'text-on-surface-variant' :
    s.score >= 80    ? 'text-primary-container' :
    s.score >= 60    ? 'text-secondary' :
                       'text-amber-400';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05, ease: 'easeOut' }}
      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-surface-container-high transition-colors duration-200 group"
    >
      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary-container text-[16px]">person</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-on-surface truncate">{s.candidateName}</p>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {s.curriculum} · {s.startTime ? new Date(s.startTime).toLocaleDateString() : '—'}
        </p>
      </div>
      <span className={`font-body text-sm font-semibold ${scoreColor}`}>
        {s.score !== null ? `${s.score}%` : '—'}
      </span>
      {s.reportId && (
        <button
          onClick={() => navigate(`/report/${s.reportId}`)}
          className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost py-1 px-3 text-[10px] rounded"
        >
          Report
        </button>
      )}
    </motion.div>
  );
}

/* ── leaderboard row ── */
function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const navigate = useNavigate();
  const rankMedal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
  const scoreColor =
    entry.overallScore >= 80 ? 'text-primary-container' :
    entry.overallScore >= 60 ? 'text-secondary' :
                               'text-amber-400';
  const barWidth = `${entry.overallScore}%`;

  const hiring = entry.hiringRecommendation?.toLowerCase() || '';
  const hiringBadgeClass =
    hiring.includes('strong hire') ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' :
    (hiring.includes('hire') && !hiring.includes('no')) ? 'text-green-400 bg-green-400/10 border-green-400/20' :
    hiring.includes('lean hire') ? 'text-teal-400 bg-teal-400/10 border-teal-400/20' :
    hiring.includes('maybe') ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
    hiring.includes('lean no') ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' :
    hiring.includes('no hire') ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : '';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 + index * 0.04, ease: 'easeOut' }}
      className="group hover:bg-surface-container-high transition-colors duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer"
      onClick={() => entry.reportId && navigate(`/report/${entry.reportId}`)}
    >
      <td className="px-4 py-3 text-center">
        {rankMedal
          ? <span className="text-lg">{rankMedal}</span>
          : <span className="font-label text-[11px] text-on-surface-variant">#{entry.rank}</span>}
      </td>
      <td className="px-4 py-3">
        <p className="font-body text-sm text-on-surface">{entry.candidateName}</p>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{entry.jobRole}</p>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell text-[10px] font-label text-on-surface-variant uppercase tracking-widest">
        {entry.generatedAt ? new Date(entry.generatedAt).toLocaleDateString() : '—'}
      </td>
      {/* Hiring verdict badge */}
      <td className="px-4 py-3 hidden lg:table-cell">
        {entry.hiringRecommendation && hiringBadgeClass ? (
          <span className={`px-2 py-1 rounded-full font-label text-[9px] uppercase tracking-widest border whitespace-nowrap ${hiringBadgeClass}`}>
            {entry.hiringRecommendation}
          </span>
        ) : (
          <span className="font-label text-[10px] text-on-surface-variant">—</span>
        )}
      </td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden hidden md:block">
            <div
              className="h-full bg-primary-container rounded-full shadow-[0_0_6px_rgba(33,245,212,0.4)] transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ width: barWidth }}
            />
          </div>
          <span className={`font-body text-sm font-semibold ${scoreColor} whitespace-nowrap`}>
            {entry.overallScore}%
          </span>
        </div>
      </td>
    </motion.tr>
  );
}

/* ── quick action card ── */
function QuickAction({
  icon, label, desc, onClick, delay,
}: { icon: string; label: string; desc: string; onClick: () => void; delay: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card rounded-xl p-5 text-left flex flex-col gap-3 cursor-pointer w-full"
    >
      <span className="material-symbols-outlined text-primary-container text-[24px]">{icon}</span>
      <div>
        <p className="font-body text-sm text-on-surface">{label}</p>
        <p className="font-label text-[10px] text-on-surface-variant mt-0.5">{desc}</p>
      </div>
    </motion.button>
  );
}

/* ════════════════════════════════════════════
   DASHBOARD PAGE
   ════════════════════════════════════════════ */
export default function DashboardPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSessions(10);
        setSessions(data.sessions);
      } catch {
        // show placeholder data
        setSessions([
          { sessionId: 'demo-1', candidateId: 'cand-001', candidateName: 'Alex Chen', curriculum: 'AI Systems', status: 'completed', score: 87, startTime: new Date(Date.now() - 86400000).toISOString(), duration: 3240, reportId: null },
          { sessionId: 'demo-2', candidateId: 'cand-002', candidateName: 'Maria Garcia', curriculum: 'Backend Engineering', status: 'completed', score: 74, startTime: new Date(Date.now() - 172800000).toISOString(), duration: 2880, reportId: null },
          { sessionId: 'demo-3', candidateId: 'cand-003', candidateName: 'Sam Patel', curriculum: 'Frontend Engineering', status: 'completed', score: 91, startTime: new Date(Date.now() - 259200000).toISOString(), duration: 3600, reportId: null },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    getLeaderboard()
      .then(setLeaderboard)
      .catch(() => {
        // placeholder leaderboard
        setLeaderboard([
          { rank: 1, reportId: '', candidateName: 'Sam Patel',    jobRole: 'AI Engineer',      overallScore: 91, generatedAt: new Date(Date.now() - 259200000).toISOString() },
          { rank: 2, reportId: '', candidateName: 'Alex Chen',    jobRole: 'ML Researcher',    overallScore: 87, generatedAt: new Date(Date.now() - 86400000).toISOString() },
          { rank: 3, reportId: '', candidateName: 'Maria Garcia', jobRole: 'Backend Engineer', overallScore: 74, generatedAt: new Date(Date.now() - 172800000).toISOString() },
        ]);
      })
      .finally(() => setLeaderboardLoading(false));
  }, []);

  const scores = sessions.filter(s => s.score !== null).map(s => s.score as number);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const topCurriculum = sessions.length
    ? [...sessions].sort((a, b) =>
        sessions.filter(s => s.curriculum === b.curriculum).length -
        sessions.filter(s => s.curriculum === a.curriculum).length
      )[0]?.curriculum ?? '—'
    : '—';

  return (
    <div className="flex min-h-screen bg-background">
      <div className="noise-overlay" />
      <Sidebar />

      <main className="flex-1 md:pl-64 p-6 md:p-10 max-w-screen-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-10"
        >
          <h1 className="font-headline text-headline-lg text-on-surface leading-tight">Dashboard</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            Your interview performance at a glance.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon="assignment_turned_in"
            label="Total interviews conducted"
            value={loading ? '—' : sessions.length}
            sub="Sessions"
            delay={0}
          />
          <StatCard
            icon="star"
            label="Average score across all sessions"
            value={loading ? '—' : avgScore ? `${avgScore}%` : '—'}
            sub="Avg. Score"
            delay={0.05}
            sparkValues={scores.length >= 2 ? scores : undefined}
          />
          <StatCard
            icon="trending_up"
            label="Best performing session score"
            value={loading ? '—' : scores.length ? `${Math.max(...scores)}%` : '—'}
            sub="Best Score"
            delay={0.1}
          />
          <StatCard
            icon="menu_book"
            label="Most practised curriculum area"
            value={loading ? '—' : topCurriculum}
            sub="Top Curriculum"
            delay={0.15}
          />
        </div>

        {/* Bento grid: Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            className="xl:col-span-2 glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-label text-[10px] uppercase tracking-widest text-primary-container">
                Recent Activity
              </h2>
              <button
                onClick={() => navigate('/history')}
                className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-colors"
              >
                View All →
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="h-12 bg-surface-container-high rounded-lg animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-on-surface-variant text-[48px]">inbox</span>
                <p className="font-body text-sm text-on-surface-variant mt-3">No sessions yet.</p>
                <button onClick={() => navigate('/prepare')} className="btn-primary mt-4 rounded mx-auto">
                  Start your first interview
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {sessions.slice(0, 8).map((s, i) => (
                  <ActivityRow key={s.sessionId} s={s} index={i} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
            className="flex flex-col gap-4"
          >
            <h2 className="font-label text-[10px] uppercase tracking-widest text-primary-container px-1">Quick Actions</h2>
            <QuickAction
              icon="add_circle"
              label="New Interview"
              desc="Pick a candidate & curriculum"
              onClick={() => navigate('/prepare')}
              delay={0.3}
            />
            <QuickAction
              icon="menu_book"
              label="Browse Curriculum"
              desc="Explore topics & objectives"
              onClick={() => navigate('/curriculum')}
              delay={0.35}
            />
            <QuickAction
              icon="history"
              label="View History"
              desc="All past sessions & reports"
              onClick={() => navigate('/history')}
              delay={0.4}
            />
            <QuickAction
              icon="settings"
              label="Settings"
              desc="API keys & preferences"
              onClick={() => navigate('/settings')}
              delay={0.45}
            />
          </motion.div>
        </div>

        {/* ── LEADERBOARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
          className="glass-card rounded-xl p-6 mt-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-label text-[10px] uppercase tracking-widest text-primary-container flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">leaderboard</span>
              Candidate Leaderboard
            </h2>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              Ranked by Final Score
            </span>
          </div>

          {leaderboardLoading ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-surface-container-high rounded-lg animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-on-surface-variant text-[40px]">emoji_events</span>
              <p className="font-body text-sm text-on-surface-variant mt-3">No completed interviews yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="px-4 pb-3 text-center font-label text-[10px] uppercase tracking-widest text-on-surface-variant w-12">Rank</th>
                    <th className="px-4 pb-3 text-left font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Candidate</th>
                    <th className="px-4 pb-3 text-left font-label text-[10px] uppercase tracking-widest text-on-surface-variant hidden sm:table-cell">Date</th>
                    <th className="px-4 pb-3 text-left font-label text-[10px] uppercase tracking-widest text-on-surface-variant hidden lg:table-cell">Verdict</th>
                    <th className="px-6 pb-3 text-left font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <LeaderboardRow key={entry.rank} entry={entry} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
