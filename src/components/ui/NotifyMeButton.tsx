import React, { useState } from 'react';
import { Check, Loader2, Bell } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface NotifyMeButtonProps {
  planName: string;
  variant?: 'primary' | 'secondary';
}

const NotifyMeButton: React.FC<NotifyMeButtonProps> = ({ planName, variant = 'secondary' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('notify_when_available')
        .insert({ email: email.trim(), plan_name: planName });

      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error('Notify signup error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full py-3 text-[14px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-2">
        <Check className="w-4 h-4" />
        We'll notify you when this plan is available!
      </div>
    );
  }

  const isPrimary = variant === 'primary';

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2.5">
      <div className="flex items-center justify-center gap-1.5 text-[12px] text-gray-400 font-medium">
        <Bell className="w-3.5 h-3.5" />
        Coming soon
      </div>
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2.5 text-[14px] text-gray-900 bg-gray-50 border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`w-full py-3 text-[15px] font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          isPrimary
            ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/30'
            : 'text-gray-600 hover:text-gray-900 border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02]'
        }`}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : status === 'error' ? (
          'Something went wrong. Try again.'
        ) : (
          'Notify me when available'
        )}
      </button>
    </form>
  );
};

export default NotifyMeButton;
