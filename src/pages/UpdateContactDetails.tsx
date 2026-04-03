import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import { useAccount } from '../context/AccountContext';
import { supabase } from '../services/supabaseClient';
import { sanitizeInput } from '../utils/sanitizeInput';

const UpdateContactDetails: React.FC = () => {
  const navigate = useNavigate();
  const {
    userEmail,
    mobileNumber: currentMobile,
    practiceName: currentPractice,
    streetAddress: currentStreet,
    suburb: currentSuburb,
    userState: currentState,
    postcode: currentPostcode,
    specialty: currentSpecialty,
  } = useAuth();
  const {
    accountId,
    mobile: acctMobile,
    practiceName: acctPractice,
    address: acctAddress,
    suburb: acctSuburb,
    state: acctState,
    postcode: acctPostcode,
    specialty: acctSpecialty,
    accountLoading,
    refreshAccount,
  } = useAccount();

  // Form state — initialised with whatever is already available synchronously;
  // the useEffect below re-populates once the account fetch completes.
  const [email, setEmail] = useState(userEmail);
  const [mobileNumber, setMobileNumber] = useState(acctMobile || currentMobile || '');
  const [practiceName, setPracticeName] = useState(acctPractice || currentPractice || '');
  const [streetAddress, setStreetAddress] = useState(acctAddress || currentStreet || '');
  const [suburb, setSuburb] = useState(acctSuburb || currentSuburb || '');
  const [state, setState] = useState(acctState || currentState || '');
  const [postcode, setPostcode] = useState(acctPostcode || currentPostcode || '');
  const [specialty, setSpecialty] = useState(acctSpecialty || currentSpecialty || '');

  // Re-populate all fields once account data finishes loading.
  // useState runs once at mount; if the AccountContext async fetch hasn't
  // completed yet the initial values above are empty strings. This effect
  // fires when accountLoading transitions to false and sets the real values.
  useEffect(() => {
    if (!accountLoading) {
      setMobileNumber(acctMobile || currentMobile || '');
      setPracticeName(acctPractice || currentPractice || '');
      setStreetAddress(acctAddress || currentStreet || '');
      setSuburb(acctSuburb || currentSuburb || '');
      setState(acctState || currentState || '');
      setPostcode(acctPostcode || currentPostcode || '');
      setSpecialty(acctSpecialty || currentSpecialty || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountLoading]);

  const specialtyOptions = [
    'Anaesthetist',
    'Cardiologist',
    'Cardiothoracic Surgeon',
    'Chiropractor',
    'Colorectal Surgeon',
    'Cosmetic Medicine',
    'Dentist (General)',
    'Dental Specialist',
    'Dermatologist',
    'Emergency Medicine',
    'Endocrinologist',
    'Gastroenterologist',
    'General Practitioner',
    'General Practice (Obstetrics)',
    'General Practice (Procedural)',
    'General Practice (Skin Cancer Medicine)',
    'Geriatrician',
    'Haematologist',
    'Immunologist / Allergist',
    'Infectious Diseases Physician',
    'Intensive Care',
    'Midwife',
    'Nephrologist',
    'Neurologist',
    'Neurosurgeon',
    'Nurse Practitioner',
    'Obstetrics & Gynaecology',
    'Occupational Therapist',
    'Oncologist',
    'Ophthalmologist (Non-Procedural)',
    'Ophthalmologist (Procedural)',
    'Optometrist',
    'Oral & Maxillofacial Surgeon',
    'Orthopaedic Surgeon',
    'Otolaryngologist (ENT)',
    'Paediatrician',
    'Paediatric Surgeon',
    'Pain Management',
    'Palliative Care',
    'Pathologist',
    'Pharmacist',
    'Physician (General / Internal Medicine)',
    'Physiotherapist',
    'Plastic & Reconstructive Surgeon',
    'Psychiatrist',
    'Psychologist',
    'Radiation Oncologist',
    'Radiographer',
    'Radiologist',
    'Rehabilitation Medicine',
    'Respiratory Physician',
    'Rheumatologist',
    'Speech Pathologist',
    'Sports Medicine',
    'Surgeon (General)',
    'Urologist',
    'Vascular Surgeon',
    'Other',
  ];

  const handleSave = async () => {
    // Fetch the current DB values first so that any field left blank in the
    // form (e.g. because the account context hadn't loaded yet) falls back to
    // the existing saved value rather than overwriting it with an empty string.
    let current: Record<string, string | null> = {};
    if (accountId) {
      const { data } = await supabase
        .from('accounts')
        .select('mobile, practice_name, address, suburb, state, postcode, specialty')
        .eq('id', accountId)
        .single();
      if (data) current = data;
    }

    // Use the form value when non-empty; otherwise preserve the existing DB value.
    const merged = (formVal: string, dbKey: string) =>
      formVal.trim() ? sanitizeInput(formVal.trim()) : (current[dbKey] ?? null);

    const accountUpdate = {
      mobile:        merged(mobileNumber,  'mobile'),
      practice_name: merged(practiceName,  'practice_name'),
      address:       merged(streetAddress, 'address'),
      suburb:        merged(suburb,        'suburb'),
      state:         state || current.state || null,
      postcode:      merged(postcode,      'postcode'),
      specialty:     specialty || current.specialty || null,
    };

    // Update user_metadata
    await supabase.auth.updateUser({
      data: {
        mobile_number: accountUpdate.mobile,
        practice_name: accountUpdate.practice_name,
        street_address: accountUpdate.address,
        suburb: accountUpdate.suburb,
        state: accountUpdate.state,
        postcode: accountUpdate.postcode,
        specialty: accountUpdate.specialty,
      },
    });

    // Persist to accounts table
    if (accountId) {
      await supabase
        .from('accounts')
        .update(accountUpdate)
        .eq('id', accountId);
      await refreshAccount();
    }

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Contact details
          </h1>
          <p className="text-[14px] text-gray-500 mt-1 mb-8">
            Update your contact and practice information
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 md:p-8 space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Mobile number</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                placeholder="Enter your mobile number"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Practice name</label>
              <input
                type="text"
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                placeholder="Enter your practice name"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Street address</label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Enter your street address"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Suburb</label>
              <input
                type="text"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                placeholder="Enter your suburb"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">State</label>
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="" disabled>Select your state</option>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="WA">WA</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="ACT">ACT</option>
                  <option value="NT">NT</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Postcode</label>
              <input
                type="tel"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                maxLength={4}
                placeholder="Enter your postcode"
                className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5 dark:text-gray-300">Specialty</label>
              <div className="relative">
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="" disabled>Select your specialty</option>
                  {specialtyOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
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
              Save changes
            </button>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default UpdateContactDetails;
