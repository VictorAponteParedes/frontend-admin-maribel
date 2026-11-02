import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  prefixText?: string;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      rightElement,
      prefixText,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-stone-700 tracking-wide flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-stone-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          {prefixText && !leftIcon && (
            <span className="absolute left-3.5 text-xs font-bold text-stone-400 pointer-events-none select-none">
              {prefixText}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full text-xs rounded-xl border bg-white py-2.5 transition-all focus:outline-none focus:ring-2 ${
              leftIcon
                ? 'pl-9'
                : prefixText
                ? 'pl-11'
                : 'px-3.5'
            } ${
              rightElement
                ? 'pr-28'
                : rightIcon
                ? 'pr-9'
                : 'pr-3.5'
            } ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                : 'border-stone-300 focus:border-maribel-600 focus:ring-maribel-100 text-stone-900'
            } ${className}`}
            {...rest}
          />

          {rightIcon && !rightElement && (
            <div className="absolute right-3 text-stone-400 pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}

          {rightElement && (
            <div className="absolute right-2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error ? (
          <span className="text-[11px] font-medium text-rose-600">{error}</span>
        ) : helperText ? (
          <span className="text-[11px] text-stone-400">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

AppInput.displayName = 'AppInput';
