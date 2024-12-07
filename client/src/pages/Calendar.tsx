import React, { useState } from 'react';

const AddNewBooking = () => {
  const [formData, setFormData] = useState({
    checkIn: '',
    duration: '',
    checkOut: '',
    roomType: '',
    roomPlan: '',
    roomNumber: '',
    guestDetails: {
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      country: '',
      comment: '',
    },
    extras: {
      breakfast: false,
      lunch: false,
      dinner: false,
      spa: false,
      laundry: false,
      bikeRent: false,
      carRent: false,
      localGuide: false,
    },
    payment: {
      paymentType: '',
      bank: '',
      cardNumber: '',
    },
    couponCode: '',
  });

  interface GuestDetails {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    country: string;
    comment: string;
  }

  interface Extras {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    spa: boolean;
    laundry: boolean;
    bikeRent: boolean;
    carRent: boolean;
    localGuide: boolean;
  }

  interface Payment {
    paymentType: string;
    bank: string;
    cardNumber: string;
  }

  interface FormData {
    checkIn: string;
    duration: string;
    checkOut: string;
    roomType: string;
    roomPlan: string;
    roomNumber: string;
    guestDetails: GuestDetails;
    extras: Extras;
    payment: Payment;
    couponCode: string;
  }

  const handleInputChange = (section: keyof FormData, key: string, value: string | boolean) => {
    setFormData((prev) => {
      if (section === 'guestDetails' || section === 'extras' || section === 'payment') {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: value,
          },
        };
      } else {
        return {
          ...prev,
          [section]: value,
        };
      }
    });
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
              <select className="input">
                <option value="deluxe">Deluxe King</option>
                <option value="standard">Deluxe King Mayon View</option>
                <option value="standard">Deluxe Twin</option>
                <option value="standard">Deluxe Twin Mayon View</option>
                <option value="standard">Family Suite</option>
                <option value="standard">Marison Suite</option>
                <option value="standard">Premiere Suite</option>
                <option value="standard">Premiere Suite Queen</option>
                <option value="standard">Specialty Deluxe</option>
              </select>
              <select className="input">
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
                <option value="debit">Visa Card</option>
                <option value="credit">PayPal</option>
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
            <p>Room Total: <span className="float-right">PHP</span></p>
            <p>Extras: <span className="float-right">PHP</span></p>
            <p>Discount: <span className="float-right">- PHP</span></p>
            <p className="font-semibold">Total: <span className="float-right text-red-500">PHP</span></p>
          </div>
          <div className="mt-4">
            <input type="text" className="input mb-2 bg-slate-200 w-full py-1.5 px-2" placeholder="Coupon Code" />
            <button className=" py-2 btn-primary w-1/2 mt-2 bg-black text-white rounded-sm">Apply</button>
          </div>
          <button className="py-2 btn-primary w-full mt-6 bg-red-800 text-white rounded-sm">Book Room</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewBooking;
