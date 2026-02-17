import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './SignUp';
import Login from './Login';
import PricingMedicalPractitioners from './PricingMedicalPractitioners';
import PricingMedicalPractices from './PricingMedicalPractices';
import ContactUs from './ContactUs';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing/medical-practitioners" element={<PricingMedicalPractitioners />} />
      <Route path="/pricing/medical-practices" element={<PricingMedicalPractices />} />
      <Route path="/contact" element={<ContactUs />} />
    </Routes>
  );
};

export default App;
