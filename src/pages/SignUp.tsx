import React, { useState, useCallback, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, Eye, EyeOff, Menu, X, ExternalLink, ArrowLeft, Loader2, CheckCircle2, Stethoscope } from 'lucide-react';
import SafePostLogo from '../components/ui/SafePostLogo';
import PublicFooter from '../components/layout/PublicFooter';
import { supabase } from '../services/supabaseClient';
import { useGooglePlacesAutocomplete } from '../hooks/useGooglePlacesAutocomplete';
import { trackSignUp } from '../services/analytics';
import { sanitizeInput } from '../utils/sanitizeInput';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || '';
  const billing = searchParams.get('billing') || '';

  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [practiceName, setPracticeName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [abn, setAbn] = useState('');
  const [abnVerified, setAbnVerified] = useState(false);
  const [abnEntityName, setAbnEntityName] = useState('');
  const [abnStatus, setAbnStatus] = useState('');
  const [abnLoading, setAbnLoading] = useState(false);
  const [abnError, setAbnError] = useState('');
  const abnControllerRef = useRef<AbortController | null>(null);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Header state
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [customersDropdownOpen, setCustomersDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobilePricingOpen, setMobilePricingOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);

  const handlePlaceSelected = useCallback((address: { streetAddress: string; suburb: string; state: string; postcode: string }) => {
    setStreetAddress(address.streetAddress);
    setSuburb(address.suburb);
    setState(address.state);
    setPostcode(address.postcode);
  }, []);

  const { inputRef: streetAddressInputRef, isLoaded: placesLoaded } = useGooglePlacesAutocomplete({
    onPlaceSelected: handlePlaceSelected,
  });

  const resourceLinks = [
    { label: 'Advertising Hub', href: 'https://www.ahpra.gov.au/Resources/Advertising-hub.aspx' },
    { label: 'Code of Conduct', href: 'https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx' },
    { label: 'TGA Guidelines', href: 'https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media' },
  ];

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

  // Validation helpers
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isValidPassword = (val: string) => val.length >= 8 && /^[a-zA-Z0-9]+$/.test(val);
  const passwordHasInvalidChars = password.length > 0 && !/^[a-zA-Z0-9]*$/.test(password);
  const passwordsMatch = () => confirmPassword.length > 0 && password === confirmPassword;
  const isValidAbnFormat = (val: string) => /^\d{11}$/.test(val.replace(/\s/g, ''));

  const verifyAbn = useCallback(async (abnValue: string) => {
    const cleaned = abnValue.replace(/\s/g, '');
    if (!isValidAbnFormat(abnValue)) {
      setAbnVerified(false);
      setAbnEntityName('');
      setAbnStatus('');
      if (cleaned.length > 0) {
        setAbnError('Please enter a valid 11-digit ABN');
      }
      return;
    }

    // Cancel any in-flight request
    if (abnControllerRef.current) abnControllerRef.current.abort();
    const controller = new AbortController();
    abnControllerRef.current = controller;

    setAbnLoading(true);
    setAbnError('');
    setAbnVerified(false);
    setAbnEntityName('');
    setAbnStatus('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-abn', {
        body: { abn: cleaned },
      });

      if (controller.signal.aborted) return;

      if (error) {
        setAbnError('ABN verification service unavailable. Please try again.');
        setAbnVerified(false);
      } else if (!data?.valid) {
        if (data?.error === 'ABN_NOT_FOUND') {
          setAbnError('ABN not found or invalid. Please check your ABN and try again.');
        } else {
          setAbnError('ABN verification service unavailable. Please try again.');
        }
        setAbnVerified(false);
      } else {
        setAbnVerified(true);
        setAbnEntityName(data.entityName || '');
        setAbnStatus(data.status || '');
        setAbnError('');
      }
    } catch {
      if (!controller.signal.aborted) {
        setAbnError('ABN verification service unavailable. Please try again.');
        setAbnVerified(false);
      }
    } finally {
      if (!controller.signal.aborted) setAbnLoading(false);
    }
  }, []);

  const getInputClasses = (value: string, isValid: boolean) => {
    const base = 'w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border outline-none transition-all duration-200 placeholder:text-gray-400';
    if (!submitted && value.length === 0) return `${base} border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`;
    if (isValid) return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20`;
    return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`;
  };

  const allFieldsValid =
    firstName.trim().length > 0 &&
    surname.trim().length > 0 &&
    isValidEmail(email) &&
    mobileNumber.trim().length > 0 &&
    practiceName.trim().length > 0 &&
    specialty.length > 0 &&
    abnVerified &&
    streetAddress.trim().length > 0 &&
    suburb.trim().length > 0 &&
    state.length > 0 &&
    postcode.trim().length > 0 &&
    isValidPassword(password) &&
    passwordsMatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError('');

    if (!allFieldsValid || !agreedToTerms) return;

    setIsSubmitting(true);
    const { data, error } = await supabase.functions.invoke('sign-up', {
      body: {
        email: sanitizeInput(email),
        password,
        firstName: sanitizeInput(firstName.trim()),
        surname: sanitizeInput(surname.trim()),
        mobileNumber: sanitizeInput(mobileNumber.trim()),
        practiceName: sanitizeInput(practiceName.trim()),
        streetAddress: sanitizeInput(streetAddress.trim()),
        suburb: sanitizeInput(suburb.trim()),
        state: sanitizeInput(state),
        postcode: sanitizeInput(postcode.trim()),
        abn: sanitizeInput(abn.replace(/\s/g, '')),
        abnEntityName: sanitizeInput(abnEntityName),
        specialty: sanitizeInput(specialty),
        plan: plan || 'starter',
        billing: billing || 'monthly',
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsSubmitting(false);

    if (error || data?.error) {
      setAuthError(data?.error || error?.message || 'An unexpected error occurred. Please try again.');
      return;
    }

    trackSignUp('email');

      // SECURITY: Do not store plan in sessionStorage — it's user-controllable
      // and no longer read by any feature-gating code. Account provisioning
      // always defaults to 'starter'; paid upgrades go through Stripe.
      const selectedPlan = plan || 'starter';

      // If a paid plan was selected, store pending checkout so Login can redirect to Stripe
      if (selectedPlan && selectedPlan !== 'starter') {
        localStorage.setItem('safepost_pending_checkout', JSON.stringify({
          plan: selectedPlan,
          billing: billing || 'monthly',
        }));
      }

      const params = new URLSearchParams();
      params.set('email', email);
      if (plan) params.set('plan', plan);
      if (billing) params.set('billing', billing);
      navigate(`/verify-email?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/">
            <SafePostLogo />
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <button onClick={() => navigate('/features')} className="px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Features
            </button>
            <div className="relative">
              <button
                onClick={() => setCustomersDropdownOpen(!customersDropdownOpen)}
                onBlur={() => setTimeout(() => setCustomersDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Pricing
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${customersDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {customersDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <button onClick={() => navigate('/pricing/medical-practitioners')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Practitioners
                  </button>
                  <button onClick={() => navigate('/pricing/medical-practices')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Practices
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                onBlur={() => setTimeout(() => setCompanyDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Company
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${companyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {companyDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <button onClick={() => navigate('/about')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    About Us
                  </button>
                  <button onClick={() => navigate('/news')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    News
                  </button>
                  <button onClick={() => navigate('/contact')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Contact Us
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                onBlur={() => setTimeout(() => setResourcesDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <button onClick={() => { navigate('/faq'); setResourcesDropdownOpen(false); }} className="block w-full text-left px-4 py-2.5 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    FAQ
                  </button>
                  {resourceLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 flex-shrink-0 ml-2 opacity-40" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right: Auth buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
              Login
            </button>
            <button onClick={() => navigate('/pricing/medical-practitioners')} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
              Sign up
            </button>
          </div>

          {/* Mobile: Hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] space-y-1">
            <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Home
            </button>

            <button onClick={() => { navigate('/features'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Features
            </button>

            {/* Mobile Pricing Dropdown */}
            <div>
              <button
                onClick={() => setMobilePricingOpen(!mobilePricingOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Pricing
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobilePricingOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: mobilePricingOpen ? '300px' : '0px',
                  opacity: mobilePricingOpen ? 1 : 0,
                }}
              >
                <div className="pl-4 space-y-0.5 pt-1">
                  <button onClick={() => { navigate('/pricing/medical-practitioners'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    Practitioners
                  </button>
                  <button onClick={() => { navigate('/pricing/medical-practices'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    Practices
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Company Dropdown */}
            <div>
              <button
                onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Company
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileCompanyOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: mobileCompanyOpen ? '300px' : '0px',
                  opacity: mobileCompanyOpen ? 1 : 0,
                }}
              >
                <div className="pl-4 space-y-0.5 pt-1">
                  <button onClick={() => { navigate('/about'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    About Us
                  </button>
                  <button onClick={() => { navigate('/news'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    News
                  </button>
                  <button onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Resources Dropdown */}
            <div>
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: mobileResourcesOpen ? '300px' : '0px',
                  opacity: mobileResourcesOpen ? 1 : 0,
                }}
              >
                <div className="pl-4 space-y-0.5 pt-1">
                  <button onClick={() => { navigate('/faq'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    FAQ
                  </button>
                  {resourceLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 flex-shrink-0 ml-2 opacity-40" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2">
              <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
                Login
              </button>
              <button onClick={() => { navigate('/pricing/medical-practitioners'); setMobileMenuOpen(false); }} className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sign up Form */}
      <main className="flex-grow flex items-center justify-center px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        <div className="w-full max-w-[450px]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                Create account
              </h1>
              <p className="text-[14px] text-gray-500">
                Enter your information to create a new account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First name */}
              <div>
                <label htmlFor="firstName" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={getInputClasses(firstName, firstName.trim().length > 0)}
                />
                {submitted && !firstName.trim() && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
              </div>

              {/* Surname */}
              <div>
                <label htmlFor="surname" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  id="surname"
                  type="text"
                  placeholder="Enter your last name"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className={getInputClasses(surname, surname.trim().length > 0)}
                />
                {submitted && !surname.trim() && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={getInputClasses(email, isValidEmail(email))}
                />
                {submitted && !email.trim() && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
                {submitted && email.trim() && !isValidEmail(email) && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">Please enter a valid email address.</p>
                )}
              </div>

              {/* Mobile number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Mobile number <span className="text-red-500">*</span>
                </label>
                <input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  onKeyDown={(e) => { if (e.key.length === 1 && !/[0-9]/.test(e.key)) e.preventDefault(); }}
                  className={getInputClasses(mobileNumber, mobileNumber.trim().length > 0)}
                />
                {submitted && !mobileNumber.trim() && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
              </div>

              {/* Practice name */}
              <div>
                <label htmlFor="practiceName" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Practice name <span className="text-red-500">*</span>
                </label>
                <input
                  id="practiceName"
                  type="text"
                  placeholder="Enter your practice name"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  className={getInputClasses(practiceName, practiceName.trim().length > 0)}
                />
                {submitted && !practiceName.trim() && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
              </div>

              {/* Specialty */}
              <div>
                <label htmlFor="specialty" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className={`${getInputClasses(specialty, specialty.length > 0)} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>Select your specialty</option>
                    {specialtyOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {submitted && !specialty && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
              </div>

              {/* ABN */}
              <div>
                <label htmlFor="abn" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  ABN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="abn"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter your 11-digit ABN"
                    value={abn}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d\s]/g, '');
                      setAbn(val);
                      if (abnVerified || abnError) {
                        setAbnVerified(false);
                        setAbnEntityName('');
                        setAbnStatus('');
                        setAbnError('');
                      }
                    }}
                    onBlur={() => verifyAbn(abn)}
                    maxLength={14}
                    className={getInputClasses(abn, abnVerified)}
                  />
                  {abnLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    </div>
                  )}
                  {abnVerified && !abnLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
                {abnVerified && !abnLoading && (
                  <p className="text-[13px] text-green-600 font-medium mt-1.5 flex items-center gap-1">
                    <span>&#10003;</span> {abnEntityName ? `${abnEntityName} — ${abnStatus}` : 'ABN verified'}
                  </p>
                )}
                {!abnVerified && abnError && !abnLoading && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">{abnError}</p>
                )}
                {submitted && !abnVerified && !abnError && abn.replace(/\s/g, '').length === 0 && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
                {submitted && !abnVerified && !abnError && abn.replace(/\s/g, '').length > 0 && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">Please verify your ABN.</p>
                )}
              </div>

              {/* Street address */}
              <div>
                <label htmlFor="streetAddress" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Street address <span className="text-red-500">*</span>
                </label>
                <input
                  id="streetAddress"
                  ref={streetAddressInputRef}
                  type="text"
                  placeholder="Enter your street address"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className={getInputClasses(streetAddress, streetAddress.trim().length > 0)}
                />
                {submitted && !streetAddress.trim() && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
              </div>

              {/* Suburb */}
              <div>
                <label htmlFor="suburb" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Suburb <span className="text-red-500">*</span>
                </label>
                <input
                  id="suburb"
                  type="text"
                  placeholder="Enter your suburb"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  className={getInputClasses(suburb, suburb.trim().length > 0)}
                />
                {submitted && !suburb.trim() && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`${getInputClasses(state, state.length > 0)} appearance-none cursor-pointer`}
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
                {submitted && !state && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
              </div>

              {/* Postcode */}
              <div>
                <label htmlFor="postcode" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Postcode <span className="text-red-500">*</span>
                </label>
                <input
                  id="postcode"
                  type="tel"
                  placeholder="Enter your postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.slice(0, 4))}
                  onKeyDown={(e) => { if (e.key.length === 1 && !/[0-9]/.test(e.key)) e.preventDefault(); }}
                  maxLength={4}
                  className={getInputClasses(postcode, postcode.trim().length > 0)}
                />
                {submitted && !postcode.trim() && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password (min. 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                    className={getInputClasses(password, isValidPassword(password))}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {passwordHasInvalidChars && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">Password must contain only letters and numbers — no spaces or special characters.</p>
                )}
                {submitted && !password && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
                {submitted && password && password.length < 8 && !passwordHasInvalidChars && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">Password must be at least 8 characters.</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={getInputClasses(confirmPassword, passwordsMatch())}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {submitted && !confirmPassword && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">This field is required.</p>
                )}
                {submitted && confirmPassword && !passwordsMatch() && (
                  <p className="text-[13px] text-red-600 font-medium mt-1.5">Passwords do not match.</p>
                )}
              </div>

              {/* Auth Error */}
              {authError && (
                <p className="text-[13px] text-red-600 font-medium">{authError}</p>
              )}

              {/* Terms Checkbox */}
              <div className="pt-2">
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    disabled={!allFieldsValid}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  />
                  <label htmlFor="terms" className={`text-[13px] leading-relaxed ${!allFieldsValid ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'}`}>
                    I agree to the{' '}
                    <a href="https://www.safepost.com.au/terms-of-use" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                      Software Terms and Conditions
                    </a>
                    ,{' '}
                    <a href="https://www.safepost.com.au/privacy-policy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                      Privacy Policy
                    </a>
                    , and{' '}
                    <a href="https://www.safepost.com.au/website-terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                      Website Terms of Use
                    </a>
                  </label>
                </div>
                {submitted && allFieldsValid && !agreedToTerms && (
                  <p className="text-[13px] text-red-600 font-medium mt-2 ml-7">
                    Please tick this box to continue.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !allFieldsValid || !agreedToTerms}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30"
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>

            {/* OR Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[13px] font-medium text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: 'https://www.safepost.com.au/auth/callback',
                  },
                });
              }}
              className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-[15px] font-semibold text-gray-700 rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Footer */}
            <p className="text-center text-[13px] text-gray-500 mt-6">
              Already have an account?{' '}
              <a onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 cursor-pointer">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default SignUp;
