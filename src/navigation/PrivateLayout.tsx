import React, { Suspense } from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Sidebar, PageTransition } from '../components/layout';
import { LoadingSpinner } from '../components/ui';
import { useSidebarStore } from '@/store/useSidebarStore';
import { logoAdmin } from '@/assets';
import { RoutesView } from './routes';
import { useTranslation } from '@/locale';

export interface PrivateLayoutProps {
  children?: React.ReactNode;
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { toggleMobileOpen } = useSidebarStore();

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col lg:flex-row">
      {/* Barra superior Mobile con botón de hamburguesa */}
      <header className="lg:hidden sticky top-0 z-30 bg-stone-900 text-stone-200 px-4 py-3 flex items-center justify-between border-b border-stone-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileOpen}
            className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-maribel-500"
            aria-label={t('nav.openMenu')}
            title={t('nav.openMenu')}
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to={RoutesView.DASHBOARD}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <img
              src={logoAdmin}
              alt="Maribel Tienda de Regalos"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-maribel-600"
            />
            <span className="font-serif font-bold text-white text-sm tracking-wide">
              {t('common.appName')}
            </span>
            <span className="text-[10px] text-maribel-400 font-semibold tracking-wider uppercase bg-maribel-950/60 px-1.5 py-0.5 rounded border border-maribel-800/40">
              {t('common.backoffice')}
            </span>
          </Link>
        </div>
      </header>

      {/* Sidebar (Desktop Sticky / Mobile Drawer) */}
      <Sidebar />

      {/* Área de contenido */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<LoadingSpinner message="Cargando módulo..." />}>
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              {children || <Outlet />}
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
};
