import { useInterviewStore } from '../store/useInterviewStore';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

interface ProgressProps {
  className?: string;
}

export function Progress({ className = '' }: ProgressProps) {
  const {
    questionNumber,
    totalQuestions,
    elapsedSeconds,
    currentTopic,
    difficulty,
    completedTopics,
    remainingTopics,
  } = useInterviewStore();

  const pct = totalQuestions > 0 ? Math.round((questionNumber / totalQuestions) * 100) : 0;

  const diffBadgeClass =
    difficulty === 'Easy' ? 'badge-easy' :
    difficulty === 'Hard' ? 'badge-hard' : 'badge-medium';

  return (
    <aside className={`w-full md:w-64 flex flex-col gap-4 shrink-0 ${className}`}>

      {/* Q# + Timer */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-label text-[10px] text-primary-container uppercase tracking-widest mb-4">
          Progress
        </h3>

        <div className="space-y-4">
          <div>
            <p className="font-body-md text-body-md text-text-muted">Question</p>
            <p className="font-headline-lg text-headline-lg text-text-primary font-bold">
              {questionNumber}
            </p>
            {/* Progress bar toward 10 question limit */}
            <div className="mt-2 h-1 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full shadow-[0_0_6px_rgba(33,245,212,0.4)] transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                style={{ width: `${pct}%`, willChange: 'width' }}
              />
            </div>
          </div>

          <div>
            <p className="font-body-md text-body-md text-text-muted flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              Timer
            </p>
            <p className="font-headline-lg text-headline-lg text-text-primary tracking-tighter">
              {formatTime(elapsedSeconds)}
            </p>
          </div>
        </div>
      </div>

      {/* Topic Timeline */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-label text-[10px] text-primary-container uppercase tracking-widest mb-4">
          Interview Timeline
        </h3>
        <div className="space-y-2">
          {completedTopics.map((t) => (
            <div key={t} className="flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-[14px] text-primary-container">check_circle</span>
              <span className="topic-done px-2 py-0.5 rounded-full">{t}</span>
            </div>
          ))}
          {currentTopic && (
            <div className="flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-[14px] text-secondary breathing-glow">arrow_right</span>
              <span className="topic-current px-2 py-0.5 rounded-full">{currentTopic}</span>
            </div>
          )}
          {remainingTopics.map((t) => (
            <div key={t} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full border border-outline-variant/40 ml-0.5" />
              <span className="topic-pending px-2 py-0.5 rounded-full">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="font-label text-[10px] text-text-muted uppercase tracking-widest">Difficulty</span>
          <span className={`px-3 py-1 rounded-full font-label text-[10px] uppercase tracking-widest ${diffBadgeClass}`}>
            ● {difficulty}
          </span>
        </div>
      </div>
    </aside>
  );
}
