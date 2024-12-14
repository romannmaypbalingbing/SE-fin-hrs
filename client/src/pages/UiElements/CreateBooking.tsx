import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from "../../supabaseClient"

const GuestInfoForm = () => {
  const navigate = useNavigate();

  const [guest, setGuest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    country: '',
    notesAndRequests: '',
    shuttleService: false,
    arrivalDate: '',
    arrivalTime: '',
  });

  const [payment, setPayment] = useState({
    cardName: '',
    cardNumber: '',
    expDateMonth: '',
    expDateYear: '',
    securityCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const countryList = ["USA", "Canada", "Philippines", "Australia", "Japan"];

  const insertGuest = async () => {
    const { error } = await supabase.from('guests_info').insert([
      {
        guest_firstname: guest.firstName,
        guest_lastname: guest.lastName,
        guest_email: guest.email,
        guest_contactno: guest.contactNumber,
        guest_address: guest.address,
        guest_country: guest.country,
        guest_requests: guest.notesAndRequests || '',
        res_id: res_id,
        isReservor: 1,
      },
    ]);

    return !error;
  };

  const insertPayment = async () => {
    const { error } = await supabase.from('payment').insert([
      {
        res_id: res_id,
        card_name: payment.cardName,
        card_number: payment.cardNumber,
        exp_date_month: payment.expDateMonth,
        exp_date_year: payment.expDateYear,
        sec_Code: payment.securityCode,
        payment_method: paymentMethod,
      },
    ]);

    return !error;
  };

  const insertShuttleService = async () => {
    if (guest.shuttleService) {
      const { error } = await supabase.from('reservation').insert([
        {
          shuttle_service: guest.shuttleService,
          shuttle_date: guest.arrivalDate,
          shuttle_time: guest.arrivalTime,
        },
      ]);
      return !error;
    }

    return true;
  };

  const submitGuestInfo = async () => {
    try {
      const success =
        (await insertGuest()) &&
        (await insertPayment()) &&
        (await insertShuttleService());

      if (success) {
        navigate('/guest/receipt');
      } else {
        alert('An error occurred while submitting the information.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Add New Booking</h1>
        <div className="flex space-x-4">
          <button className="btn-secondary">Reset</button>
          <button className="btn-secondary">Close</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Content */}
        <div className="col-span-2 space-y-6">
          {/* Room Details */}
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Room Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <input type="date" className="input" placeholder="Check In" />
              <input type="number" className="input" placeholder="Duration (Nights)" />
              <input type="date" className="input" placeholder="Check Out" />
              <select className="input" placeholder="Room Type">
                <option value="deluxe">Deluxe Suites</option>
                <option value="standard">Standard Room</option>
              </select>
              <select className="input" placeholder="Room Plan">
                <option value="extra">Extra Bed</option>
              </select>
              <input type="text" className="input" placeholder="Room #" />
            </div>
          </div>

          {/* Guest Details */}
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Guest Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" className="input" placeholder="Full Name" />
              <input type="email" className="input" placeholder="Email" />
              <input type="tel" className="input" placeholder="Phone Number" />
              <input type="text" className="input" placeholder="Address" />
              <input type="text" className="input" placeholder="Country" />
              <textarea className="input col-span-2" placeholder="Guest Comment/Request"></textarea>
            </div>
          </div>

          {/* Extras */}
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Extras</h2>
            <div className="grid grid-cols-3 gap-4">
              {['Breakfast', 'Lunch', 'Dinner', 'Spa', 'Laundry', 'Bike Rent', 'Car Rent', 'Local Guide'].map((extra) => (
                <label key={extra} className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>{extra}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-4">
              <select className="input">
                <option value="debit">Debit Card</option>
                <option value="credit">Credit Card</option>
              </select>
              <input type="text" className="input" placeholder="Bank" />
              <input type="text" className="input" placeholder="Card Number" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 bg-gray-50 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
          <div className="space-y-2">
            <p>Room Total: <span className="float-right">$</span></p>
            <p>Extras: <span className="float-right">$</span></p>
            <p>Discount: <span className="float-right">- $</span></p>
            <p className="font-semibold">Total: <span className="float-right text-red-500">$</span></p>
          </div>
          <div className="mt-4">
            <input type="text" className="input" placeholder="Coupon Code" />
            <button className="btn-primary w-full mt-2">Apply</button>
          </div>
          <button className="btn-primary w-full mt-6">Book Room</button>
        </div>
      </div>
    </div>
  );
};



export default GuestInfoForm;
