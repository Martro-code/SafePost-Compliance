import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './SignUp';
import Login from './Login';
import PricingMedicalPractitioners from './PricingMedicalPractitioners';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing/medical-practitioners" element={<PricingMedicalPractitioners />} />
    </Routes>
  );
};

export default App;
