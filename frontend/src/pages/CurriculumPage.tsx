import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { getCurriculum, type CurriculumModule, type CurriculumTopic } from '../services/curriculum';

/* ── Topic chip ── */
function TopicChip({ topic }: { topic: CurriculumTopic }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full font-label text-[10px] uppercase tracking-widest
                   bg-surface-container-high border border-outline-variant/20 text-on-surface-variant
                   hover:border-primary-container/30 hover:text-primary-container transition-all duration-200"
      >
        <span className="material-symbols-outlined text-[13px]">
          {open ? 'expand_less' : 'chevron_right'}
        </span>
        {topic.name}
      </button>
      <AnimatePresence>
        {open && topic.subtopics && topic.subtopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden mt-2 ml-4 pl-3 border-l border-outline-variant/20"
          >
            {topic.subtopics.map(st => (
              <div key={st.id} className="mb-2">
                <p className="font-label text-[10px] uppercase tracking-widest text-secondary">{st.name}</p>
                {st.learningObjectives && (
                  <ul className="mt-1 space-y-0.5">
                    {st.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5 font-body text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary-container text-[12px] mt-0.5 shrink-0">arrow_right</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Module card ── */
function ModuleCard({ mod, index, search }: { mod: CurriculumModule; index: number; search: string }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const visible =
    search === '' ||
    mod.name.toLowerCase().includes(search.toLowerCase()) ||
    mod.description.toLowerCase().includes(search.toLowerCase()) ||
    mod.topics.some(t => t.name.toLowerCase().includes(search.toLowerCase()));

  if (!visible) return null;

  const icons: Record<string, string> = {
    'ai-systems':           'psychology',
    'backend-engineering':  'dns',
    'frontend-engineering': 'web',
    'system-design':        'account_tree',
  };
  const icon = icons[mod.id] ?? 'school';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-card rounded-xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary-container text-[22px]">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-body text-base text-on-surface">{mod.name}</h2>
          <p className="font-body text-xs text-on-surface-variant mt-0.5 line-clamp-2">{mod.description}</p>
        </div>
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant border border-outline-variant/20 px-2 py-1 rounded-full">
          {mod.topics.length} topics
        </span>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-2">
        {mod.topics.map(t => (
          <TopicChip key={t.id} topic={t} />
        ))}
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
        <button
          onClick={() => setExpanded(e => !e)}
          className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-colors"
        >
          {expanded ? 'Collapse all' : 'Expand all'}
        </button>
        <button
          onClick={() => navigate('/prepare')}
          className="btn-primary py-1.5 px-4 rounded text-[10px]"
        >
          <span className="material-symbols-outlined text-[14px]">play_arrow</span>
          Practice
        </button>
      </div>
    </motion.div>
  );
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-surface-container-high shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 w-32 bg-surface-container-high rounded" />
          <div className="h-3 w-48 bg-surface-container-high rounded" />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3].map(i => <div key={i} className="h-7 w-24 bg-surface-container-high rounded-full" />)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   CURRICULUM PAGE
   ════════════════════════════════════════════ */
export default function CurriculumPage() {
  const [modules, setModules] = useState<CurriculumModule[]>([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurriculum();
        setModules(data.modules);
      } catch {
        // Fallback static modules
        setModules([
          {
            id: 'ai-systems',
            name: 'AI Systems',
            source: 'default',
            description: 'Large language models, agents, and RAG pipelines.',
            topics: [
              { id: 'prompt-engineering', name: 'Prompt Engineering', description: 'Designing effective prompts for LLMs.', subtopics: [{ id: 'cot', name: 'Chain-of-Thought', learningObjectives: ['Explain step-by-step reasoning', 'Apply CoT to complex problems'] }] },
              { id: 'rag', name: 'RAG Optimization', description: 'Retrieval-Augmented Generation techniques.' },
              { id: 'agents', name: 'Agent Orchestration', description: 'Multi-agent system design.' },
              { id: 'vector-db', name: 'Vector Databases', description: 'Embedding storage and similarity search.' },
            ],
          },
          {
            id: 'backend-engineering',
            name: 'Backend Engineering',
            source: 'default',
            description: 'Node.js, APIs, databases, and system design.',
            topics: [
              { id: 'node-js', name: 'Node.js Fundamentals', description: 'Event loop, streams, async patterns.' },
              { id: 'databases', name: 'Databases', description: 'SQL, NoSQL, query optimization.' },
              { id: 'system-design', name: 'System Design', description: 'Scalability, load balancing, caching.' },
            ],
          },
          {
            id: 'frontend-engineering',
            name: 'Frontend Engineering',
            source: 'default',
            description: 'React, performance, and modern web patterns.',
            topics: [
              { id: 'react', name: 'React Patterns', description: 'Hooks, state management, rendering.' },
              { id: 'performance', name: 'Web Performance', description: 'Core Web Vitals and optimization.' },
              { id: 'typescript', name: 'TypeScript', description: 'Type system and advanced patterns.' },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          className="mb-8"
        >
          <h1 className="font-headline text-headline-lg text-on-surface leading-tight">Curriculum</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            Explore modules, topics, and learning objectives.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mb-8 relative"
        >
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search modules or topics…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/20 rounded-lg
                       font-body text-sm text-on-surface placeholder-on-surface-variant
                       focus:outline-none focus:border-primary-container/40 focus:ring-1 focus:ring-primary-container/20
                       input-glow transition-all duration-300"
          />
        </motion.div>

        {/* Module grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : modules.map((mod, i) => (
                <ModuleCard key={mod.id} mod={mod} index={i} search={search} />
              ))}
        </div>

        {/* Empty search state */}
        {!loading && search !== '' && modules.every(m =>
          !m.name.toLowerCase().includes(search.toLowerCase()) &&
          !m.description.toLowerCase().includes(search.toLowerCase()) &&
          !m.topics.some(t => t.name.toLowerCase().includes(search.toLowerCase()))
        ) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <span className="material-symbols-outlined text-on-surface-variant text-[48px]">search_off</span>
            <p className="font-body text-sm text-on-surface-variant mt-3">No modules match "{search}"</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
