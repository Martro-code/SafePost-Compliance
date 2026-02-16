import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './SignUp';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default App;
