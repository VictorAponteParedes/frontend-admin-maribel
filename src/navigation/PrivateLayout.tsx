import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';

export interface PrivateLayoutProps {
  children: React.ReactNode;
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-8">
        {children}
      </div>
    </div>
  );
};
