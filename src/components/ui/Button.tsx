'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'saffron' | 'secondary' | 'saffron-beam';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'saffron',
  children,
  className = '',
  ...props
}) => {
  if (variant === 'saffron-beam') {
    return (
      <div className="saffron-beam-container inline-block">
        <button
          className={`relative z-10 px-8 py-3.5 rounded-full bg-[#F59E0B] text-slate-950 font-semibold text-sm tracking-tight transition-transform hover:bg-[#EAA00A] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 focus:ring-offset-white ${className}`}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        className={`px-6 py-3 rounded-full bg-white text-slate-800 border border-slate-200 font-medium text-sm tracking-tight hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-white shadow-sm ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  // Default saffron button (human action)
  return (
    <button
      className={`px-6 py-3 rounded-full bg-[#F59E0B] text-slate-950 font-semibold text-sm tracking-tight hover:bg-[#D97706] hover:text-white transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 focus:ring-offset-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
