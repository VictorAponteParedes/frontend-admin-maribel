import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';
import { AuthUser } from '@/store/useAuthStore';

interface SidebarUserProfileProps {
  user: AuthUser | null;
  isCollapsed: boolean;
  onLogout: () => void;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  user,
  isCollapsed,
  onLogout,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`border-t border-stone-800 bg-stone-950/40 transition-all ${
        isCollapsed ? 'p-3 lg:px-2 lg:py-3' : 'p-4'
      }`}
    >
      <div
        className={`flex items-center ${
          isCollapsed ? 'lg:justify-center justify-between' : 'justify-between'
        }`}
      >
        <div
          className={`truncate pr-2 ${
            isCollapsed ? 'lg:hidden block' : 'block'
          }`}
        >
          <p className="text-xs font-semibold text-stone-200 truncate">
            {user?.fullName || 'Administrator'}
          </p>
          <p className="text-[11px] text-stone-500 truncate">
            {user?.email || 'admin@maribel.com'}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onLogout}
          title={t('nav.logout')}
          aria-label={t('nav.logout')}
          className={`text-stone-400 hover:!text-rose-400 hover:!bg-stone-800 rounded-lg ${
            isCollapsed ? 'p-2.5' : 'p-2'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
        </Button>
      </div>
    </div>
  );
};
