import { AnimatePresence, motion } from 'framer-motion';
import { useInterviewStore } from '../store/useInterviewStore';

/* AI Message bubble */
function AIMessage({ content }: { content: string }) {
  return (
    <motion.div
      className="flex flex-col items-start max-w-[85%]"
      initial={{ opacity: 0, x: -12, y: 6 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary-container/20 border border-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px] text-primary-container">psychology</span>
        </div>
        <span className="font-label-md text-label-md text-text-muted" style={{ fontFamily: '"EB Garamond", serif' }}>
          Orian (AI Agent)
        </span>
      </div>
      <div className="p-5 rounded-xl rounded-tl-none bg-surface-container/50 border border-border-glass backdrop-blur-md">
        <p className="font-body-lg text-body-lg text-text-primary leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}

/* User Message bubble */
function UserMessage({ content }: { content: string }) {
  return (
    <motion.div
      className="flex flex-col items-end w-full"
      initial={{ opacity: 0, x: 12, y: 6 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="font-label-md text-label-md text-text-muted">You</span>
        <div className="w-8 h-8 rounded-full bg-surface-variant border border-border-glass flex items-center justify-center">
          <span className="material-symbols-outlined text-[16px] text-text-muted">person</span>
        </div>
      </div>
      <div className="p-5 rounded-xl rounded-tr-none bg-primary-container/10 border border-primary-container/30 backdrop-blur-md max-w-[85%]">
        <p className="font-body-lg text-body-lg text-text-primary leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}

/* AI Thinking animation */
function ThinkingState() {
  return (
    <motion.div
      className="flex flex-col items-start max-w-[85%] w-full mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary-container/10 border border-primary-container/50 flex items-center justify-center">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container" />
          </span>
        </div>
        <span className="font-label-md text-label-md text-text-muted" style={{ fontFamily: '"EB Garamond", serif' }}>
          Orian is thinking...
        </span>
      </div>
      <div className="p-5 rounded-xl rounded-tl-none bg-surface-container/30 border border-border-glass backdrop-blur-md w-full relative overflow-hidden">
        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container/5 to-transparent animate-shimmer -translate-x-full" />
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-3 text-text-muted font-body-md text-sm thinking-step">
            <span className="material-symbols-outlined text-[16px] text-primary-container/70">analytics</span>
            <span>Analyzing Response</span>
          </div>
          <div className="flex items-center gap-3 text-text-muted font-body-md text-sm thinking-step">
            <span className="material-symbols-outlined text-[16px] text-primary-container/70">menu_book</span>
            <span>Retrieving Curriculum</span>
          </div>
          <div className="flex items-center gap-3 text-text-muted font-body-md text-sm thinking-step">
            <span className="material-symbols-outlined text-[16px] text-primary-container/70">tune</span>
            <span>Adjusting Difficulty</span>
          </div>
          <div className="flex items-center gap-3 text-text-primary font-body-md text-sm thinking-step font-medium">
            <span className="material-symbols-outlined text-[16px] text-primary-container">auto_awesome</span>
            <span>Generating Follow-up Question</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface QuestionCardProps {
  className?: string;
}

export function QuestionCard({ className = '' }: QuestionCardProps) {
  const { messages, status } = useInterviewStore();

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 flex flex-col justify-end ${className}`}>
      <AnimatePresence mode="popLayout">
        {messages.map((msg) =>
          msg.role === 'ai'
            ? <AIMessage key={msg.id} content={msg.content} />
            : <UserMessage key={msg.id} content={msg.content} />
        )}
        {status === 'thinking' && <ThinkingState key="thinking" />}
      </AnimatePresence>
    </div>
  );
}
