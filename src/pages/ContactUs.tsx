import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PublicHeader from '../components/layout/PublicHeader';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import PublicFooter from '../components/layout/PublicFooter';
import { supabase } from '../services/supabaseClient';
import { trackContactFormSubmitted } from '../services/analytics';



const ContactUs: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validation helpers
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const getInputClasses = (value: string, isValid: boolean) => {
    const base = 'w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border outline-none transition-all duration-200 placeholder:text-gray-400';
    if (!submitted && value.length === 0) return `${base} border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`;
    if (isValid) return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20`;
    return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`;
  };

  const getSelectClasses = (value: string, isValid: boolean) => {
    const base = 'w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border outline-none transition-all duration-200';
    if (!submitted && value.length === 0) return `${base} border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`;
    if (isValid) return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20`;
    return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`;
  };

  const getTextareaClasses = (value: string, isValid: boolean) => {
    const base = 'w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-lg border outline-none transition-all duration-200 placeholder:text-gray-400 resize-none';
    if (!submitted && value.length === 0) return `${base} border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`;
    if (isValid) return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20`;
    return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage('');

    const isFormValid =
      firstName.trim().length > 0 &&
      surname.trim().length > 0 &&
      isValidEmail(email) &&
      category.trim().length > 0 &&
      message.trim().length > 0;

    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-contact-form', {
        body: {
          first_name: firstName.trim(),
          last_name: surname.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          category,
          message: message.trim(),
        },
      });

      if (error) throw error;

      trackContactFormSubmitted();
      setSuccess(true);
      setFirstName('');
      setSurname('');
      setEmail('');
      setPhone('');
      setCategory('');
      setMessage('');
      setSubmitted(false);
    } catch (err: any) {
      console.error('Contact form error:', err);
      setErrorMessage('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  const contentSection = (
      <main className="flex-grow flex items-center justify-center px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        <div className="w-full max-w-[550px]">
          <button
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {user ? 'Back to Dashboard' : 'Back to Home'}
          </button>
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04] p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                Get in touch
              </h1>
              <p className="text-[14px] text-gray-500">
                We'd love to hear from you! Please fill out the form below
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-[14px] text-green-700 text-center">
                  Thank you for contacting us! We'll get back to you within 24 hours.
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-[14px] text-red-700 text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Form */}
            <h2 className="sr-only">Contact SafePost about AHPRA and TGA compliance</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First name */}
              <div>
                <label htmlFor="firstName" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setSuccess(false); setErrorMessage(''); }}
                  className={getInputClasses(firstName, firstName.trim().length > 0)}
                />
              </div>

              {/* Surname */}
              <div>
                <label htmlFor="surname" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Last name
                </label>
                <input
                  id="surname"
                  type="text"
                  placeholder="Enter your last name"
                  value={surname}
                  onChange={(e) => { setSurname(e.target.value); setSuccess(false); setErrorMessage(''); }}
                  className={getInputClasses(surname, surname.trim().length > 0)}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSuccess(false); setErrorMessage(''); }}
                  className={getInputClasses(email, isValidEmail(email))}
                />
              </div>

              {/* Phone number */}
              <div>
                <label htmlFor="phone" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="04XX XXX XXX"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setSuccess(false); setErrorMessage(''); }}
                  onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                  className={getInputClasses(phone, phone.trim().length > 0)}
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setSuccess(false); setErrorMessage(''); }}
                  className={getSelectClasses(category, category.trim().length > 0)}
                >
                  <option value="">Select a topic...</option>
                  <option value="Compliance check question">Compliance check question</option>
                  <option value="Billing or subscription">Billing or subscription</option>
                  <option value="Account or login issue">Account or login issue</option>
                  <option value="Feature request">Feature request</option>
                  <option value="Report a bug">Report a bug</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setSuccess(false); setErrorMessage(''); }}
                  rows={6}
                  style={{ height: '150px' }}
                  className={getTextareaClasses(message, message.trim().length > 0)}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

  );

  if (user) {
    return (
      <LoggedInLayout>
        {contentSection}
      </LoggedInLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>Contact SafePost</title>
        <meta name="description" content="Get in touch with the SafePost team. We're here to help with questions about compliance checking, pricing, or your account." />
      </Helmet>
      <PublicHeader />

      {contentSection}

      <PublicFooter />
    </div>
  );

};

export default ContactUs;
