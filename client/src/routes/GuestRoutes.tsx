import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ReservationInfo from '../guest/ReservationInfo';
import BookaRoom from '../guest/BookaRoom';
import PaymentInfo from '../guest/PaymentInfo';
import Receipt from '../guest/Receipt';

const GuestRoutes: React.FC = () => {
  
  return (
    <Routes>
      <Route path="/reservation-info" element={<ReservationInfo />} />
      <Route path="/book-room" element={<BookaRoom />} />
      <Route path="/payment-info" element={<PaymentInfo />} />
      <Route path="/receipt" element={<Receipt />} />
    </Routes>
  );
};

export default GuestRoutes;
