import { lazy, Suspense } from 'react';
import type { Transition } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Eagerly loaded (critical path)
import LandingPage   from './pages/LandingPage';
import AccessPage    from './pages/AccessPage';
import PreparePage   from './pages/PreparePage';
import InterviewPage from './pages/InterviewPage';
import ReportPage    from './pages/ReportPage';

// Lazily loaded (Phase 8 pages — code split)
const DashboardPage  = lazy(() => import('./pages/DashboardPage'));
const HistoryPage    = lazy(() => import('./pages/HistoryPage'));
const CurriculumPage = lazy(() => import('./pages/CurriculumPage'));
const SettingsPage   = lazy(() => import('./pages/SettingsPage'));

/* Framer Motion page transition — spring physics for 60fps natural feel */
const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -6, scale: 0.998 },
};
const pageTransition: Transition = { type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] };

/* Minimal fallback while lazy chunk loads */
function PageFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary-container opacity-0 animate-[fade-in-up_0.6s_ease-out_forwards]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="page-transition"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            {/* Core flow */}
            <Route path="/"                  element={<LandingPage />} />
            <Route path="/access"            element={<AccessPage />} />
            <Route path="/prepare"           element={<PreparePage />} />
            <Route path="/interview"         element={<InterviewPage />} />
            <Route path="/report"            element={<ReportPage />} />
            <Route path="/report/:reportId"  element={<ReportPage />} />

            {/* Phase 8 pages */}
            <Route path="/dashboard"         element={<DashboardPage />} />
            <Route path="/history"           element={<HistoryPage />} />
            <Route path="/curriculum"        element={<CurriculumPage />} />
            <Route path="/settings"          element={<SettingsPage />} />

            {/* Fallback */}
            <Route path="*"                  element={<LandingPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
