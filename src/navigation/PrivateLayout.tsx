import React, { Suspense } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar, PageTransition } from '../components/layout';
import { LoadingSpinner } from '../components/ui';

export interface PrivateLayoutProps {
  children?: React.ReactNode;
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-8">
        <Suspense fallback={<LoadingSpinner message="Cargando módulo..." />}>
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              {children || <Outlet />}
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  );
};
