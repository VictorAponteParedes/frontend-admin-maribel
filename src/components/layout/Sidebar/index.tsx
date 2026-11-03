import React from 'react';
import { useSidebarNav } from './hooks/useSidebarNav';
import { SidebarBackdrop } from './SidebarBackdrop';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarUserProfile } from './SidebarUserProfile';

export const Sidebar: React.FC = () => {
  const { state, actions } = useSidebarNav();

  return (
    <>
      {/* Backdrop para mobile */}
      <SidebarBackdrop
        isOpen={state.isMobileOpen}
        onClose={actions.closeMobile}
      />

      {/* Contenedor del Sidebar */}
      <aside
        className={`bg-stone-900 text-stone-200 flex flex-col h-screen border-r border-stone-800 select-none shrink-0 transition-all duration-300 z-50
          fixed inset-y-0 left-0
          lg:static lg:h-screen lg:sticky lg:top-0
          ${
            state.isMobileOpen
              ? 'translate-x-0 shadow-2xl'
              : '-translate-x-full lg:translate-x-0'
          }
          w-72
          ${state.isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Cabecera del Sidebar */}
        <SidebarHeader
          isCollapsed={state.isCollapsed}
          onToggleCollapse={actions.toggleCollapse}
          onCloseMobile={actions.closeMobile}
          onNavClick={actions.handleNavClick}
        />

        {/* Lista de Navegación */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {state.navItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              isCollapsed={state.isCollapsed}
              isSettingsExpanded={state.isSettingsExpanded}
              onToggleSettings={() =>
                actions.setIsSettingsExpanded((prev) => !prev)
              }
              onNavClick={actions.handleNavClick}
            />
          ))}
        </nav>

        {/* Perfil del usuario autenticado */}
        <SidebarUserProfile
          user={state.user}
          isCollapsed={state.isCollapsed}
          onLogout={actions.handleLogout}
        />
      </aside>
    </>
  );
};
