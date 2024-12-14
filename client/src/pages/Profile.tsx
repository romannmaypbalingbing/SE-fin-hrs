// src/pages/Guests.tsx
import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Adjust the path to your Supabase client setup

interface GuestInfo {
  guest_lastname: string;
  guest_firstname: string;
  guest_email: string;
  guest_contactno: string;
  guest_address: string;
  guest_country: string;
  guest_requests: string;
  guests_id: string;
  res_id: string;
  isReservor: boolean;
}

const GuestsInfoTable: React.FC = () => {
  const [guests, setGuests] = useState<GuestInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuestsInfo = async () => {
      const { data, error } = await supabase.from('guests_info').select('*');
      if (error) {
        console.error('Error fetching guest info:', error);
        setError('Error fetching guest information');
      } else {
        setGuests((data as GuestInfo[]).filter((guest) => guest.isReservor));
      }
    };

    fetchGuestsInfo();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (guests.length === 0) {
    return <p className="text-gray-500">No guest information available.</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-xl font-semibold text-black dark:text-white py-3 px-3">Guest Information</h3>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-left text-sm">
            <th className="py-2 px-3 border-b">Last Name</th>
            <th className="py-2 px-3 border-b">First Name</th>
            <th className="py-2 px-3 border-b">Email</th>
            <th className="py-2 px-3 border-b">Contact No</th>
            <th className="py-2 px-3 border-b">Address</th>
            <th className="py-2 px-3 border-b">Reservation ID</th>
            <th className="py-2 px-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.guests_id} className="border-b text-sm">
              <td className="py-2 px-3">{guest.guest_lastname}</td>
              <td className="py-2 px-3">{guest.guest_firstname}</td>
              <td className="py-2 px-3">{guest.guest_email}</td>
              <td className="py-2 px-3">{guest.guest_contactno}</td>
              <td className="py-2 px-3">{guest.guest_address}</td> 
              <td className="py-2 px-3">{guest.res_id}</td>
              <td className="py-2 px-3">
                <button className="text-blue-500 text-xs hover:underline">View More</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestsInfoTable;
