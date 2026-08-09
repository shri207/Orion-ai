import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { useInterviewStore } from '../store/useInterviewStore';

/* ── Section wrapper ── */
function Section({ title, icon, children, delay = 0 }: { title: string; icon: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
        <span className="material-symbols-outlined text-primary-container text-[20px]">{icon}</span>
        <h2 className="font-label text-[10px] uppercase tracking-widest text-primary-container">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

/* ── Toggle row ── */
function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
      <div>
        <p className="font-body text-sm text-on-surface">{label}</p>
        <p className="font-body text-xs text-on-surface-variant mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shrink-0 ${value ? 'bg-primary-container' : 'bg-surface-container-high'}`}
        aria-pressed={value}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${value ? 'translate-x-5' : 'translate-x-0'}`}
          style={{ willChange: 'transform' }}
        />
      </button>
    </div>
  );
}

/* ── Masked input ── */
function MaskedInput({ label, value, placeholder }: { label: string; value: string; placeholder: string }) {
  const [visible, setVisible] = useState(false);
  const [val, setVal] = useState(value);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="mb-4 last:mb-0">
      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={visible ? 'text' : 'password'}
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 bg-surface-container border border-outline-variant/20 rounded-lg
                       font-body text-sm text-on-surface placeholder-on-surface-variant
                       focus:outline-none focus:border-primary-container/40 focus:ring-1 focus:ring-primary-container/20
                       input-glow transition-all duration-300 pr-10"
          />
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">{visible ? 'visibility_off' : 'visibility'}</span>
          </button>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg font-label text-[10px] uppercase tracking-widest transition-all duration-300
            ${saved ? 'bg-primary-container/20 text-primary-container border border-primary-container/30' : 'btn-ghost'}`}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}

/* ── Palette swatch ── */
function ColorSwatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-10 h-10 rounded-lg border border-white/10 shadow" style={{ backgroundColor: color }} />
      <p className="font-label text-[9px] text-on-surface-variant">{name}</p>
    </div>
  );
}

/* ════════════════════════════════════════════
   SETTINGS PAGE
   ════════════════════════════════════════════ */
export default function SettingsPage() {
  const navigate = useNavigate();
  const { token, clearToken } = useInterviewStore();

  // Notification toggles
  const [notifs, setNotifs] = useState({
    sessionComplete:  true,
    weeklyDigest:     false,
    tipOfTheDay:      true,
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');

  async function handleTestConnection() {
    setTestStatus('testing');
    try {
      const res = await fetch('/health');
      setTestStatus(res.ok ? 'ok' : 'fail');
    } catch {
      setTestStatus('fail');
    }
    setTimeout(() => setTestStatus('idle'), 3000);
  }

  function handleClearSession() {
    clearToken();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="noise-overlay" />
      <Sidebar />

      <main className="flex-1 md:pl-64 p-6 md:p-10 max-w-screen-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="font-headline text-headline-lg text-on-surface leading-tight">Settings</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            Manage your API keys, preferences, and account.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ── API Configuration ── */}
          <Section title="API Configuration" icon="key" delay={0}>
            <MaskedInput
              label="OpenRouter API Key"
              value=""
              placeholder="sk-or-v1-••••••••••••••••••••••••"
            />
            <MaskedInput
              label="Backend API Key"
              value=""
              placeholder="dev-key"
            />
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-outline-variant/10">
              <button
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className={`btn-ghost py-2 px-4 rounded transition-all duration-300 text-[10px]
                  ${testStatus === 'ok'      ? '!text-primary-container !border-primary-container/30' :
                    testStatus === 'fail'    ? '!text-red-400 !border-red-400/30' :
                    testStatus === 'testing' ? 'opacity-60 cursor-wait' : ''}`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {testStatus === 'testing' ? 'hourglass_top' : testStatus === 'ok' ? 'check_circle' : testStatus === 'fail' ? 'error' : 'wifi_tethering'}
                </span>
                {testStatus === 'idle'    ? 'Test Connection' :
                 testStatus === 'testing' ? 'Testing…' :
                 testStatus === 'ok'      ? 'Connected' :
                                           'Failed'}
              </button>
            </div>
          </Section>

          {/* ── Notifications ── */}
          <Section title="Notifications" icon="notifications" delay={0.05}>
            <ToggleRow
              label="Session complete"
              desc="Notify when an interview report is ready"
              value={notifs.sessionComplete}
              onChange={v => setNotifs(n => ({ ...n, sessionComplete: v }))}
            />
            <ToggleRow
              label="Weekly digest"
              desc="Summary of all sessions from the past week"
              value={notifs.weeklyDigest}
              onChange={v => setNotifs(n => ({ ...n, weeklyDigest: v }))}
            />
            <ToggleRow
              label="Tip of the day"
              desc="Daily interviewing tips & best practices"
              value={notifs.tipOfTheDay}
              onChange={v => setNotifs(n => ({ ...n, tipOfTheDay: v }))}
            />
          </Section>

          {/* ── Theme ── */}
          <Section title="Theme — Obsidian Emerald" icon="palette" delay={0.1}>
            <p className="font-body text-xs text-on-surface-variant mb-4">
              The design system palette used throughout the application.
            </p>
            <div className="flex flex-wrap gap-4">
              <ColorSwatch color="#081615" name="Background" />
              <ColorSwatch color="#21F5D4" name="Primary" />
              <ColorSwatch color="#44e9ce" name="Secondary" />
              <ColorSwatch color="#ffd754" name="Tertiary" />
              <ColorSwatch color="#0B1B1A" name="Surface" />
              <ColorSwatch color="#142221" name="Container" />
              <ColorSwatch color="#84948f" name="Outline" />
              <ColorSwatch color="#d6e6e3" name="On-Surface" />
            </div>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-5">
              Additional themes coming soon.
            </p>
          </Section>

          {/* ── Account ── */}
          <Section title="Account" icon="account_circle" delay={0.15}>
            <div className="mb-4">
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Session Token</p>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-container border border-outline-variant/20 rounded-lg">
                <span className="font-body text-xs text-on-surface font-mono truncate flex-1">
                  {token ? `${token.slice(0, 24)}…` : 'No active session'}
                </span>
                {token && (
                  <span className="flex items-center gap-1 font-label text-[9px] text-primary-container uppercase tracking-widest shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container inline-block animate-ping" />
                    Active
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleClearSession}
              className="btn-ghost py-2 px-4 rounded text-[10px]"
            >
              <span className="material-symbols-outlined text-[15px]">logout</span>
              Clear Session & Sign out
            </button>
          </Section>

          {/* ── Danger Zone ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="xl:col-span-2 border border-red-500/20 bg-red-500/5 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-red-400 text-[20px]">warning</span>
              <h2 className="font-label text-[10px] uppercase tracking-widest text-red-400">Danger Zone</h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-body text-sm text-on-surface">Reset all application data</p>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">
                  Clears local storage, session tokens, and cached interview state. Cannot be undone.
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="shrink-0 py-2 px-5 rounded-lg font-label text-[10px] uppercase tracking-widest
                           border border-red-500/30 text-red-400 bg-red-500/5
                           hover:bg-red-500/15 hover:border-red-500/50 transition-all duration-200"
              >
                Reset All Data
              </button>
            </div>
          </motion.section>

        </div>
      </main>
    </div>
  );
}
