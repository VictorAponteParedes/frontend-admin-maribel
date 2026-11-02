import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, error, helperText, leftIcon, className = '', id, ...rest }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-stone-700 tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-stone-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full text-xs rounded-xl border bg-white px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 ${
              leftIcon ? 'pl-9' : ''
            } ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                : 'border-stone-300 focus:border-maribel-600 focus:ring-maribel-100 text-stone-900'
            } ${className}`}
            {...rest}
          />
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
