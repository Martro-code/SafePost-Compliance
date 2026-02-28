import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import LoggedInLayout from './src/components/LoggedInLayout';

const EmailPreferences: React.FC = () => {
  const navigate = useNavigate();

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Settings */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 dark:text-white">
            Email Preferences
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4 dark:bg-green-950">
            <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-[14px] text-gray-600 dark:text-gray-300 mb-6">
            These preferences are now managed directly from the Settings page.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </button>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default EmailPreferences;
