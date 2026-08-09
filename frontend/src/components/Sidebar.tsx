import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',            icon: 'home',         label: 'Home' },
  { path: '/prepare',     icon: 'person_add',   label: 'Interview' },
  { path: '/dashboard',   icon: 'dashboard',    label: 'Dashboard' },
  { path: '/history',     icon: 'history',      label: 'History' },
  { path: '/curriculum',  icon: 'menu_book',    label: 'Curriculum' },
  { path: '/settings',    icon: 'settings',     label: 'Settings' },
];

// Subset shown in mobile bottom bar (5 max)
const MOBILE_NAV = NAV_ITEMS.filter(i => ['/', '/prepare', '/dashboard', '/history', '/curriculum'].includes(i.path));

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <nav className={`hidden md:flex flex-col h-full py-8 fixed left-0 top-0 w-64 z-40
        bg-surface-container-lowest/90 backdrop-blur-2xl
        border-r border-outline-variant/10 shadow-2xl ${className}`}>

        {/* Logo */}
        <div className="px-6 mb-12">
          <h1 className="font-headline text-xl text-primary tracking-tight cursor-pointer"
              onClick={() => navigate('/')}>
            Orian
          </h1>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
            The Interviewer
          </p>
        </div>

        {/* Nav Links */}
        <div className="flex-1 flex flex-col gap-1 px-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] w-full text-left
                  ${active
                    ? 'bg-primary-container/10 text-primary border-r-2 border-primary shadow-[inset_-2px_0_8px_rgba(33,245,212,0.15)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-label text-xs uppercase tracking-widest">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="px-4 mt-auto space-y-2">
          <button
            onClick={() => navigate('/prepare')}
            className="w-full btn-primary rounded"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Interview
          </button>
        </div>
      </nav>

      {/* ── Mobile Bottom Nav (Phase 10) ── */}
      <nav className="mobile-bottom-nav">
        {MOBILE_NAV.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`mobile-tab-btn ${active ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}

