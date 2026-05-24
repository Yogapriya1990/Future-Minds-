import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location     = useLocation();
  const shouldReduce = useReducedMotion();

  const pageVariants = {
    initial: { opacity: 0, y: shouldReduce ? 0 : 7 },
    enter:   { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: shouldReduce ? 0 : -4 },
  };

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 overflow-y-auto"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
