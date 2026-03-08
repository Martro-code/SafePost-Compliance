import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const STORAGE_KEY = 'safepost-announcement-dismissed';

const AnnouncementBanner = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
        <p className="text-[13px] text-amber-800 leading-snug flex-1 min-w-0">
          SafePost is in early access — join now and lock in founding member pricing.
          {' '}
          <button
            onClick={() => navigate('/signup')}
            className="font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-2 whitespace-nowrap"
          >
            Get started free &rarr;
          </button>
        </p>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-md text-amber-600 hover:text-amber-800 hover:bg-amber-100 transition-colors duration-200"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
