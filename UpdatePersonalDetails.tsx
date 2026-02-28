import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoggedInLayout from './src/components/LoggedInLayout';
import { useAuth } from './useAuth';
import { supabase } from './src/services/supabaseClient';

const UpdatePersonalDetails: React.FC = () => {
  const navigate = useNavigate();
  const { firstName: currentFirstName, surname: currentSurname } = useAuth();

  // Form state
  const [firstNameField, setFirstNameField] = useState(currentFirstName);
  const [lastNameField, setLastNameField] = useState(currentSurname);

  const handleSave = async () => {
    await supabase.auth.updateUser({
      data: {
        first_name: firstNameField.trim(),
        surname: lastNameField.trim(),
      },
    });
    navigate('/profile');
  };

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 dark:text-white">
            Personal Details
          </h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-300">
            Update your personal information
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 md:p-8 space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">First Name</label>
              <input
                type="text"
                value={firstNameField}
                onChange={(e) => setFirstNameField(e.target.value)}
                placeholder="Enter your first name"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Last Name</label>
              <input
                type="text"
                value={lastNameField}
                onChange={(e) => setLastNameField(e.target.value)}
                placeholder="Enter your last name"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          <div className="border-t border-black/[0.06] dark:border-gray-700" />

          <div className="flex items-center gap-3 p-6 md:px-8">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 h-11 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default UpdatePersonalDetails;
