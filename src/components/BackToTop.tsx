import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const location = useLocation();
  const allowedPaths = ['/terms-of-use', '/privacy-policy'];

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!allowedPaths.includes(location.pathname)) {
      setVisible(false);
      return;
    }
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md shadow-black/[0.08] flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 active:scale-95 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
