import React, { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import PricingMedicalPractitioners from './pages/PricingMedicalPractitioners';
import PricingMedicalPractices from './pages/PricingMedicalPractices';
import ContactUs from './pages/ContactUs';
import Features from './pages/Features';
import About from './pages/About';
import FAQ from './pages/FAQ';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import VerifyEmail from './pages/VerifyEmail';
import AuthCallback from './pages/AuthCallback';
import BillingInformation from './pages/BillingInformation';
import History from './pages/History';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ChangePlan from './pages/ChangePlan';
import UpdateCard from './pages/UpdateCard';
import UpdateBillingEmail from './pages/UpdateBillingEmail';
import UpdatePersonalDetails from './pages/UpdatePersonalDetails';
import UpdateContactDetails from './pages/UpdateContactDetails';
import UpgradeConfirmation from './pages/UpgradeConfirmation';
import CancelSubscription from './pages/CancelSubscription';
import TwoFactorAuth from './pages/TwoFactorAuth';
import MFAChallenge from './pages/MFAChallenge';
import NotificationsInbox from './pages/NotificationsInbox';
import Help from './pages/Help';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ProtectedRoute from './pages/ProtectedRoute';
import { ComplianceCheckerPage } from './pages/ComplianceCheckerPage';
import TeamMembers from './pages/TeamMembers';
import AcceptInvitation from './pages/AcceptInvitation';
import NewsPage from './pages/NewsPage';
import NewsArticlePage from './pages/NewsArticlePage';
import NotFound from './pages/NotFound';
import CookieBanner from './components/ui/CookieBanner';
import BackToTop from './components/ui/BackToTop';

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
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsArticlePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/mfa-challenge" element={<MFAChallenge />} />
          <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/billing" element={<ProtectedRoute requireOwner><BillingInformation /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/settings/team" element={<ProtectedRoute requireOwner><TeamMembers /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/change-plan" element={<ProtectedRoute requireOwner><ChangePlan /></ProtectedRoute>} />
          <Route path="/update-card" element={<ProtectedRoute requireOwner><UpdateCard /></ProtectedRoute>} />
          <Route path="/update-billing-email" element={<ProtectedRoute requireOwner><UpdateBillingEmail /></ProtectedRoute>} />
          <Route path="/update-personal-details" element={<ProtectedRoute><UpdatePersonalDetails /></ProtectedRoute>} />
          <Route path="/update-contact-details" element={<ProtectedRoute><UpdateContactDetails /></ProtectedRoute>} />
          <Route path="/upgrade-confirmation" element={<ProtectedRoute requireOwner><UpgradeConfirmation /></ProtectedRoute>} />
          <Route path="/cancel-subscription" element={<ProtectedRoute requireOwner><CancelSubscription /></ProtectedRoute>} />
          <Route path="/two-factor-auth" element={<ProtectedRoute><TwoFactorAuth /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsInbox /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          <Route path="/compliance-checker" element={<ProtectedRoute><ComplianceCheckerPage /></ProtectedRoute>} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <CookieBanner />
      <BackToTop />
    </>
  );
};

export default App;
