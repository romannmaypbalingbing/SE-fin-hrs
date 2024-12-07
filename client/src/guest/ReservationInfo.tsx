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
    
                // Convert dates to ISO format
                const checkInDate = new Date(checkIn).toISOString();
                const checkOutDate = new Date(checkOut).toISOString();
    
                // Step 1: Get reserved room IDs for the specified date range
                const { data: reservedRooms, error: reservationError } = await supabase
                    .from('reservation')
                    .select('room_id')
                    .lte('check_in_date', checkOutDate) // Check for overlaps
                    .gte('check_out_date', checkInDate);
    
                if (reservationError) {
                    console.error('Error fetching reserved rooms:', reservationError);
                    alert('Error fetching reserved rooms. Please try again later.');
                    return;
                }
    
                // Extract room IDs of reserved rooms
                const reservedRoomIds = reservedRooms.map((room) => room.room_id);
    
                // Step 2: Fetch available rooms
                let availableRoomsQuery = supabase
                    .from('room')
                    .select('*')
                    .eq('room_status', 'available');
    
                if (reservedRoomIds.length > 0) {
                    // If there are reserved rooms, exclude them
                    availableRoomsQuery = availableRoomsQuery.not('room_id', 'in', reservedRoomIds);
                }
    
                const { data: availableRooms, error: roomError } = await availableRoomsQuery;
    
                if (roomError) {
                    console.error('Error fetching available rooms:', roomError);
                    alert('Error fetching available rooms. Please try again later.');
                    return;
                }
    
                // Log available rooms and handle the results
                console.log('Available Rooms:', availableRooms);
    
                if (availableRooms.length === 0) {
                    alert('No available rooms found for the selected dates.');
                    return;
                }
    
                // Step 3: Proceed with reservation or navigation
                alert('Rooms are available!');
                navigate('/guest/book-room'); 
    
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
