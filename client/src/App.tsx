import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignUp from './employee/authentication/SignUp';
import SignIn from './employee/authentication/SignIn';
import ReservationInfo from './guest/ReservationInfo';

import './App.css';

const App: React.FC = () => {
  return (
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<ReservationInfo />} />

            
          </Routes>
  );
};

export default App;