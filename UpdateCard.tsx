import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import LoggedInLayout from './src/components/LoggedInLayout';

const UpdateCard: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Billing */}
        <button
          onClick={() => navigate('/billing')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Billing
        </button>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Update your Card
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            Your new card will replace your current card
          </p>
        </div>

        {/* Update Card Form */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 md:p-8 space-y-5">
            {/* Name on Card */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2 dark:text-gray-300">Name on Card</label>
              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="Name on card"
                className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2 dark:text-gray-300">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                    setCardNumber(formatted);
                  }}
                  placeholder="Card number"
                  inputMode="numeric"
                  className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 pr-12"
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Expiry + CVC */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[13px] font-semibold text-gray-700 mb-2 dark:text-gray-300">Expiry Date</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (raw.length <= 2) {
                      setExpiry(raw);
                    } else {
                      setExpiry(raw.slice(0, 2) + '/' + raw.slice(2));
                    }
                  }}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[13px] font-semibold text-gray-700 mb-2 dark:text-gray-300">CVC</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
                    setCvc(raw);
                  }}
                  placeholder="CVC"
                  inputMode="numeric"
                  maxLength={3}
                  className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Default payment method checkbox */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsDefault}
                  onChange={(e) => setSetAsDefault(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[13px] text-gray-600 dark:text-gray-300">Set as default payment method</span>
              </label>
            </div>
          </div>

          <div className="border-t border-black/[0.06] dark:border-gray-700" />

          {/* Buttons */}
          <div className="flex items-center gap-3 p-6 md:px-8">
            <button
              onClick={() => navigate('/billing')}
              className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
            >
              Cancel
            </button>
            <button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]">
              Update Card
            </button>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default UpdateCard;
