import React from 'react';

const SafePostLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    <svg
      width="240"
      height="40"
      viewBox="0 0 240 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto"
      aria-label="SafePost logo"
    >
      {/* Top Bar: Black, Right Aligned */}
      <rect x="12" y="0" width="28" height="8" rx="2" fill="#0F172A" />
      {/* Middle Bar: Blue, Full Width */}
      <rect x="0" y="16" width="40" height="8" rx="2" fill="#2563EB" />
      {/* Bottom Bar: Black, Left Aligned */}
      <rect x="0" y="32" width="20" height="8" rx="2" fill="#0F172A" />
      {/* Wordmark: SafePost */}
      <text
        x="56"
        y="34"
        fill="#0F172A"
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '40px',
          fontWeight: 700,
          letterSpacing: '-0.05em',
        }}
      >
        Safe
        <tspan fill="#2563EB">Post</tspan>
      </text>
    </svg>
    <span className="text-[10px] font-medium text-gray-400 -ml-0.5 mt-1 self-start">
      &trade;
    </span>
  </div>
);

export default SafePostLogo;
