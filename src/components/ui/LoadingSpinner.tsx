import React from 'react';

export interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  message,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="w-8 h-8 border-3 border-maribel-200 border-t-maribel-700 rounded-full animate-spin" />
      {message && (
        <p className="text-xs font-medium text-stone-500 tracking-wide">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-50/80 backdrop-blur-xs flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
