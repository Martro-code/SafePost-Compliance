import React, { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './SignUp';
import Login from './Login';
import PricingMedicalPractitioners from './PricingMedicalPractitioners';
import PricingMedicalPractices from './PricingMedicalPractices';
import ContactUs from './ContactUs';
import Features from './Features';
import About from './About';
import ForgotPassword from './ForgotPassword';
import UpdatePassword from './UpdatePassword';
import Dashboard from './Dashboard';
import Checkout from './Checkout';
import VerifyEmail from './VerifyEmail';
import BillingInformation from './BillingInformation';
import History from './History';
import Settings from './Settings';
import Profile from './Profile';
import ChangePlan from './ChangePlan';
import UpdateCard from './UpdateCard';
import UpdateBillingEmail from './UpdateBillingEmail';
import UpdatePersonalDetails from './UpdatePersonalDetails';
import UpdateContactDetails from './UpdateContactDetails';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import ProtectedRoute from './ProtectedRoute';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <div className="page-transition">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing/medical-practitioners" element={<PricingMedicalPractitioners />} />
          <Route path="/pricing/medical-practices" element={<PricingMedicalPractices />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/billing" element={<ProtectedRoute><BillingInformation /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/change-plan" element={<ProtectedRoute><ChangePlan /></ProtectedRoute>} />
          <Route path="/update-card" element={<ProtectedRoute><UpdateCard /></ProtectedRoute>} />
          <Route path="/update-billing-email" element={<ProtectedRoute><UpdateBillingEmail /></ProtectedRoute>} />
          <Route path="/update-personal-details" element={<ProtectedRoute><UpdatePersonalDetails /></ProtectedRoute>} />
          <Route path="/update-contact-details" element={<ProtectedRoute><UpdateContactDetails /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
