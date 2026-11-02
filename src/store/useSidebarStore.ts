import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleMobileOpen: () => void;
  setMobileOpen: (open: boolean) => void;
  closeMobile: () => void;
}

const SIDEBAR_COLLAPSED_KEY = 'admin_sidebar_collapsed';

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: typeof window !== 'undefined' ? localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true' : false,
  isMobileOpen: false,
  toggleCollapse: () =>
    set((state) => {
      const next = !state.isCollapsed;
      if (typeof window !== 'undefined') {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      }
      return { isCollapsed: next };
    }),
  setIsCollapsed: (isCollapsed: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
    }
    set({ isCollapsed });
  },
  toggleMobileOpen: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setMobileOpen: (isMobileOpen: boolean) => set({ isMobileOpen }),
  closeMobile: () => set({ isMobileOpen: false }),
}));
