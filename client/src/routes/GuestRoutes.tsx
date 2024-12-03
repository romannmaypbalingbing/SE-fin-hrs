import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignUp from '../employee/authentication/SignUp';
import SignIn from '../employee/authentication/SignIn';
import ReservationInfo from '../guest/ReservationInfo';
import BookaRoom from '../guest/BookaRoom';
import PaymentInfo from '../guest/PaymentInfo';
import Receipt from '../guest/Receipt';


const App: React.FC = () => {
  return (
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<ReservationInfo />} />
            <Route path="/book-room" element={<BookaRoom />} />
            <Route path="/payment-info" element={<PaymentInfo />} />
            <Route path="/receipt" element={<Receipt />} />
          </Routes>
  );
};

export default App;