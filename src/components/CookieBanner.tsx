import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('safepost_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('safepost_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('safepost_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/[0.06] shadow-lg shadow-black/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Left — text */}
        <div className="flex-1">
          <p className="text-[13px] text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">SafePost™ uses cookies</span> to improve your experience and analyse site usage.
            By continuing to use SafePost™ you agree to our{' '}
            <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <a href="/cookie-policy" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
              Cookie Policy
            </a>.
          </p>
        </div>

        {/* Right — buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/25 transition-colors"
          >
            Accept All
          </button>
        </div>

      </div>
    </div>
  );
};

export default CookieBanner;
