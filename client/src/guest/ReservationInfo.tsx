import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestNavBar from '../components/GuestNavBar';
import Stepper from '../components/Stepper';
import supabase from '../supabaseClient';

const ReservationInfo: React.FC = () => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [paxAdult, setPaxAdult] = useState('');
    const [paxChildren, setPaxChildren] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
  if (checkIn && checkOut && paxAdult && paxChildren) {
    try {
      console.log({ checkIn, checkOut, paxAdult, paxChildren });

      const { data, error: userDataError } = await supabase.auth.getUser();
  
      if (userDataError) {
        console.error('Error fetching user data:', userDataError);
        alert('Error fetching user data.');
        return;
      }
  
      const user = data?.user;
     
      const checkInDate = new Date(checkIn).toISOString();
      const checkOutDate = new Date(checkOut).toISOString();

      const { data: reservedRooms, error: reservationError } = await supabase
        .from('reservation')
        .select('room_id')
        .lte('check_in_date', checkInDate)
        .gte('check_out_date', checkOutDate);

      if (reservationError) {
        console.error('Error fetching reserved rooms:', reservationError);
        alert('Error fetching reserved rooms. Please try again later.');
        return;
      }

      const reservedRoomIds = reservedRooms.map((room) => room.room_id);

      let availableRoomsQuery = supabase
        .from('room')
        .select('*')
        .eq('room_status', 'available');

      if (reservedRoomIds.length > 0) {
        availableRoomsQuery = availableRoomsQuery.not('room_id', 'in', reservedRoomIds);
      }

      const { data: availableRooms, error: roomError } = await availableRoomsQuery;

      if (roomError) {
        console.error('Error fetching available rooms:', roomError);
        alert('Error fetching available rooms. Please try again later.');
        return;
      }

      if (availableRooms.length === 0) {
        alert('No available rooms found for the selected dates.');
        return;
      }

      const selectedRoom = availableRooms[0];

      const reservationData = {
        room_id: selectedRoom.room_id,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        pax_adult: parseInt(paxAdult),
        pax_child: parseInt(paxChildren),
        user_id: user.id,
        res_status: "pending",

      };

      const { data: reservationResult, error: saveError } = await supabase
        .from('reservation')
        .insert([reservationData])
        .select();

      if (saveError) {
        console.error('Error saving reservation:', saveError);
        alert('Error saving the reservation. Please try again.');
        console.log(reservationData)
        return;
      }

      //get res_id
      const res_id = reservationResult?.[0]?.res_id;

      if(!res_id) {
        alert('Could not retrieve reservation ID.');
        return;
      }

      console.log('Reservation saved:', reservationResult);
      alert('Rooms are available!');
      navigate('/guest/book-room', {
        state: {
            res_id,
            checkInDate,
            checkOutDate,
            paxAdult,
        }
      });

    } catch (err) {
      console.error('Unexpected Error:', err);
      alert('An unexpected error occurred. Please check the console logs.');
    }
  } else {
    alert('Please fill in all fields before proceeding.');
  }
};

    

    return (
        <div className="bg-slate-100 h-screen relative">
            <GuestNavBar />
            <Stepper />
            <div className="flex justify-center items-start h-screen pt-20">
                <div className="bg-white p-6 w-1/2 shadow-md rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 text-left">
                                Check-In
                            </label>
                            <input
                                type="date"
                                id="check-in"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 text-center"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 text-left">
                                Check-Out
                            </label>
                            <input
                                type="date"
                                id="check-out"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 text-center"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="pax" className="block text-sm font-medium text-gray-700 text-left">
                                Number of Guests
                            </label>
                            <input
                                type="number"
                                id="Pax-adult"
                                value={paxAdult}
                                onChange={(e) => setPaxAdult(e.target.value)}
                                placeholder="Adult"
                                className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4"
                            />
                        </div>
                        <div className="flex flex-col">
                            <input
                                type="number"
                                id="Pax-children"
                                value={paxChildren}
                                onChange={(e) => setPaxChildren(e.target.value)}
                                className="mt-6 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4"
                                placeholder="Children"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button onClick={handleSearch} className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationInfo;
