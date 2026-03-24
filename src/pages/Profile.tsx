import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import { useAccount } from '../context/AccountContext';
import { getDisplayPlanName } from '../utils/planUtils';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userEmail, firstName, surname, mobileNumber, practiceName, streetAddress, suburb, userState, postcode, specialty, signOut } = useAuth();
  const { plan: accountPlan, billingPeriod: accountBillingPeriod, specialty: acctSpecialty } = useAccount();

  const displaySpecialty = acctSpecialty || specialty;

  const planName = accountPlan || '';
  const billingPeriod = accountBillingPeriod || '';

  const displayPlanName = getDisplayPlanName(planName);


  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Profile
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            Manage your personal information
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
          {/* Section 1: Personal details */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Personal details</h3>
              <button onClick={() => navigate('/update-personal-details')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                Edit
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">First name</span>
                <span className="text-[14px] font-medium text-gray-900 dark:text-white">{firstName || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Last name</span>
                <span className="text-[14px] font-medium text-gray-900 dark:text-white">{surname || '—'}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-black/[0.06] dark:border-gray-700" />

          {/* Section: Account details */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Account details</h3>
              <button type="button" onClick={() => navigate('/change-plan?mode=upgrade', { state: { from: 'profile' } })} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                Change plan
              </button>
            </div>
            <div>
              <p className="text-[14px] font-medium text-gray-900 dark:text-white">{displayPlanName}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{billingPeriod ? billingPeriod.charAt(0).toUpperCase() + billingPeriod.slice(1).toLowerCase() : 'Monthly'} billing</p>
            </div>
          </div>

          <div className="border-t border-black/[0.06] dark:border-gray-700" />

          {/* Section 2: Contact details */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Contact details</h3>
              <button onClick={() => navigate('/update-contact-details')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                Edit
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Email</span>
                <span className="text-[14px] font-medium text-gray-900 dark:text-white">{userEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Mobile number</span>
                <span className={`text-[14px] ${mobileNumber ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{mobileNumber || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Practice name</span>
                <span className={`text-[14px] ${practiceName ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{practiceName || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Street address</span>
                <span className={`text-[14px] ${streetAddress ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{streetAddress || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Suburb</span>
                <span className={`text-[14px] ${suburb ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{suburb || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">State</span>
                <span className={`text-[14px] ${userState ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{userState || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Postcode</span>
                <span className={`text-[14px] ${postcode ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{postcode || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Specialty</span>
                <span className={`text-[14px] ${displaySpecialty ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'}`}>{displaySpecialty || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-black/[0.06] dark:border-gray-700" />

          {/* Section 3: Password */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">Password</h3>
              <button onClick={() => navigate('/update-password')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                Edit
              </button>
            </div>
            <div>
              <p className="text-[14px] font-medium text-gray-900 dark:text-white">••••••••••••</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Click Edit to change your password</p>
            </div>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default Profile;
