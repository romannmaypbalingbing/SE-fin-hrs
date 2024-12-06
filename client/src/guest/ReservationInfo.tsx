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
    
                const checkInDate = new Date(checkIn).toISOString();
                const checkOutDate = new Date(checkOut).toISOString();
                const requiredRooms = parseInt(paxAdult, 10); // Number of rooms needed
    
                // Step 1: Check for available rooms
                const { data: reservedRooms, error: reservationError } = await supabase
                    .from('reservation')
                    .select('room_id')
                    .or(`
                        check_in_date.lt.${checkOutDate},check_out_date.gt.${checkInDate}
                    `); // Fetch reservations overlapping the specified dates
    
                if (reservationError) {
                    console.error('Reservation Check Error:', reservationError);
                    alert('Failed to check room availability. Please try again.');
                    return;
                }
    
                const reservedRoomIds = reservedRooms.map(reservation => reservation.room_id);
    
                const { data: availableRooms, error: roomError } = await supabase
                    .from('rooms')
                    .select('id, capacity')
                    .not('id', 'in', reservedRoomIds); // Fetch rooms not reserved
    
                if (roomError) {
                    console.error('Room Availability Check Error:', roomError);
                    alert('Failed to check room availability. Please try again.');
                    return;
                }
    
                if (!availableRooms || availableRooms.length < requiredRooms) {
                    alert(
                        `Not enough rooms available for ${requiredRooms} adults. Only ${availableRooms.length} rooms are available.`
                    );
                    return;
                }
    
                // Log the available rooms for debugging
                console.log('Available rooms:', availableRooms);
    
                // Step 2: Insert the reservation
                const { data: insertData, error: insertError } = await supabase
                    .from('reservation')
                    .insert([
                        {
                            check_in_date: checkInDate,
                            check_out_date: checkOutDate,
                            pax_adult: parseInt(paxAdult, 10),
                            pax_child: parseInt(paxChildren, 10),
                        },
                    ]);
    
                if (insertError) {
                    console.error('Insert Error:', insertError);
                    alert('Failed to save reservation. Please check the logs.');
                    return;
                }
    
                console.log('Data inserted successfully:', insertData);
                alert('Reservation saved successfully!');
                navigate('/book-room');
            } catch (err) {
                console.error('Unexpected Error:', err);
                alert('An unexpected error occurred. Check console logs.');
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
