// src/pages/Guests.tsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../../supabaseClient'; // Adjust the path to your Supabase client setup

const GuestsInfoTable = () => {
  const navigate = useNavigate();
  const location = useLocation();

  interface Guest {
    id: string;
    formData: {
      lastName: string;
      firstName: string;
      email: string;
      contactNumber: string;
      address: string;
      country: string;
      notesandRequests?: string;
    };
    shuttleService: boolean;
    arrivalDate: string | null;
    arrivalTime: string | null;
  }

  interface Payment {
    cardName: string;
    cardNumber: string;
    expDateMonth: string;
    expDateYear: string;
    securityCode: string;
  }

  const handleShuttleServiceChange = (guestID: string) => {
    setGuests((prevGuests) =>
      prevGuests.map((guest) =>
        guest.id === guestID
          ? { ...guest, shuttleService: !guest.shuttleService }
          : guest
      )
    );
  };

  
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-xl font-semibold text-black dark:text-white py-3 px-3">
        Guest Information
      </h3>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-left text-sm">
            <th className="py-2 px-3 border-b">Last Name</th>
            <th className="py-2 px-3 border-b">First Name</th>
            <th className="py-2 px-3 border-b">Email</th>
            <th className="py-2 px-3 border-b">Contact No</th>
            <th className="py-2 px-3 border-b">Address</th>
            <th className="py-2 px-3 border-b">Shuttle Service</th>
            <th className="py-2 px-3 border-b">Arrival Date</th>
            <th className="py-2 px-3 border-b">Arrival Time</th>
            <th className="py-2 px-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
            <tr className="border-b text-sm">
              <td className="py-2 px-3">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleGuestChange(e, guest.id)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-3">
                <input
                  type="text"
                  name="firstName"
                  value={guest.formData.firstName}
                  onChange={(e) => handleGuestChange(e, guest.id)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-3">
                <input
                  type="email"
                  name="email"
                  value={guest.formData.email}
                  onChange={(e) => handleGuestChange(e, guest.id)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-3">
                <input
                  type="text"
                  name="contactNumber"
                  value={guest.formData.contactNumber}
                  onChange={(e) => handleGuestChange(e, guest.id)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-3">
                <input
                  type="text"
                  name="address"
                  value={guest.formData.address}
                  onChange={(e) => handleGuestChange(e, guest.id)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-3">
                <input
                  type="checkbox"
                  checked={guest.shuttleService}
                  onChange={() => handleShuttleServiceChange(guest.id)}
                />
              </td>
              <td className="py-2 px-3">
                <input
                  type="date"
                  value={guest.arrivalDate || ''}
                  onChange={(e) =>
                    setGuests((prevGuests) =>
                      prevGuests.map((g) =>
                        g.id === guest.id
                          ? { ...g, arrivalDate: e.target.value }
                          : g
                      )
                    )
                  }
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-3">
                <input
                  type="time"
                  value={guest.arrivalTime || ''}
                  onChange={(e) =>
                    setGuests((prevGuests) =>
                      prevGuests.map((g) =>
                        g.id === guest.id
                          ? { ...g, arrivalTime: e.target.value }
                          : g
                      )
                    )
                  }
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-3">
                <button
                  onClick={() => removeGuest(guest.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addGuest}
        className="mt-3 bg-blue-500 text-white px-3 py-2 rounded shadow hover:bg-blue-600"
      >
        Add Guest
      </button>
    </div>
  );
};

export default GuestsInfoTable;
