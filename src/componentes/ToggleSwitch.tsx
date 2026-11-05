import React from 'react';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  activeColor?: string;
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  size = 'md',
  activeColor = 'bg-emerald-600',
  disabled = false,
  ariaLabel,
  title,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(!checked);
    }
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  // Configuración de dimensiones según tamaño
  const trackClasses = isSmall
    ? 'w-9 h-5 p-0.5'
    : isLarge
    ? 'w-14 h-8 p-1'
    : 'w-11 h-6 p-0.5';

  const thumbClasses = isSmall
    ? `w-4 h-4 ${checked ? 'translate-x-4' : 'translate-x-0'}`
    : isLarge
    ? `w-6 h-6 ${checked ? 'translate-x-6' : 'translate-x-0'}`
    : `w-5 h-5 ${checked ? 'translate-x-5' : 'translate-x-0'}`;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      onClick={handleClick}
      className={`relative inline-flex items-center shrink-0 rounded-full transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${trackClasses} ${
        checked ? activeColor : 'bg-stone-300 hover:bg-stone-400/80'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out pointer-events-none ${thumbClasses}`}
      />
    </button>
  );
};

export default ToggleSwitch;
