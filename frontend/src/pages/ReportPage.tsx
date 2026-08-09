import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { useInterviewStore } from '../store/useInterviewStore';
import { getReport, type ReportData } from '../services/report';

/* Animated SVG score ring */
function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45; // 282.7
  const offset = circumference - (score / 100) * circumference;

  const animatedOffset = useSpring(circumference, { stiffness: 60, damping: 20 });
  useEffect(() => { animatedOffset.set(offset); }, [offset, animatedOffset]);
  const strokeDashoffset = useTransform(animatedOffset, (v) => v);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <motion.circle
          cx="50" cy="50" fill="none" r="45"
          stroke="#21F5D4" strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset as any}
          className="drop-shadow-[0_0_8px_rgba(33,245,212,0.5)]"
        />
      </svg>
      <div className="text-center z-10">
        <div className="font-display text-5xl text-primary font-medium tracking-tighter">
          {Math.round(score)}
        </div>
        <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
          Overall Score
        </div>
      </div>
    </div>
  );
}

/* Mastery badge derived from score */
function MasteryBadge({ score }: { score: number }) {
  const { label, cls } = score >= 85
    ? { label: 'Expert',      cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' }
    : score >= 70
    ? { label: 'Proficient',  cls: 'text-primary-container bg-primary-container/10 border-primary-container/20' }
    : score >= 50
    ? { label: 'Developing',  cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' }
    : { label: 'Needs Work',  cls: 'text-rose-400 bg-rose-400/10 border-rose-400/20' };

  return (
    <span className={`px-2 py-0.5 rounded-full font-label text-[9px] uppercase tracking-widest border ${cls}`}>
      {label}
    </span>
  );
}

/* Animated score bar */
function ScoreBar({ label, value, delay = 0, showMastery = false }: { label: string; value: number; delay?: number; showMastery?: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.setProperty('--target-width', `${value}%`);
        barRef.current.classList.add('animated');
      }
    }, delay + 200);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-2">
        <div className="flex items-center gap-2">
          <span className="font-body text-on-surface">{label}</span>
          {showMastery && <MasteryBadge score={value} />}
        </div>
        <span className="font-body text-primary-container">{value}%</span>
      </div>
      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <div ref={barRef} className="score-bar-inner h-full bg-primary-container rounded-full shadow-[0_0_6px_rgba(33,245,212,0.4)]" />
      </div>
    </div>
  );
}

/* Placeholder report data when API not yet available */
function makePlaceholder(reportId: string): ReportData {
  return {
    reportId,
    candidateName: 'Candidate',
    curriculum: 'AI Systems',
    date: new Date().toLocaleDateString(),
    scores: { communication: 88, technicalDepth: 82, confidence: 85, problemSolving: 79, overall: 84 },
    topicScores: [
      { topic: 'Prompt Engineering', score: 92 },
      { topic: 'RAG Optimization',   score: 85 },
      { topic: 'Agent Orchestration', score: 88 },
      { topic: 'Vector Databases',    score: 82 },
    ],
    strengths: ['Strong architectural clarity on RAG systems', 'Clear and concise communication'],
    improvements: ['Deeper practical deployment experience needed', 'Vector similarity scoring requires more depth'],
    recommendedTopics: ['MCP', 'Vector Search', 'Deployment Strategies'],
    hiringRecommendation: 'Recommend',
    aiSynthesis: 'Candidate demonstrated solid core understanding of AI systems architecture. Recommend proceeding to final round with a focus on distributed agentic systems.',
    interviewFlow: ['Introduction', 'Fundamentals', 'Deep Dive', 'System Design', 'Closing'],
  };
}

export default function ReportPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const storeReportId = useInterviewStore((s) => s.reportId);
  const id = reportId || storeReportId || 'demo';

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getReport(id)
      .then(setReport)
      .catch(() => setReport(makePlaceholder(id)))
      .finally(() => setLoading(false));
  }, [id]);

  const printPdf = useCallback(() => {
    if (!report) return;

    const masteryLabel = (score: number) =>
      score >= 85 ? 'Expert' : score >= 70 ? 'Proficient' : score >= 50 ? 'Developing' : 'Needs Work';
    const masteryColor = (score: number) =>
      score >= 85 ? '#34d399' : score >= 70 ? '#21F5D4' : score >= 50 ? '#fbbf24' : '#f87171';

    const hiringTier = report.hiringRecommendation?.toLowerCase() || '';
    const hiringBg =
      hiringTier.includes('strong hire') ? '#065f46' :
      (hiringTier.includes('hire') && !hiringTier.includes('no')) ? '#14532d' :
      hiringTier.includes('maybe') ? '#78350f' :
      hiringTier.includes('no hire') ? '#7f1d1d' : '#134e4a';
    const hiringFg =
      hiringTier.includes('strong hire') ? '#34d399' :
      (hiringTier.includes('hire') && !hiringTier.includes('no')) ? '#4ade80' :
      hiringTier.includes('maybe') ? '#fbbf24' :
      hiringTier.includes('no hire') ? '#f87171' : '#21F5D4';

    const conversation = report.conversation ?? [];

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Assessment Report — ${report.candidateName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    background: #081615;
    color: #F6F6F3;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    line-height: 1.6;
    padding: 0;
  }

  /* ── Layout ── */
  .page { max-width: 900px; margin: 0 auto; padding: 48px 40px; }
  .section {
    background: rgba(11, 27, 26, 0.95);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 28px 32px;
    margin-bottom: 20px;
    break-inside: avoid;
  }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  /* ── Typography ── */
  .display { font-size: 38px; font-weight: 300; letter-spacing: -1.5px; color: #21F5D4; line-height: 1.1; }
  .headline { font-size: 18px; font-weight: 500; color: #F6F6F3; }
  .label {
    font-size: 9px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #9ca3af;
  }
  .label-teal { color: #21F5D4; }
  .body-sm { font-size: 13px; color: #d1d5db; }
  .muted { color: #6b7280; }

  /* ── Header ── */
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
  .header-meta { font-size: 14px; color: #9ca3af; margin-top: 10px; }
  .header-meta strong { color: #F6F6F3; }
  .score-ring-wrap { text-align: center; }
  .score-ring-num { font-size: 48px; font-weight: 300; color: #21F5D4; letter-spacing: -2px; }
  .score-ring-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #6b7280; margin-top: 4px; }
  .hiring-badge {
    display: inline-block; margin-top: 10px;
    padding: 5px 16px; border-radius: 9999px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    background: ${hiringBg}; color: ${hiringFg};
    border: 1px solid ${hiringFg}44;
  }

  /* ── Section titles ── */
  .section-title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .section-title .icon { font-size: 18px; color: #21F5D4; }

  /* ── Score bars ── */
  .score-row { margin-bottom: 14px; }
  .score-row-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .score-bar-track { height: 4px; background: rgba(255,255,255,0.08); border-radius: 9999px; overflow: hidden; }
  .score-bar-fill { height: 100%; border-radius: 9999px; }
  .mastery-pill {
    font-size: 8px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 1px 8px; border-radius: 9999px; margin-left: 6px;
    border: 1px solid;
  }

  /* ── Lists ── */
  ul.dot-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  ul.dot-list li { display: flex; gap: 10px; align-items: flex-start; }
  ul.dot-list li .dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .dot-green { background: #21F5D4; }
  .dot-red { background: #f87171; opacity: 0.7; }
  .dot-teal { background: #21F5D4; opacity: 0.5; }

  /* ── Divider ── */
  .divider { width: 100%; height: 1px; background: rgba(255,255,255,0.07); margin: 20px 0; }

  /* ── Q&A Log ── */
  .qa-entry {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 14px;
    break-inside: avoid;
  }
  .qa-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .qa-num { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.12em; }
  .topic-chip {
    background: rgba(33,245,212,0.08); border: 1px solid rgba(33,245,212,0.2);
    color: #21F5D4; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 2px 8px; border-radius: 4px; margin-left: 8px;
  }
  .score-chip {
    font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 3px 10px; border-radius: 4px; border: 1px solid;
  }
  .qa-question { font-size: 14px; font-weight: 500; color: #F6F6F3; margin-bottom: 10px; }
  .answer-box { background: rgba(0,0,0,0.25); border-radius: 8px; padding: 10px 14px; margin-bottom: 10px; }
  .answer-box .answer-label { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px; }
  .answer-box .answer-text { font-size: 12px; color: rgba(246,246,243,0.85); line-height: 1.6; }
  .pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .pill {
    font-size: 8px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 2px 8px; border-radius: 9999px; border: 1px solid;
  }
  .pill-green { background: rgba(52,211,153,0.08); color: #34d399; border-color: rgba(52,211,153,0.25); }
  .pill-red   { background: rgba(248,113,113,0.08); color: #f87171; border-color: rgba(248,113,113,0.25); }

  /* ── Hiring card ── */
  .hiring-card {
    background: ${hiringBg}22;
    border: 1px solid ${hiringFg}33;
    border-radius: 12px;
    padding: 24px 28px;
    margin-bottom: 20px;
  }
  .hiring-verdict {
    font-size: 22px; font-weight: 600; color: ${hiringFg};
    letter-spacing: 0.05em; text-transform: uppercase;
  }

  /* ── Print ── */
  @media print {
    body { background: #081615 !important; }
    .no-print { display: none !important; }
    .page { padding: 24px 28px; }
    @page { size: A4; margin: 0; background: #081615; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div>
      <div class="display">Technical Assessment<br/>Report</div>
      <div class="header-meta" style="margin-top:14px;">
        <strong>${report.candidateName}</strong> &nbsp;|&nbsp;
        ${report.curriculum} &nbsp;|&nbsp; ${report.date}
      </div>
    </div>
    <div class="score-ring-wrap">
      <div class="score-ring-num">${Math.round(report.scores.overall)}</div>
      <div class="score-ring-label">Overall Score</div>
      <div class="hiring-badge">${report.hiringRecommendation}</div>
    </div>
  </div>

  <!-- SCORE MATRIX + TOPIC BREAKDOWN -->
  <div class="grid-2">
    <!-- Score Matrix -->
    <div class="section">
      <div class="section-title">
        <span class="headline">Score Matrix</span>
      </div>
      ${[
        { label: 'Communication',   value: report.scores.communication },
        { label: 'Technical Depth', value: report.scores.technicalDepth },
        { label: 'Confidence',      value: report.scores.confidence },
        { label: 'Problem Solving', value: report.scores.problemSolving },
      ].map(s => `
      <div class="score-row">
        <div class="score-row-header">
          <span class="body-sm">${s.label}</span>
          <span style="color:#21F5D4;font-size:12px;">${s.value}%</span>
        </div>
        <div class="score-bar-track">
          <div class="score-bar-fill" style="width:${s.value}%;background:#21F5D4;"></div>
        </div>
      </div>`).join('')}
    </div>

    <!-- Topic Breakdown -->
    <div class="section">
      <div class="section-title">
        <span class="headline">Knowledge Assessment</span>
      </div>
      ${report.topicScores.length === 0
        ? '<p class="muted body-sm">No topic data available.</p>'
        : report.topicScores.map(ts => `
      <div class="score-row">
        <div class="score-row-header">
          <div>
            <span class="body-sm">${ts.topic}</span>
            <span class="mastery-pill" style="color:${masteryColor(ts.score)};border-color:${masteryColor(ts.score)}44;">${masteryLabel(ts.score)}</span>
          </div>
          <span style="color:${masteryColor(ts.score)};font-size:12px;">${ts.score}%</span>
        </div>
        <div class="score-bar-track">
          <div class="score-bar-fill" style="width:${ts.score}%;background:${masteryColor(ts.score)};"></div>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <!-- STRENGTHS & AREAS TO PROBE -->
  <div class="grid-2">
    <div class="section">
      <div class="section-title">
        <span class="headline">Strengths</span>
      </div>
      <ul class="dot-list">
        ${(report.strengths ?? []).map(s => `
        <li><span class="dot dot-green"></span><span class="body-sm">${s}</span></li>`).join('')}
      </ul>
    </div>
    <div class="section">
      <div class="section-title">
        <span class="headline">Areas to Probe</span>
      </div>
      <ul class="dot-list">
        ${(report.improvements ?? []).map(s => `
        <li><span class="dot dot-red"></span><span class="body-sm">${s}</span></li>`).join('')}
      </ul>
    </div>
  </div>

  <!-- AI SYNTHESIS -->
  ${report.aiSynthesis ? `
  <div class="section">
    <div class="section-title"><span class="headline">AI Synthesis</span></div>
    <p class="body-sm" style="color:#d1d5db;line-height:1.7;">${report.aiSynthesis}</p>
  </div>` : ''}

  <!-- HIRING DECISION -->
  <div class="hiring-card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:16px;">
      <div>
        <div class="label label-teal" style="margin-bottom:6px;">Hiring Recommendation</div>
        <div class="hiring-verdict">${report.hiringRecommendation}</div>
        ${report.hiringConfidence != null
          ? `<div class="muted" style="font-size:10px;margin-top:4px;">${Math.round((report.hiringConfidence ?? 0) * 100)}% Confidence</div>`
          : ''}
      </div>
    </div>
    ${((report.hiringStrengths?.length ?? 0) > 0 || (report.hiringWeaknesses?.length ?? 0) > 0) ? `
    <div class="grid-2" style="margin-bottom:16px;">
      <div>
        <div class="label" style="color:#34d399;margin-bottom:10px;">Hiring Strengths</div>
        <ul class="dot-list">
          ${(report.hiringStrengths ?? []).map(s => `<li><span class="dot" style="background:#34d399;"></span><span class="body-sm">${s}</span></li>`).join('')}
        </ul>
      </div>
      <div>
        <div class="label" style="color:#f87171;margin-bottom:10px;">Hiring Concerns</div>
        <ul class="dot-list">
          ${(report.hiringWeaknesses ?? []).map(w => `<li><span class="dot" style="background:#f87171;"></span><span class="body-sm">${w}</span></li>`).join('')}
        </ul>
      </div>
    </div>` : ''}
    ${(report.hiringReasoning?.length ?? 0) > 0 ? `
    <div class="label" style="margin-bottom:8px;">Decision Reasoning</div>
    <ul class="dot-list">
      ${(report.hiringReasoning ?? []).map(r => `<li><span class="dot dot-teal"></span><span class="body-sm" style="font-style:italic;color:#9ca3af;">${r}</span></li>`).join('')}
    </ul>` : ''}
  </div>

  <!-- FULL Q&A CONVERSATION -->
  ${conversation.length > 0 ? `
  <div class="section" style="margin-top:20px;">
    <div class="section-title" style="margin-bottom:20px;">
      <span class="headline">Interview Conversation</span>
      <span class="label" style="margin-left:auto;">${conversation.length} Questions</span>
    </div>
    ${conversation.map(entry => {
      const sc = entry.score >= 75 ? '#34d399' : entry.score >= 55 ? '#fbbf24' : '#f87171';
      const scBg = entry.score >= 75 ? 'rgba(52,211,153,0.1)' : entry.score >= 55 ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)';
      return `
    <div class="qa-entry">
      <div class="qa-header">
        <div>
          <span class="qa-num">Q${entry.index}</span>
          <span class="topic-chip">${entry.topic}</span>
        </div>
        ${entry.score > 0 ? `<span class="score-chip" style="color:${sc};border-color:${sc}44;background:${scBg};">Score: ${entry.score}%</span>` : ''}
      </div>
      <div class="qa-question">${entry.question}</div>
      <div class="answer-box">
        <div class="answer-label">Candidate Answer</div>
        <div class="answer-text">${entry.answer || '<em style="color:#6b7280;">No answer recorded.</em>'}</div>
      </div>
      ${entry.analysis && ((entry.analysis.conceptsDetected?.length ?? 0) + (entry.analysis.knowledgeGaps?.length ?? 0)) > 0 ? `
      <div class="pills">
        ${(entry.analysis.conceptsDetected ?? []).slice(0,4).map(c => `<span class="pill pill-green">✓ ${c}</span>`).join('')}
        ${(entry.analysis.knowledgeGaps ?? []).slice(0,3).map(g => `<span class="pill pill-red">✗ ${g}</span>`).join('')}
      </div>` : ''}
    </div>`;}).join('')}
  </div>` : ''}

</div>
<script>window.onload = () => { window.print(); };<\/script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=1000,height=800');
    if (!win) { alert('Please allow pop-ups to export the PDF.'); return; }
    win.document.write(html);
    win.document.close();
  }, [report]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="noise-overlay" />
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
          <p className="font-label text-[10px] uppercase tracking-widest text-text-muted">Generating Report...</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const hiringTier = report.hiringRecommendation?.toLowerCase() || '';
  const hiringColor =
    hiringTier.includes('strong hire')  ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' :
    hiringTier.includes('hire') && !hiringTier.includes('no') ? 'text-green-400 bg-green-400/10 border-green-400/20' :
    hiringTier.includes('lean hire')    ? 'text-teal-400 bg-teal-400/10 border-teal-400/20' :
    hiringTier.includes('maybe')        ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
    hiringTier.includes('lean no')      ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' :
    hiringTier.includes('strong no')    ? 'text-rose-600 bg-rose-600/10 border-rose-600/20' :
    hiringTier.includes('no hire')      ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' :
    hiringTier.includes('recommend')    ? 'text-primary-container bg-primary-container/10 border-primary-container/20' :
    'text-amber-400 bg-amber-400/10 border-amber-400/20';

  const hiringIcon =
    hiringTier.includes('strong hire') ? '🌟' :
    (hiringTier.includes('hire') && !hiringTier.includes('no')) ? '✅' :
    hiringTier.includes('lean hire') ? '👍' :
    hiringTier.includes('maybe') ? '🤔' :
    hiringTier.includes('lean no') ? '👎' :
    hiringTier.includes('no hire') ? '❌' : '📊';

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="noise-overlay" />
      <div className="volumetric-glow absolute top-[-100px] left-[-100px]" />
      <div className="volumetric-glow absolute bottom-[-200px] right-[-200px] opacity-50" />

      <div className="flex">
        <Sidebar />

        <main className="md:ml-64 p-6 md:p-12 lg:p-16 max-w-[1440px] mx-auto min-h-screen flex flex-col gap-10 relative z-10 w-full">

          {/* ── HERO HEADER ── */}
          <motion.header
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate('/')}
                  className="text-text-muted hover:text-secondary transition-colors flex items-center gap-1 font-label text-xs uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Home
                </button>
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-primary font-normal tracking-tight">
                Technical Assessment<br />Report
              </h1>
              <p className="font-body text-lg text-on-surface-variant">
                Candidate:{' '}
                <span className="text-on-surface font-medium">{report.candidateName}</span>
                {' '}| Curriculum:{' '}
                <span className="text-on-surface font-medium">{report.curriculum}</span>
                {' '}| Date:{' '}
                <span className="text-on-surface font-medium">{report.date}</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <ScoreRing score={report.scores.overall} />
              <span className={`px-4 py-2 rounded-full font-label text-[10px] uppercase tracking-widest border ${hiringColor}`}>
                ● {report.hiringRecommendation}
              </span>
            </div>
          </motion.header>

          {/* ── BENTO GRID ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

            {/* Topic Breakdown */}
            <motion.section
              className="glass-card rounded-xl p-8 col-span-1 md:col-span-7 flex flex-col gap-6 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              style={{ willChange: 'transform' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-2xl text-on-surface flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">bar_chart</span>
                  Knowledge Assessment
                </h2>
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  {report.topicScores.length} Topics Evaluated
                </span>
              </div>
              {report.topicScores.length === 0 ? (
                <p className="font-body text-sm text-on-surface-variant">No topic data available.</p>
              ) : (
                <div className="space-y-5">
                  {report.topicScores.map((ts, i) => (
                    <ScoreBar key={ts.topic} label={ts.topic} value={ts.score} delay={i * 120} showMastery />
                  ))}
                </div>
              )}
            </motion.section>

            {/* Score Matrix */}
            <motion.section
              className="glass-card rounded-xl p-8 col-span-1 md:col-span-5 flex flex-col gap-6 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              style={{ willChange: 'transform' }}
            >
              <h2 className="font-headline text-2xl text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">monitoring</span>
                Score Matrix
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Communication',   value: report.scores.communication },
                  { label: 'Technical Depth', value: report.scores.technicalDepth },
                  { label: 'Confidence',      value: report.scores.confidence },
                  { label: 'Problem Solving', value: report.scores.problemSolving },
                ].map((s, i) => (
                  <ScoreBar key={s.label} label={s.label} value={s.value} delay={i * 100 + 400} />
                ))}
              </div>
            </motion.section>

            {/* Strengths & Improvements */}
            <motion.section
              className="glass-card rounded-xl p-8 col-span-1 md:col-span-6 flex flex-col gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              style={{ willChange: 'transform' }}
            >
              <h2 className="font-headline text-2xl text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">balance</span>
                Assessment
              </h2>

              <div>
                <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">add_circle</span> Strengths
                </h3>
                <ul className="space-y-3">
                  {report.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-3 font-body text-sm text-on-surface">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 opacity-70 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full h-px bg-outline-variant/30" />

              <div>
                <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-error/70">remove_circle</span> Areas to Probe
                </h3>
                <ul className="space-y-3">
                  {report.improvements.map((s) => (
                    <li key={s} className="flex items-start gap-3 font-body text-sm text-on-surface">
                      <span className="w-1.5 h-1.5 rounded-full bg-error/50 mt-1.5 opacity-70 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* Recommended Topics */}
            <motion.section
              className="glass-card rounded-xl p-8 col-span-1 md:col-span-6 flex flex-col gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              style={{ willChange: 'transform' }}
            >
              <h2 className="font-headline text-2xl text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">lightbulb</span>
                Recommended Topics
              </h2>
              <div className="flex flex-wrap gap-3">
                {report.recommendedTopics.map((t) => (
                  <span key={t} className="badge-medium px-4 py-2 rounded-full font-label text-[10px] uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                <h3 className="font-label text-xs uppercase tracking-widest text-text-muted mb-3">Next Steps</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">{report.aiSynthesis}</p>
              </div>
            </motion.section>

            {/* Interview Flow Timeline */}
            <motion.section
              className="glass-card rounded-xl p-8 col-span-1 md:col-span-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="font-headline text-2xl text-on-surface mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">timeline</span>
                Interview Flow
              </h2>
              <div className="relative flex justify-between items-center w-full px-4">
                <div className="absolute left-8 right-8 h-px bg-outline-variant/30 top-1/2 -translate-y-1/2 z-0" />
                {report.interviewFlow.map((phase, i) => {
                  const isDone = i < Math.floor(report.interviewFlow.length * 0.6);
                  const isCurrent = i === Math.floor(report.interviewFlow.length * 0.6);
                  return (
                    <div key={phase} className="relative z-10 flex flex-col items-center gap-3 cursor-default group">
                      <div className={`rounded-full shadow-[0_0_10px_rgba(33,245,212,0.4)]
                        ${isCurrent ? 'w-4 h-4 bg-primary border-2 border-surface-container-lowest' :
                          isDone ? 'w-3 h-3 bg-primary-container' : 'w-3 h-3 bg-surface-variant border border-outline-variant'}`}
                      />
                      <span className={`font-label text-[10px] uppercase tracking-widest transition-colors
                        ${isCurrent ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                        {phase}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* ── CONVERSATION LOG ── */}
            {report.conversation && report.conversation.length > 0 && (
              <motion.section
                className="glass-card rounded-xl p-8 col-span-1 md:col-span-12 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
              >
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <h2 className="font-headline text-2xl text-on-surface mb-6 flex items-center gap-3 relative z-10">
                  <span className="material-symbols-outlined text-primary-container">forum</span>
                  Interview Conversation
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant ml-auto">
                    {report.conversation.length} Questions
                  </span>
                </h2>
                <div className="space-y-4 relative z-10">
                  {report.conversation.map((entry) => {
                    const scoreColor =
                      entry.score >= 75 ? 'text-emerald-400 border-emerald-400/30' :
                      entry.score >= 55 ? 'text-amber-400 border-amber-400/30' :
                                          'text-rose-400 border-rose-400/30';
                    return (
                      <div key={entry.index} className="bg-surface-container/40 rounded-xl p-5 border border-border-glass/40">
                        {/* Topic + Score header */}
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                              Q{entry.index}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-primary-container/10 border border-primary-container/20 font-label text-[10px] text-primary-container uppercase tracking-widest">
                              {entry.topic}
                            </span>
                          </div>
                          {entry.score > 0 && (
                            <span className={`font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded border shrink-0 ${scoreColor}`}>
                              Score: {entry.score}%
                            </span>
                          )}
                        </div>
                        {/* Question */}
                        <p className="font-body-md text-sm text-on-surface font-medium leading-snug mb-3">
                          {entry.question}
                        </p>
                        {/* Answer */}
                        <div className="bg-background/40 rounded-lg p-3 mb-3">
                          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Candidate Answer</p>
                          <p className="font-body text-xs text-on-surface/90 leading-relaxed">{entry.answer}</p>
                        </div>
                        {/* Analysis pills */}
                        {entry.analysis && (
                          <div className="flex flex-wrap gap-2">
                            {(entry.analysis.conceptsDetected ?? []).slice(0, 4).map((c) => (
                              <span key={c} className="px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 font-label text-[10px] text-emerald-400 uppercase tracking-widest">
                                ✓ {c}
                              </span>
                            ))}
                            {(entry.analysis.knowledgeGaps ?? []).slice(0, 3).map((g) => (
                              <span key={g} className="px-2 py-0.5 rounded-full bg-rose-400/10 border border-rose-400/20 font-label text-[10px] text-rose-400 uppercase tracking-widest">
                                ✗ {g}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* ── HIRING DECISION CARD (Feature 7) ── */}
            <motion.section
              className="glass-card rounded-xl p-8 col-span-1 md:col-span-12 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {/* Background gradient tint */}
              <div className={`absolute inset-0 opacity-5 pointer-events-none ${
                hiringTier.includes('strong hire') ? 'bg-emerald-400' :
                hiringTier.includes('no hire') ? 'bg-rose-400' : 'bg-primary-container'
              }`} />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <h2 className="font-headline text-2xl text-on-surface flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-primary-container">verified</span>
                      Hiring Recommendation
                    </h2>
                    <p className="font-body text-sm text-on-surface-variant">AI-generated hiring decision based on interview performance</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-4xl`}>{hiringIcon}</span>
                    <span className={`px-5 py-2 rounded-full font-label text-sm uppercase tracking-widest border font-semibold ${hiringColor}`}>
                      {report.hiringRecommendation}
                    </span>
                    {report.hiringConfidence != null && (
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                        {Math.round(report.hiringConfidence * 100)}% Confidence
                      </span>
                    )}
                  </div>
                </div>

                {/* Strengths & Weaknesses from hiring engine */}
                {((report.hiringStrengths && report.hiringStrengths.length > 0) ||
                  (report.hiringWeaknesses && report.hiringWeaknesses.length > 0)) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {report.hiringStrengths && report.hiringStrengths.length > 0 && (
                      <div>
                        <h3 className="font-label text-xs uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">thumb_up</span> Hiring Strengths
                        </h3>
                        <ul className="space-y-2">
                          {report.hiringStrengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-3 font-body text-sm text-on-surface">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {report.hiringWeaknesses && report.hiringWeaknesses.length > 0 && (
                      <div>
                        <h3 className="font-label text-xs uppercase tracking-widest text-rose-400 mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">thumb_down</span> Hiring Concerns
                        </h3>
                        <ul className="space-y-2">
                          {report.hiringWeaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-3 font-body text-sm text-on-surface">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Reasoning bullets */}
                {report.hiringReasoning && report.hiringReasoning.length > 0 && (
                  <div>
                    <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">psychology</span> Decision Reasoning
                    </h3>
                    <ul className="space-y-2">
                      {report.hiringReasoning.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 font-body text-sm text-on-surface-variant italic">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-container/50 mt-1.5 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={printPdf}
              className="btn-primary rounded py-3 px-8"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              Export PDF Report
            </button>
            <button
              onClick={() => navigate('/prepare')}
              className="btn-ghost rounded py-3 px-8"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Start New Interview
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
