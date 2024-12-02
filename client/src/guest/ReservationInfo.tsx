import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestNavBar from '../components/GuestNavBar';
import Stepper from '../components/Stepper';
import { supabase } from '../supabaseClient';

const ReservationInfo = ({ supabase }) => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [paxAdult, setPaxAdult] = useState('');
    const [paxChildren, setPaxChildren] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (checkIn && checkOut && paxAdult && paxChildren) {
            try {
                // Log the input values for debugging
                console.log({ checkIn, checkOut, paxAdult, paxChildren });
    
                // Convert the check-in and check-out dates to valid timestamp format (if not already in the correct format)
                const checkInDate = new Date(checkIn).toISOString();
                const checkOutDate = new Date(checkOut).toISOString();
    
                // Insert reservation data into Supabase
                const { data: insertData, error: insertError } = await supabase
                    .from('reservation')
                    .insert([
                        {
                            res_checkin: checkInDate,
                            res_checkout: checkOutDate,
                            res_paxadult: parseInt(paxAdult, 10),
                            res_paxchild: parseInt(paxChildren, 10)
                        }
                    ], {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
    
                if (insertError) {
                    console.error('Insert Error:', insertError);
                    alert('Failed to save reservation. Please check the logs.');
                    return;
                }
    
                console.log('Data inserted successfully:', insertData);
    
                // Verify if the data is stored in the database
                const { data: verifyData, error: verifyError } = await supabase
                    .from('reservation')
                    .select('*')
                    .eq('res_checkin', checkInDate)
                    .eq('res_checkout', checkOutDate);
    
                if (verifyError) {
                    console.error('Error verifying data:', verifyError);
                    alert('Error verifying reservation. Please try again.');
                } else if (verifyData.length > 0) {
                    console.log('Data successfully verified:', verifyData);
                    alert('Reservation saved successfully!');
                    navigate('/book-room');
                } else {
                    console.log('Inserted data not found in database.');
                    alert('Something went wrong. Please try again.');
                }
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
    
}

export default ReservationInfo;