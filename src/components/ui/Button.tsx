import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  className = '',
  disabled,
  ...rest
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs space-x-1.5',
    md: 'px-4 py-2 text-xs space-x-2',
    lg: 'px-5 py-2.5 text-sm space-x-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-maribel-700 hover:bg-maribel-800 active:scale-95 text-white shadow-xs',
    secondary:
      'bg-stone-100 hover:bg-stone-200 text-stone-700 active:scale-95',
    outline:
      'border border-stone-300 text-stone-700 hover:bg-stone-50 active:scale-95',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-xs',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
    </button>
  );
};
