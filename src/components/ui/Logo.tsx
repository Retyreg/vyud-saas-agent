import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export function Logo({ className = "", size = 32, withText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vyud-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#399FFF" />
            <stop offset="100%" stopColor="#0062E0" />
          </linearGradient>
        </defs>
        <path 
          d="M4 4 L16 26 L28 4" 
          stroke="url(#vyud-logo-grad)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <circle cx="16" cy="26" r="2.5" fill="url(#vyud-logo-grad)" />
      </svg>
      {withText && (
        <span className="text-xl font-bold tracking-tight font-display text-white">
          VYUD <span className="text-vyud-primary-500">AI</span>
        </span>
      )}
    </div>
  );
}
