import React from 'react';

const SafePostLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    {/* Icon: Three horizontal bars */}
    <svg
      width="34"
      height="34"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
      aria-hidden="true"
    >
      <rect x="6" y="1" width="13" height="4" rx="1.5" fill="#0F172A" />
      <rect x="1" y="8" width="18" height="4" rx="1.5" fill="#2563EB" />
      <rect x="1" y="15" width="10" height="4" rx="1.5" fill="#0F172A" />
    </svg>
    {/* Wordmark */}
    <span
      className="text-[34px] font-bold tracking-tight leading-none"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <span className="text-slate-900">Safe</span>
      <span className="text-blue-600">Post</span>
    </span>
    <span className="text-[11px] font-medium text-gray-400 -ml-2 self-start mt-1">
      &trade;
    </span>
  </div>
);

export default SafePostLogo;
