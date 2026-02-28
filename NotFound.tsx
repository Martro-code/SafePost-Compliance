import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f4] px-4">
      <div className="relative flex flex-col items-center">
        {/* Large 404 watermark */}
        <span className="text-[120px] font-extrabold leading-none text-[#2563EB] opacity-20 select-none">
          404
        </span>

        {/* SafePost wordmark */}
        <div className="flex items-center gap-0 mt-2 mb-6">
          <span className="text-[24px] font-extrabold tracking-tight text-gray-900">Safe</span>
          <span className="text-[24px] font-extrabold tracking-tight text-[#2563EB]">Post</span>
          <span className="text-[12px] font-medium text-gray-400 ml-0.5 -mt-2">™</span>
        </div>

        {/* Headline and subtext */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-[14px] text-gray-500 text-center max-w-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/')}
                className="h-11 px-6 border border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Back to Home
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/')}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="h-11 px-6 border border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
