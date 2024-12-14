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

      //fetch user data if authenticated
      const { data, error: userDataError } = await supabase.auth.getUser();
  
      if (userDataError) {
        console.error('Error fetching user data:', userDataError);
      }
  
      const user = data?.user;
     
      const checkInDate = new Date(checkIn).toISOString().split('T')[0];
      const checkOutDate = new Date(checkOut).toISOString().split('T')[0];

      // Ensure check-in is before check-out
      if (new Date(checkIn) >= new Date(checkOut)) {
        alert('Check-out date must be after check-in date.');
        return;
      }

      //check for reserved rooms for the selected dates
      const { data: reservedRooms, error: reservationError } = await supabase
      .from('reserved_room')
      .select(`
        room_id,
        reservation (
          check_in_date,
          check_out_date
        )
      `)
      .filter('reservation.check_in_date', 'lte', checkOutDate)
      .filter('reservation.check_out_date', 'gte', checkInDate);


      if (reservationError) {
        console.error('Error fetching reserved rooms:', reservationError);
        alert('Error fetching reserved rooms. Please try again later.');
        return;
      }

      console.log('Reserved Rooms:', reservedRooms);

      if (reservedRooms.length === 0) {
        // No reservations exist
        alert('No reservations exist for the selected dates.');
      }

      // Fetch available rooms
      const reservedRoomIds = reservedRooms.map((room) => room.room_id);
      let availableRoomsQuery = supabase
        .from('room')
        .select('*')
        .eq('room_status', 'available');

      if (reservedRoomIds.length > 0) {
        const formattedIds = `(${reservedRoomIds.join(',')})`;
        availableRoomsQuery = availableRoomsQuery.not('room_id', 'in', formattedIds);
      }

      console.log('Reserved Room IDs:', reservedRoomIds);
      console.log('Reserved Room IDs:', availableRoomsQuery);

      const { data: availableRooms, error: roomError } = await availableRoomsQuery;
      if (roomError) {
        console.error('Error fetching available rooms:', roomError);
        alert('Error fetching available rooms. Please try again later.');
        return;
      }

      if (availableRooms.length === 0) {
        if (reservedRooms.length > 0) {
          // Reserved rooms exist but no available rooms
          alert('All rooms are fully booked for the selected dates.');
        } else {
          // No reservations and no available rooms (edge case)
          alert('No rooms are available, but no reservations were found. Please contact support.');
        }
        return;
      }

      // Proceed with reservation
      const selectedRoom = availableRooms[0];
      const reservationData = {
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        pax_adult: parseInt(paxAdult),
        pax_child: parseInt(paxChildren),
        user_id: user?.id,
        res_status: "pending",
      };
      console.log('Selected Room:', selectedRoom);
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
