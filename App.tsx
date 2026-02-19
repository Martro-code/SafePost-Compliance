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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
