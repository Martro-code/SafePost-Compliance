import React from 'react';
import spLogo from '../assets/SP-logo.svg';

const SafePostLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center ${className}`}>
    <img
      src={spLogo}
      alt="SafePost™"
      className="h-[34px] w-auto"
    />
  </div>
);

export default SafePostLogo;
