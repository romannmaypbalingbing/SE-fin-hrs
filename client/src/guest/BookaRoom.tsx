import React, { useEffect, useState } from 'react';
import GuestNavBar from '../components/GuestNavBar';
import Stepper from '../components/Stepper';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

interface RoomDetails{
    roomtype_id: number;
    roomtype_name: string;
    roomtype_price: number;
    roomtype_capacity: string;    
    roomtype_totalrooms: number;
}

const BookaRoom: React.FC = () => {
    const [roomDetailsList, setRoomDetailsList] = useState<RoomDetails[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<RoomDetails | null>(null);
    const [stayDuration, setStayDuration] = useState<number>(0);
    const navigate = useNavigate();

    //fetch room details to display data from the database
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('room_type')
                    .select('*')
                    console.log(data);
                    

                if(error){
                    console.error('Error fetching room details:', error);
                } else if (data){
                    console.log('Fetched room details:', data);
                    setRoomDetailsList(data as RoomDetails[]);  //set the data to the roomDetailsList
                } else {
                    console.error('No data returned.');
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        fetchRoomDetails();
    }, []);

    // const handleShowMore = () => {
    // }

    const computeStayDuration = async (reservationID: number) => {
        try {
            const { data, error } = await supabase
                .from('reservation')
                .select('check_in_date, check_out_date')
                .eq('reservation_id', reservationID)
                
                if (data && data.length > 0) {
                    const checkIn = new Date(data[0].check_in_date);
                    const checkOut = new Date(data[0].check_out_date);
                    const duration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                    setStayDuration(duration);
                }

            if (error) {
                console.error('Error fetching reservation details:', error);
                return;
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };
        
        //handleBookNow function to handle the selected room and display to summary
    const handleBookNow = (room: RoomDetails, reservationID: number) => {
        setSelectedRoom(room);
        computeStayDuration(reservationID);
    };

    // Proceed to payment
    const handleProceedToPayment = () => {
        if (selectedRoom) {
            navigate('/payment-info');
        } else {
            alert('Please select a room to proceed to payment.');
        }
    };

    return (
        <div className="bg-slate-100 w-full"> {/* Set background to slate-100 */}
            <GuestNavBar />
            <Stepper />

            {/* This is the FormLayout component */}
            <div className="grid grid-cols-3 gap-4 p-5">
                {/* Left section: Room details */}
                {roomDetailsList[0] && (
                    <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                        {/* Room Container */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white flex justify-center items-center">
                                <div className="flex flex-col">
                                    {/* Title */}
                                    <h2 className="text-2xl font-semibold text-red-800 text-left px-1 ">
                                        {roomDetailsList[0].roomtype_name}
                                    </h2>

                                    {/* Room Image */}
                                    <a href="/book-a-room" className="text-xl font-bold text-slate-600 text-left">
                                        <img
                                            src="/room_assets/MH-DELUXE-MODAL-KING.jpg"
                                            alt="Deluxe Room with King Bed"
                                            className="w-[500px] h-[200px] rounded-lg object-contain"
                                        />
                                    </a>

                                    {/* Room Capacity */}
                                    <div className="flex items-center text-left mb-2">
                                        <p className="text-base font-medium text-slate-600 ml-2 px-1">2 Adults | 2 Children</p>
                                    </div>

                                    {/* Room Details */}
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256" className="mr-3">
                                            <path fill="#9f1239" d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"></path>
                                        </svg>
                                        25 ㎡ | Floor: 2, 3
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-3">
                                            <path fill="#9f1239" d="M3 18v-5q0-.444.256-.946T4 11.3V9q0-.846.577-1.423T6 7h4.5q.517 0 .883.213q.365.212.617.587q.252-.375.617-.587Q12.983 7 13.5 7H18q.846 0 1.423.577T20 9v2.3q.489.252.744.754q.256.502.256.946v5h-1v-2H4v2zm9.5-7H19V9q0-.425-.288-.712T18 8h-4.5q-.425 0-.712.288T12.5 9zM5 11h6.5V9q0-.425-.288-.712T10.5 8H6q-.425 0-.712.288T5 9zm-1 4h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z"></path>
                                        </svg>
                                        1 King Bed
                                    </p>
                                </div>
                            </div>

                            {/* Price and Features */}
                            <div className="col-span-2 bg-white p-6 shadow-md rounded-base text-left">
                                <span className="text-3xl font-bold text-slate-700 text-left">PHP {roomDetailsList[0].roomtype_price} </span> 
                                <span className="text-2xl font-semibold text-slate-400">/night</span>
                                <div className="flex flex-col mt-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-2">
                                                <path fill="#9f1239" d="M8.1 13.34L3.91 9.16a4.01 4.01 0 0 1 0-5.66l7.02 7zm5.31-.34l6.88 6.88l-1.41 1.41L12 14.41l-6.88 6.88l-1.41-1.41l9.65-9.66l-.2-.22a1.98 1.98 0 0 1 0-2.81l4.34-4.37l.93.92L15.19 7l.96.94l3.24-3.25l.92.92l-3.25 3.24l.94.96l3.26-3.25l.92.94l-4.37 4.34c-.78.78-2.04.78-2.81 0l-.22-.2z"></path>
                                            </svg>
                                            Breakfast included
                                        </p>
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" className="mr-2">
                                                <path fill="#9f1239" d="M14 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H17v11.5a.5.5 0 0 1-1 0V7h-1.5a.5.5 0 0 1-.5-.5zM13 3H6.14a2.5 2.5 0 0 0-2.452 2.01L3.49 6h-.74a.75.75 0 0 0 0 1.5h.44l-.111.56A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H4v1a1 1 0 1 0 2 0v-1h8v1a1 1 0 0 0 1 1v-3H3.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H15V8H4.11l.559-2.794A1.5 1.5 0 0 1 6.139 4H13zm2 9a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-8 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0"></path>
                                            </svg>
                                            Free parking
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"  className="mr-2">
                                                <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                                                    <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4a.6.6 0 0 1 .6-.6zm-5 7l1 2m-9-2l-1 2m14-9V7a4 4 0 0 0-4-4h-5"></path>
                                                    <path d="M15.4 8H8.6c-.331 0-.596-.268-.56-.598C8.186 6.075 8.863 3 12 3s3.814 3.075 3.96 4.402c.036.33-.229.598-.56.598"></path>
                                                </g>
                                            </svg>
                                            Ensuite bathroom
                                        </p>
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32" className="mr-2">
                                                <path fill="#9f1239" d="M5 5C3.355 5 2 6.355 2 8v17h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h7.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H31V14.562a3.03 3.03 0 0 0-.469-1.593l-4.093-6.563A2.98 2.98 0 0 0 23.905 5zm0 2h5v6H4V8c0-.563.438-1 1-1m7 0h6v6h-6zm8 0h3.906c.348 0 .66.176.844.469L28.188 13H20zM4 15h25v2h-3v2h3v4h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3h-7.312c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4zm5 7c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m15 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2"></path>
                                            </svg>
                                            Free shuttle service
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="mr-2">
                                                <path fill="#9f1239" d="M12 20.423q-.646 0-1.092-.446t-.446-1.092t.446-1.093T12 17.346t1.092.446t.446 1.092t-.446 1.093t-1.092.446M6.35 15.35l-1.023-1.034q1.302-1.302 3.004-2.04t3.672-.737t3.669.74t3.001 2.048L17.65 15.35q-1.1-1.1-2.55-1.725T12 13t-3.1.625t-2.55 1.725M2.1 11.1l-1.023-1.023q2.089-2.1 4.875-3.32T12 5.54t6.048 1.219t4.875 3.319L21.9 11.1q-1.925-1.925-4.462-3.012T12 7T6.563 8.088T2.1 11.1"></path>
                                            </svg>
                                            Wi-Fi access
                                        </p>
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 14 14" className="mr-2">
                                                <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12.5.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"></path>
                                                    <path d="M11 7.5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2m-.5 5h.1A1.4 1.4 0 0 0 4 11.1V10m7.5 2.5h-.1a1.4 1.4 0 0 1-1.4-1.4V10m-3 3.5V10"></path>
                                                </g>
                                            </svg>
                                            Air conditioning
                                        </p>

                                        <div className="col-span-3 mt-20 flex items-center justify-between">
                                            <a className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-slate-500 text-sm font-semibold">Show more</span>
                                            </a>

                                            <button
                                                className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => reservationID && handleBookNow(roomDetailsList[0], reservationID)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                 {/* Right section: Summary */}
                 <div className="bg-white p-4 shadow-md rounded-lg h-full self-start">
                    <h2 className="text-xl font-semibold text-slate-800 mb-2 mt-3 px-2">Selected Rooms</h2>
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-5 shadow-md rounded-lg">
                        {/* Summary details */}
                        <div className="data py-3 border-b border-gray-200">
                            <div className="flex justify-between items-start gap-4 mb-5">
                            {/* Room Type Name */}
                            <div className="flex flex-col">
                                <p className="font-medium text-medium leading-8 text-slate-700 text-left">
                                {selectedRoom?.roomtype_name}
                                </p>
                                {/* Number of Nights */}
                                <p className="text-sm text-gray-500">
                                    {stayDuration} {stayDuration > 1 ? 'nights' : 'night'}
                                </p>
                            </div>
                            {/* Price */}
                            <p className="text-xl font-semibold text-slate-800">
                                {selectedRoom?.roomtype_price}
                            </p>
                            </div>
                        </div>
                        
                        </div>
                        <button className="mt-4 px-4 py-2 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800">
                        Proceed to Payment
                        </button>
                    </div>
                    </div>

                
                

                {/* 2nd */}
                {roomDetailsList[1] && (
                    <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                    
                        {/* Room Container */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white flex justify-center items-center">
                                <div className="flex flex-col">
                                    {/* Title */}
                                    <h2 className="text-2xl font-semibold text-red-700 text-left mb-2 px-3">Deluxe King Mayon View</h2>

                                    {/* Room Image */}
                                    <a href="/book-a-room" className="text-xl font-bold text-slate-600 text-left">
                                        <img
                                            src="/room_assets/MH-DELUXE-MODAL-MAYON-VIEW.jpg"
                                            alt="Deluxe Room with King Bed"
                                            className="w-[500px] h-[200px] rounded-lg object-contain"
                                        />
                                    </a>

                                    {/* Room Capacity */}
                                    <div className="flex items-center text-left mb-2">
                                        <p className="text-base font-medium text-slate-600 px-1 ml-2 mt-2">2 Adults | 2 Children</p>
                                        {/* <p className="text-sm text-slate-400">(12 years old and below)</p> */}
                                    </div>

                                    {/* Room Details */}
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256" className="mr-3">
                                            <path fill="#9f1239" d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"></path>
                                        </svg>
                                        25 ㎡ | Floor: 2, 3
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-3">
                                            <path fill="#9f1239" d="M3 18v-5q0-.444.256-.946T4 11.3V9q0-.846.577-1.423T6 7h4.5q.517 0 .883.213q.365.212.617.587q.252-.375.617-.587Q12.983 7 13.5 7H18q.846 0 1.423.577T20 9v2.3q.489.252.744.754q.256.502.256.946v5h-1v-2H4v2zm9.5-7H19V9q0-.425-.288-.712T18 8h-4.5q-.425 0-.712.288T12.5 9zM5 11h6.5V9q0-.425-.288-.712T10.5 8H6q-.425 0-.712.288T5 9zm-1 4h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z"></path>
                                        </svg>
                                        1 King Bed
                                    </p>
                                </div>
                            </div>

                            {/* Price and Features */}
                            <div className="col-span-2 bg-white p-6 shadow-md rounded-base text-left">
                                <span className="text-3xl font-bold text-slate-700 text-left">PHP 4,900 </span>
                                <span className="text-2xl font-semibold text-slate-400">/night</span>
                                <div className="flex flex-col mt-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-2">
                                                <path fill="#9f1239" d="M8.1 13.34L3.91 9.16a4.01 4.01 0 0 1 0-5.66l7.02 7zm5.31-.34l6.88 6.88l-1.41 1.41L12 14.41l-6.88 6.88l-1.41-1.41l9.65-9.66l-.2-.22a1.98 1.98 0 0 1 0-2.81l4.34-4.37l.93.92L15.19 7l.96.94l3.24-3.25l.92.92l-3.25 3.24l.94.96l3.26-3.25l.92.94l-4.37 4.34c-.78.78-2.04.78-2.81 0l-.22-.2z"></path>
                                            </svg>
                                            Breakfast included
                                        </p>
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" className="mr-2">
                                                <path fill="#9f1239" d="M14 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H17v11.5a.5.5 0 0 1-1 0V7h-1.5a.5.5 0 0 1-.5-.5zM13 3H6.14a2.5 2.5 0 0 0-2.452 2.01L3.49 6h-.74a.75.75 0 0 0 0 1.5h.44l-.111.56A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H4v1a1 1 0 1 0 2 0v-1h8v1a1 1 0 0 0 1 1v-3H3.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H15V8H4.11l.559-2.794A1.5 1.5 0 0 1 6.139 4H13zm2 9a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-8 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0"></path>
                                            </svg>
                                            Free parking
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"  className="mr-2">
                                                <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                                                    <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4a.6.6 0 0 1 .6-.6zm-5 7l1 2m-9-2l-1 2m14-9V7a4 4 0 0 0-4-4h-5"></path>
                                                    <path d="M15.4 8H8.6c-.331 0-.596-.268-.56-.598C8.186 6.075 8.863 3 12 3s3.814 3.075 3.96 4.402c.036.33-.229.598-.56.598"></path>
                                                </g>
                                            </svg>
                                            Ensuite bathroom
                                        </p>
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32" className="mr-2">
                                                <path fill="#9f1239" d="M5 5C3.355 5 2 6.355 2 8v17h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h7.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H31V14.562a3.03 3.03 0 0 0-.469-1.593l-4.093-6.563A2.98 2.98 0 0 0 23.905 5zm0 2h5v6H4V8c0-.563.438-1 1-1m7 0h6v6h-6zm8 0h3.906c.348 0 .66.176.844.469L28.188 13H20zM4 15h25v2h-3v2h3v4h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3h-7.312c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4zm5 7c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m15 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2"></path>
                                            </svg>
                                            Free shuttle service
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="mr-2">
                                                <path fill="#9f1239" d="M12 20.423q-.646 0-1.092-.446t-.446-1.092t.446-1.093T12 17.346t1.092.446t.446 1.092t-.446 1.093t-1.092.446M6.35 15.35l-1.023-1.034q1.302-1.302 3.004-2.04t3.672-.737t3.669.74t3.001 2.048L17.65 15.35q-1.1-1.1-2.55-1.725T12 13t-3.1.625t-2.55 1.725M2.1 11.1l-1.023-1.023q2.089-2.1 4.875-3.32T12 5.54t6.048 1.219t4.875 3.319L21.9 11.1q-1.925-1.925-4.462-3.012T12 7T6.563 8.088T2.1 11.1"></path>
                                            </svg>
                                            Wi-Fi access
                                        </p>
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 14 14" className="mr-2">
                                                <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12.5.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"></path>
                                                    <path d="M11 7.5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2m-.5 5h.1A1.4 1.4 0 0 0 4 11.1V10m7.5 2.5h-.1a1.4 1.4 0 0 1-1.4-1.4V10m-3 3.5V10"></path>
                                                </g>
                                            </svg>
                                            Air conditioning
                                        </p>
                                        
                                        <div className="col-span-3 mt-20 flex items-center justify-between">
                                            <a className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-slate-500 text-sm font-semibold">Show more</span>
                                            </a>

                                            <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3rd */}
                {roomDetailsList[2] && (
                    <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                        {/* Room Container */}\
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white flex justify-center items-center">
                                <div className="flex flex-col">
                                    {/* Title */}
                                    <h2 className="text-2xl font-semibold text-red-700 text-left">Deluxe Twin</h2>

                                    {/* Room Image */}
                                    <a href="/book-a-room" className="text-xl font-bold text-slate-600 text-left">
                                        <img
                                            src="/room_assets/MH-DELUXE-MODAL-TWIN.jpg"
                                            alt="Deluxe Room with King Bed"
                                            className="w-[500px] h-[200px] rounded-lg object-contain"
                                        />
                                    </a>

                                    {/* Room Capacity */}
                                    <div className="flex items-center text-left mb-2">
                                        <p className="text-base font-medium text-slate-600 px-1 ml-2">2 Adults | 2 Children</p>
                                        {/* <p className="text-sm text-slate-400">(12 years old and below)</p> */}
                                    </div>

                                    {/* Room Details */}
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256" className="mr-3">
                                            <path fill="#9f1239" d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"></path>
                                        </svg>
                                        25 ㎡ | Floor: 2, 3
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-3">
                                            <path fill="#9f1239" d="M3 18v-5q0-.444.256-.946T4 11.3V9q0-.846.577-1.423T6 7h4.5q.517 0 .883.213q.365.212.617.587q.252-.375.617-.587Q12.983 7 13.5 7H18q.846 0 1.423.577T20 9v2.3q.489.252.744.754q.256.502.256.946v5h-1v-2H4v2zm9.5-7H19V9q0-.425-.288-.712T18 8h-4.5q-.425 0-.712.288T12.5 9zM5 11h6.5V9q0-.425-.288-.712T10.5 8H6q-.425 0-.712.288T5 9zm-1 4h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z"></path>
                                        </svg>
                                        1 King Bed
                                    </p>
                                </div>
                            </div>

                            {/* Price and Features */}
                            <div className="col-span-2 bg-white p-6 shadow-md rounded-base text-left">
                                <span className="text-3xl font-bold text-slate-700 text-left">PHP 4,600 </span>
                                <span className="text-2xl font-semibold text-slate-400">/night</span>
                                <div className="flex flex-col mt-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-2">
                                                <path fill="#9f1239" d="M8.1 13.34L3.91 9.16a4.01 4.01 0 0 1 0-5.66l7.02 7zm5.31-.34l6.88 6.88l-1.41 1.41L12 14.41l-6.88 6.88l-1.41-1.41l9.65-9.66l-.2-.22a1.98 1.98 0 0 1 0-2.81l4.34-4.37l.93.92L15.19 7l.96.94l3.24-3.25l.92.92l-3.25 3.24l.94.96l3.26-3.25l.92.94l-4.37 4.34c-.78.78-2.04.78-2.81 0l-.22-.2z"></path>
                                            </svg>
                                            Breakfast included
                                        </p>
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" className="mr-2">
                                                <path fill="#9f1239" d="M14 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H17v11.5a.5.5 0 0 1-1 0V7h-1.5a.5.5 0 0 1-.5-.5zM13 3H6.14a2.5 2.5 0 0 0-2.452 2.01L3.49 6h-.74a.75.75 0 0 0 0 1.5h.44l-.111.56A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H4v1a1 1 0 1 0 2 0v-1h8v1a1 1 0 0 0 1 1v-3H3.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H15V8H4.11l.559-2.794A1.5 1.5 0 0 1 6.139 4H13zm2 9a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-8 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0"></path>
                                            </svg>
                                            Free parking
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"  className="mr-2">
                                                <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                                                    <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4a.6.6 0 0 1 .6-.6zm-5 7l1 2m-9-2l-1 2m14-9V7a4 4 0 0 0-4-4h-5"></path>
                                                    <path d="M15.4 8H8.6c-.331 0-.596-.268-.56-.598C8.186 6.075 8.863 3 12 3s3.814 3.075 3.96 4.402c.036.33-.229.598-.56.598"></path>
                                                </g>
                                            </svg>
                                            Ensuite bathroom
                                        </p>
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32" className="mr-2">
                                                <path fill="#9f1239" d="M5 5C3.355 5 2 6.355 2 8v17h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h7.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H31V14.562a3.03 3.03 0 0 0-.469-1.593l-4.093-6.563A2.98 2.98 0 0 0 23.905 5zm0 2h5v6H4V8c0-.563.438-1 1-1m7 0h6v6h-6zm8 0h3.906c.348 0 .66.176.844.469L28.188 13H20zM4 15h25v2h-3v2h3v4h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3h-7.312c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4zm5 7c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m15 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2"></path>
                                            </svg>
                                            Free shuttle service
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="mr-2">
                                                <path fill="#9f1239" d="M12 20.423q-.646 0-1.092-.446t-.446-1.092t.446-1.093T12 17.346t1.092.446t.446 1.092t-.446 1.093t-1.092.446M6.35 15.35l-1.023-1.034q1.302-1.302 3.004-2.04t3.672-.737t3.669.74t3.001 2.048L17.65 15.35q-1.1-1.1-2.55-1.725T12 13t-3.1.625t-2.55 1.725M2.1 11.1l-1.023-1.023q2.089-2.1 4.875-3.32T12 5.54t6.048 1.219t4.875 3.319L21.9 11.1q-1.925-1.925-4.462-3.012T12 7T6.563 8.088T2.1 11.1"></path>
                                            </svg>
                                            Wi-Fi access
                                        </p>
                                        <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 14 14" className="mr-2">
                                                <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12.5.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"></path>
                                                    <path d="M11 7.5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2m-.5 5h.1A1.4 1.4 0 0 0 4 11.1V10m7.5 2.5h-.1a1.4 1.4 0 0 1-1.4-1.4V10m-3 3.5V10"></path>
                                                </g>
                                            </svg>
                                            Air conditioning
                                        </p>
                                        
                                        <div className="col-span-3 mt-20 flex items-center justify-between">
                                            <a className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-slate-500 text-sm font-semibold">Show more</span>
                                            </a>

                                            <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4th */}
                <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                    {/* Room Container */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white flex justify-center items-center">
                            <div className="flex flex-col">
                                {/* Title */}
                                <h2 className="text-2xl font-semibold text-red-700 text-left px-3 mb-2">Deluxe Twin Mayon View</h2>

                                {/* Room Image */}
                                <a href="/book-a-room" className="text-xl font-bold text-slate-600 text-left">
                                    <img
                                        src="/room_assets/MH-DELUXE-TWIN-MODAL-MAYON-VIEW.jpg"
                                        alt="Deluxe Room with King Bed"
                                        className="w-[500px] h-[200px] rounded-lg object-contain"
                                    />
                                </a>

                                {/* Room Capacity */}
                                <div className="flex items-center text-left mb-2">
                                    <p className="text-base font-medium text-slate-600 px-1 ml-2 mt-2">2 Adults | 2 Children</p>
                                    {/* <p className="text-sm text-slate-400">(12 years old and below)</p> */}
                                </div>

                                {/* Room Details */}
                                <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256" className="mr-3">
                                        <path fill="#9f1239" d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"></path>
                                    </svg>
                                    25 ㎡ | Floor: 2, 3
                                </p>
                                <p className="text-sm text-slate-500 flex items-center text-left px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-3">
                                        <path fill="#9f1239" d="M3 18v-5q0-.444.256-.946T4 11.3V9q0-.846.577-1.423T6 7h4.5q.517 0 .883.213q.365.212.617.587q.252-.375.617-.587Q12.983 7 13.5 7H18q.846 0 1.423.577T20 9v2.3q.489.252.744.754q.256.502.256.946v5h-1v-2H4v2zm9.5-7H19V9q0-.425-.288-.712T18 8h-4.5q-.425 0-.712.288T12.5 9zM5 11h6.5V9q0-.425-.288-.712T10.5 8H6q-.425 0-.712.288T5 9zm-1 4h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z"></path>
                                    </svg>
                                    1 King Bed
                                </p>
                            </div>
                        </div>

                        {/* Price and Features */}
                        <div className="col-span-2 bg-white p-6 shadow-md rounded-base text-left">
                            <span className="text-3xl font-bold text-slate-700 text-left">PHP 4,900 </span>
                            <span className="text-2xl font-semibold text-slate-400">/night</span>
                            <div className="flex flex-col mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M8.1 13.34L3.91 9.16a4.01 4.01 0 0 1 0-5.66l7.02 7zm5.31-.34l6.88 6.88l-1.41 1.41L12 14.41l-6.88 6.88l-1.41-1.41l9.65-9.66l-.2-.22a1.98 1.98 0 0 1 0-2.81l4.34-4.37l.93.92L15.19 7l.96.94l3.24-3.25l.92.92l-3.25 3.24l.94.96l3.26-3.25l.92.94l-4.37 4.34c-.78.78-2.04.78-2.81 0l-.22-.2z"></path>
                                        </svg>
                                        Breakfast included
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" className="mr-2">
                                            <path fill="#9f1239" d="M14 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H17v11.5a.5.5 0 0 1-1 0V7h-1.5a.5.5 0 0 1-.5-.5zM13 3H6.14a2.5 2.5 0 0 0-2.452 2.01L3.49 6h-.74a.75.75 0 0 0 0 1.5h.44l-.111.56A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H4v1a1 1 0 1 0 2 0v-1h8v1a1 1 0 0 0 1 1v-3H3.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H15V8H4.11l.559-2.794A1.5 1.5 0 0 1 6.139 4H13zm2 9a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-8 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0"></path>
                                        </svg>
                                        Free parking
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"  className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                                                <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4a.6.6 0 0 1 .6-.6zm-5 7l1 2m-9-2l-1 2m14-9V7a4 4 0 0 0-4-4h-5"></path>
                                                <path d="M15.4 8H8.6c-.331 0-.596-.268-.56-.598C8.186 6.075 8.863 3 12 3s3.814 3.075 3.96 4.402c.036.33-.229.598-.56.598"></path>
                                            </g>
                                        </svg>
                                        Ensuite bathroom
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32" className="mr-2">
                                            <path fill="#9f1239" d="M5 5C3.355 5 2 6.355 2 8v17h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h7.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H31V14.562a3.03 3.03 0 0 0-.469-1.593l-4.093-6.563A2.98 2.98 0 0 0 23.905 5zm0 2h5v6H4V8c0-.563.438-1 1-1m7 0h6v6h-6zm8 0h3.906c.348 0 .66.176.844.469L28.188 13H20zM4 15h25v2h-3v2h3v4h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3h-7.312c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4zm5 7c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m15 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2"></path>
                                        </svg>
                                        Free shuttle service
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M12 20.423q-.646 0-1.092-.446t-.446-1.092t.446-1.093T12 17.346t1.092.446t.446 1.092t-.446 1.093t-1.092.446M6.35 15.35l-1.023-1.034q1.302-1.302 3.004-2.04t3.672-.737t3.669.74t3.001 2.048L17.65 15.35q-1.1-1.1-2.55-1.725T12 13t-3.1.625t-2.55 1.725M2.1 11.1l-1.023-1.023q2.089-2.1 4.875-3.32T12 5.54t6.048 1.219t4.875 3.319L21.9 11.1q-1.925-1.925-4.462-3.012T12 7T6.563 8.088T2.1 11.1"></path>
                                        </svg>
                                        Wi-Fi access
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 14 14" className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12.5.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"></path>
                                                <path d="M11 7.5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2m-.5 5h.1A1.4 1.4 0 0 0 4 11.1V10m7.5 2.5h-.1a1.4 1.4 0 0 1-1.4-1.4V10m-3 3.5V10"></path>
                                            </g>
                                        </svg>
                                        Air conditioning
                                    </p>
                                    
                                    <div className="col-span-3 mt-20 flex items-center justify-between">
                                        <a className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-slate-500 text-sm font-semibold">Show more</span>
                                        </a>

                                        <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5th */}
                <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                    {/* Room Container */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white flex justify-center items-center">
                            <div className="flex flex-col">
                                {/* Title */}
                                <h2 className="text-2xl font-semibold text-red-700 text-left">Family Suite</h2>

                                {/* Room Image */}
                                <a href="/book-a-room" className="text-xl font-bold text-slate-600 text-left">
                                    <img
                                        src="/room_assets/MH-FAMILY-SUITE.jpg"
                                        alt="Deluxe Room with King Bed"
                                        className="w-[500px] h-[200px] rounded-lg object-contain"
                                    />
                                </a>

                                {/* Room Capacity */}
                                <div className="flex items-center text-left mb-2">
                                    <p className="text-base font-medium text-slate-600 px-1 ml-2">2 Adults | 2 Children</p>
                                    {/* <p className="text-sm text-slate-400">(12 years old and below)</p> */}
                                </div>

                                {/* Room Details */}
                                <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256" className="mr-3">
                                        <path fill="#9f1239" d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"></path>
                                    </svg>
                                    25 ㎡ | Floor: 2, 3
                                </p>
                                <p className="text-sm text-slate-500 flex items-center text-left px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-3">
                                        <path fill="#9f1239" d="M3 18v-5q0-.444.256-.946T4 11.3V9q0-.846.577-1.423T6 7h4.5q.517 0 .883.213q.365.212.617.587q.252-.375.617-.587Q12.983 7 13.5 7H18q.846 0 1.423.577T20 9v2.3q.489.252.744.754q.256.502.256.946v5h-1v-2H4v2zm9.5-7H19V9q0-.425-.288-.712T18 8h-4.5q-.425 0-.712.288T12.5 9zM5 11h6.5V9q0-.425-.288-.712T10.5 8H6q-.425 0-.712.288T5 9zm-1 4h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z"></path>
                                    </svg>
                                    1 King Bed
                                </p>
                            </div>
                        </div>

                        {/* Price and Features */}
                        <div className="col-span-2 bg-white p-6 shadow-md rounded-base text-left">
                            <span className="text-3xl font-bold text-slate-700 text-left">PHP 8,700 </span>
                            <span className="text-2xl font-semibold text-slate-400">/night</span>
                            <div className="flex flex-col mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M8.1 13.34L3.91 9.16a4.01 4.01 0 0 1 0-5.66l7.02 7zm5.31-.34l6.88 6.88l-1.41 1.41L12 14.41l-6.88 6.88l-1.41-1.41l9.65-9.66l-.2-.22a1.98 1.98 0 0 1 0-2.81l4.34-4.37l.93.92L15.19 7l.96.94l3.24-3.25l.92.92l-3.25 3.24l.94.96l3.26-3.25l.92.94l-4.37 4.34c-.78.78-2.04.78-2.81 0l-.22-.2z"></path>
                                        </svg>
                                        Breakfast included
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" className="mr-2">
                                            <path fill="#9f1239" d="M14 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H17v11.5a.5.5 0 0 1-1 0V7h-1.5a.5.5 0 0 1-.5-.5zM13 3H6.14a2.5 2.5 0 0 0-2.452 2.01L3.49 6h-.74a.75.75 0 0 0 0 1.5h.44l-.111.56A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H4v1a1 1 0 1 0 2 0v-1h8v1a1 1 0 0 0 1 1v-3H3.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H15V8H4.11l.559-2.794A1.5 1.5 0 0 1 6.139 4H13zm2 9a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-8 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0"></path>
                                        </svg>
                                        Free parking
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"  className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                                                <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4a.6.6 0 0 1 .6-.6zm-5 7l1 2m-9-2l-1 2m14-9V7a4 4 0 0 0-4-4h-5"></path>
                                                <path d="M15.4 8H8.6c-.331 0-.596-.268-.56-.598C8.186 6.075 8.863 3 12 3s3.814 3.075 3.96 4.402c.036.33-.229.598-.56.598"></path>
                                            </g>
                                        </svg>
                                        Ensuite bathroom
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32" className="mr-2">
                                            <path fill="#9f1239" d="M5 5C3.355 5 2 6.355 2 8v17h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h7.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H31V14.562a3.03 3.03 0 0 0-.469-1.593l-4.093-6.563A2.98 2.98 0 0 0 23.905 5zm0 2h5v6H4V8c0-.563.438-1 1-1m7 0h6v6h-6zm8 0h3.906c.348 0 .66.176.844.469L28.188 13H20zM4 15h25v2h-3v2h3v4h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3h-7.312c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4zm5 7c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m15 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2"></path>
                                        </svg>
                                        Free shuttle service
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M12 20.423q-.646 0-1.092-.446t-.446-1.092t.446-1.093T12 17.346t1.092.446t.446 1.092t-.446 1.093t-1.092.446M6.35 15.35l-1.023-1.034q1.302-1.302 3.004-2.04t3.672-.737t3.669.74t3.001 2.048L17.65 15.35q-1.1-1.1-2.55-1.725T12 13t-3.1.625t-2.55 1.725M2.1 11.1l-1.023-1.023q2.089-2.1 4.875-3.32T12 5.54t6.048 1.219t4.875 3.319L21.9 11.1q-1.925-1.925-4.462-3.012T12 7T6.563 8.088T2.1 11.1"></path>
                                        </svg>
                                        Wi-Fi access
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 14 14" className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12.5.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"></path>
                                                <path d="M11 7.5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2m-.5 5h.1A1.4 1.4 0 0 0 4 11.1V10m7.5 2.5h-.1a1.4 1.4 0 0 1-1.4-1.4V10m-3 3.5V10"></path>
                                            </g>
                                        </svg>
                                        Air conditioning
                                    </p>
                                    
                                    <div className="col-span-3 mt-20 flex items-center justify-between">
                                        <a className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-slate-500 text-sm font-semibold">Show more</span>
                                        </a>

                                        <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6th */}
                <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                    {/* Room Container */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white flex justify-center items-center">
                            <div className="flex flex-col">
                                {/* Title */}
                                <h2 className="text-2xl font-semibold text-red-700 text-left">Marison Suite</h2>

                                {/* Room Image */}
                                <a href="/book-a-room" className="text-xl font-bold text-slate-600 text-left">
                                    <img
                                        src="/room_assets/MH-MARISON-SUITE.jpg"
                                        alt="Deluxe Room with King Bed"
                                        className="w-[500px] h-[200px] rounded-lg object-contain"
                                    />
                                </a>

                                {/* Room Capacity */}
                                <div className="flex items-center text-left mb-2">
                                    <p className="text-base font-medium text-slate-600 px-1 ml-2">2 Adults | 2 Children</p>
                                    {/* <p className="text-sm text-slate-400">(12 years old and below)</p> */}
                                </div>

                                {/* Room Details */}
                                <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256" className="mr-3">
                                        <path fill="#9f1239" d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"></path>
                                    </svg>
                                    25 ㎡ | Floor: 2, 3
                                </p>
                                <p className="text-sm text-slate-500 flex items-center text-left px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-3">
                                        <path fill="#9f1239" d="M3 18v-5q0-.444.256-.946T4 11.3V9q0-.846.577-1.423T6 7h4.5q.517 0 .883.213q.365.212.617.587q.252-.375.617-.587Q12.983 7 13.5 7H18q.846 0 1.423.577T20 9v2.3q.489.252.744.754q.256.502.256.946v5h-1v-2H4v2zm9.5-7H19V9q0-.425-.288-.712T18 8h-4.5q-.425 0-.712.288T12.5 9zM5 11h6.5V9q0-.425-.288-.712T10.5 8H6q-.425 0-.712.288T5 9zm-1 4h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z"></path>
                                    </svg>
                                    1 King Bed
                                </p>
                            </div>
                        </div>

                        {/* Price and Features */}
                        <div className="col-span-2 bg-white p-6 shadow-md rounded-base text-left">
                            <span className="text-3xl font-bold text-slate-700 text-left">PHP 9,200 </span>
                            <span className="text-2xl font-semibold text-slate-400">/night</span>
                            <div className="flex flex-col mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M8.1 13.34L3.91 9.16a4.01 4.01 0 0 1 0-5.66l7.02 7zm5.31-.34l6.88 6.88l-1.41 1.41L12 14.41l-6.88 6.88l-1.41-1.41l9.65-9.66l-.2-.22a1.98 1.98 0 0 1 0-2.81l4.34-4.37l.93.92L15.19 7l.96.94l3.24-3.25l.92.92l-3.25 3.24l.94.96l3.26-3.25l.92.94l-4.37 4.34c-.78.78-2.04.78-2.81 0l-.22-.2z"></path>
                                        </svg>
                                        Breakfast included
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" className="mr-2">
                                            <path fill="#9f1239" d="M14 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H17v11.5a.5.5 0 0 1-1 0V7h-1.5a.5.5 0 0 1-.5-.5zM13 3H6.14a2.5 2.5 0 0 0-2.452 2.01L3.49 6h-.74a.75.75 0 0 0 0 1.5h.44l-.111.56A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H4v1a1 1 0 1 0 2 0v-1h8v1a1 1 0 0 0 1 1v-3H3.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H15V8H4.11l.559-2.794A1.5 1.5 0 0 1 6.139 4H13zm2 9a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-8 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0"></path>
                                        </svg>
                                        Free parking
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"  className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                                                <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4a.6.6 0 0 1 .6-.6zm-5 7l1 2m-9-2l-1 2m14-9V7a4 4 0 0 0-4-4h-5"></path>
                                                <path d="M15.4 8H8.6c-.331 0-.596-.268-.56-.598C8.186 6.075 8.863 3 12 3s3.814 3.075 3.96 4.402c.036.33-.229.598-.56.598"></path>
                                            </g>
                                        </svg>
                                        Ensuite bathroom
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32" className="mr-2">
                                            <path fill="#9f1239" d="M5 5C3.355 5 2 6.355 2 8v17h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h7.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H31V14.562a3.03 3.03 0 0 0-.469-1.593l-4.093-6.563A2.98 2.98 0 0 0 23.905 5zm0 2h5v6H4V8c0-.563.438-1 1-1m7 0h6v6h-6zm8 0h3.906c.348 0 .66.176.844.469L28.188 13H20zM4 15h25v2h-3v2h3v4h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3h-7.312c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4zm5 7c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m15 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2"></path>
                                        </svg>
                                        Free shuttle service
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M12 20.423q-.646 0-1.092-.446t-.446-1.092t.446-1.093T12 17.346t1.092.446t.446 1.092t-.446 1.093t-1.092.446M6.35 15.35l-1.023-1.034q1.302-1.302 3.004-2.04t3.672-.737t3.669.74t3.001 2.048L17.65 15.35q-1.1-1.1-2.55-1.725T12 13t-3.1.625t-2.55 1.725M2.1 11.1l-1.023-1.023q2.089-2.1 4.875-3.32T12 5.54t6.048 1.219t4.875 3.319L21.9 11.1q-1.925-1.925-4.462-3.012T12 7T6.563 8.088T2.1 11.1"></path>
                                        </svg>
                                        Wi-Fi access
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 14 14" className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12.5.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"></path>
                                                <path d="M11 7.5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2m-.5 5h.1A1.4 1.4 0 0 0 4 11.1V10m7.5 2.5h-.1a1.4 1.4 0 0 1-1.4-1.4V10m-3 3.5V10"></path>
                                            </g>
                                        </svg>
                                        Air conditioning
                                    </p>
                                    
                                    <div className="col-span-3 mt-20 flex items-center justify-between">
                                        <a className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-slate-500 text-sm font-semibold">Show more</span>
                                        </a>

                                        <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7th */}
                <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                    {/* Room Container */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white flex justify-center items-center">
                            <div className="flex flex-col">
                                {/* Title */}
                                <h2 className="text-2xl font-semibold text-red-700 text-left px-3 mb-2">Premiere Suite</h2>

                                {/* Room Image */}
                                <a href="/book-a-room" className="text-xl font-bold text-slate-600 text-left">
                                    <img
                                        src="/room_assets/MH-PREMIERE-SUITE.jpg"
                                        alt="Deluxe Room with King Bed"
                                        className="w-[500px] h-[200px] rounded-lg object-contain"
                                    />
                                </a>

                                {/* Room Capacity */}
                                <div className="flex items-center text-left mb-2">
                                    <p className="text-base font-medium text-slate-600 px-1 ml-2 mt-2">2 Adults | 2 Children</p>
                                    {/* <p className="text-sm text-slate-400">(12 years old and below)</p> */}
                                </div>

                                {/* Room Details */}
                                <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256" className="mr-3">
                                        <path fill="#9f1239" d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"></path>
                                    </svg>
                                    25 ㎡ | Floor: 2, 3
                                </p>
                                <p className="text-sm text-slate-500 flex items-center text-left px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-3">
                                        <path fill="#9f1239" d="M3 18v-5q0-.444.256-.946T4 11.3V9q0-.846.577-1.423T6 7h4.5q.517 0 .883.213q.365.212.617.587q.252-.375.617-.587Q12.983 7 13.5 7H18q.846 0 1.423.577T20 9v2.3q.489.252.744.754q.256.502.256.946v5h-1v-2H4v2zm9.5-7H19V9q0-.425-.288-.712T18 8h-4.5q-.425 0-.712.288T12.5 9zM5 11h6.5V9q0-.425-.288-.712T10.5 8H6q-.425 0-.712.288T5 9zm-1 4h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z"></path>
                                    </svg>
                                    1 King Bed
                                </p>
                            </div>
                        </div>

                        {/* Price and Features */}
                        <div className="col-span-2 bg-white p-6 shadow-md rounded-base text-left">
                            <span className="text-3xl font-bold text-slate-700 text-left">PHP 6,300 </span>
                            <span className="text-2xl font-semibold text-slate-400">/night</span>
                            <div className="flex flex-col mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M8.1 13.34L3.91 9.16a4.01 4.01 0 0 1 0-5.66l7.02 7zm5.31-.34l6.88 6.88l-1.41 1.41L12 14.41l-6.88 6.88l-1.41-1.41l9.65-9.66l-.2-.22a1.98 1.98 0 0 1 0-2.81l4.34-4.37l.93.92L15.19 7l.96.94l3.24-3.25l.92.92l-3.25 3.24l.94.96l3.26-3.25l.92.94l-4.37 4.34c-.78.78-2.04.78-2.81 0l-.22-.2z"></path>
                                        </svg>
                                        Breakfast included
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" className="mr-2">
                                            <path fill="#9f1239" d="M14 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H17v11.5a.5.5 0 0 1-1 0V7h-1.5a.5.5 0 0 1-.5-.5zM13 3H6.14a2.5 2.5 0 0 0-2.452 2.01L3.49 6h-.74a.75.75 0 0 0 0 1.5h.44l-.111.56A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H4v1a1 1 0 1 0 2 0v-1h8v1a1 1 0 0 0 1 1v-3H3.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H15V8H4.11l.559-2.794A1.5 1.5 0 0 1 6.139 4H13zm2 9a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-8 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0"></path>
                                        </svg>
                                        Free parking
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"  className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                                                <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4a.6.6 0 0 1 .6-.6zm-5 7l1 2m-9-2l-1 2m14-9V7a4 4 0 0 0-4-4h-5"></path>
                                                <path d="M15.4 8H8.6c-.331 0-.596-.268-.56-.598C8.186 6.075 8.863 3 12 3s3.814 3.075 3.96 4.402c.036.33-.229.598-.56.598"></path>
                                            </g>
                                        </svg>
                                        Ensuite bathroom
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32" className="mr-2">
                                            <path fill="#9f1239" d="M5 5C3.355 5 2 6.355 2 8v17h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h7.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H31V14.562a3.03 3.03 0 0 0-.469-1.593l-4.093-6.563A2.98 2.98 0 0 0 23.905 5zm0 2h5v6H4V8c0-.563.438-1 1-1m7 0h6v6h-6zm8 0h3.906c.348 0 .66.176.844.469L28.188 13H20zM4 15h25v2h-3v2h3v4h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3h-7.312c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4zm5 7c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m15 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2"></path>
                                        </svg>
                                        Free shuttle service
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M12 20.423q-.646 0-1.092-.446t-.446-1.092t.446-1.093T12 17.346t1.092.446t.446 1.092t-.446 1.093t-1.092.446M6.35 15.35l-1.023-1.034q1.302-1.302 3.004-2.04t3.672-.737t3.669.74t3.001 2.048L17.65 15.35q-1.1-1.1-2.55-1.725T12 13t-3.1.625t-2.55 1.725M2.1 11.1l-1.023-1.023q2.089-2.1 4.875-3.32T12 5.54t6.048 1.219t4.875 3.319L21.9 11.1q-1.925-1.925-4.462-3.012T12 7T6.563 8.088T2.1 11.1"></path>
                                        </svg>
                                        Wi-Fi access
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 14 14" className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12.5.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"></path>
                                                <path d="M11 7.5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2m-.5 5h.1A1.4 1.4 0 0 0 4 11.1V10m7.5 2.5h-.1a1.4 1.4 0 0 1-1.4-1.4V10m-3 3.5V10"></path>
                                            </g>
                                        </svg>
                                        Air conditioning
                                    </p>
                                    
                                    <div className="col-span-3 mt-20 flex items-center justify-between">
                                        <a className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-slate-500 text-sm font-semibold">Show more</span>
                                        </a>

                                        <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 8th */}
                <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                    {/* Room Container */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white flex justify-center items-center">
                            <div className="flex flex-col">
                                {/* Title */}
                                <h2 className="text-2xl font-semibold text-red-700 text-left px-3 mb-2">Premiere Suite Queen</h2>

                                {/* Room Image */}
                                <a href="/book-a-room" className="text-xl font-bold text-slate-600 text-left">
                                    <img
                                        src="/room_assets/MH-PREMIERE-SUITE-QUEEN.jpg"
                                        alt="Deluxe Room with King Bed"
                                        className="w-[500px] h-[200px] rounded-lg object-contain"
                                    />
                                </a>

                                {/* Room Capacity */}
                                <div className="flex items-center text-left mb-2">
                                    <p className="text-base font-medium text-slate-600 px-1 ml-2 mt-2">2 Adults | 2 Children</p>
                                    {/* <p className="text-sm text-slate-400">(12 years old and below)</p> */}
                                </div>

                                {/* Room Details */}
                                <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256" className="mr-3">
                                        <path fill="#9f1239" d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"></path>
                                    </svg>
                                    25 ㎡ | Floor: 2, 3
                                </p>
                                <p className="text-sm text-slate-500 flex items-center text-left px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-3">
                                        <path fill="#9f1239" d="M3 18v-5q0-.444.256-.946T4 11.3V9q0-.846.577-1.423T6 7h4.5q.517 0 .883.213q.365.212.617.587q.252-.375.617-.587Q12.983 7 13.5 7H18q.846 0 1.423.577T20 9v2.3q.489.252.744.754q.256.502.256.946v5h-1v-2H4v2zm9.5-7H19V9q0-.425-.288-.712T18 8h-4.5q-.425 0-.712.288T12.5 9zM5 11h6.5V9q0-.425-.288-.712T10.5 8H6q-.425 0-.712.288T5 9zm-1 4h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z"></path>
                                    </svg>
                                    1 King Bed
                                </p>
                            </div>
                        </div>

                        {/* Price and Features */}
                        <div className="col-span-2 bg-white p-6 shadow-md rounded-base text-left">
                            <span className="text-3xl font-bold text-slate-700 text-left">PHP 6.300 </span>
                            <span className="text-2xl font-semibold text-slate-400">/night</span>
                            <div className="flex flex-col mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M8.1 13.34L3.91 9.16a4.01 4.01 0 0 1 0-5.66l7.02 7zm5.31-.34l6.88 6.88l-1.41 1.41L12 14.41l-6.88 6.88l-1.41-1.41l9.65-9.66l-.2-.22a1.98 1.98 0 0 1 0-2.81l4.34-4.37l.93.92L15.19 7l.96.94l3.24-3.25l.92.92l-3.25 3.24l.94.96l3.26-3.25l.92.94l-4.37 4.34c-.78.78-2.04.78-2.81 0l-.22-.2z"></path>
                                        </svg>
                                        Breakfast included
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" className="mr-2">
                                            <path fill="#9f1239" d="M14 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H17v11.5a.5.5 0 0 1-1 0V7h-1.5a.5.5 0 0 1-.5-.5zM13 3H6.14a2.5 2.5 0 0 0-2.452 2.01L3.49 6h-.74a.75.75 0 0 0 0 1.5h.44l-.111.56A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H4v1a1 1 0 1 0 2 0v-1h8v1a1 1 0 0 0 1 1v-3H3.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H15V8H4.11l.559-2.794A1.5 1.5 0 0 1 6.139 4H13zm2 9a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-8 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0"></path>
                                        </svg>
                                        Free parking
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"  className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                                                <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4a.6.6 0 0 1 .6-.6zm-5 7l1 2m-9-2l-1 2m14-9V7a4 4 0 0 0-4-4h-5"></path>
                                                <path d="M15.4 8H8.6c-.331 0-.596-.268-.56-.598C8.186 6.075 8.863 3 12 3s3.814 3.075 3.96 4.402c.036.33-.229.598-.56.598"></path>
                                            </g>
                                        </svg>
                                        Ensuite bathroom
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32" className="mr-2">
                                            <path fill="#9f1239" d="M5 5C3.355 5 2 6.355 2 8v17h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h7.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H31V14.562a3.03 3.03 0 0 0-.469-1.593l-4.093-6.563A2.98 2.98 0 0 0 23.905 5zm0 2h5v6H4V8c0-.563.438-1 1-1m7 0h6v6h-6zm8 0h3.906c.348 0 .66.176.844.469L28.188 13H20zM4 15h25v2h-3v2h3v4h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3h-7.312c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4zm5 7c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m15 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2"></path>
                                        </svg>
                                        Free shuttle service
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M12 20.423q-.646 0-1.092-.446t-.446-1.092t.446-1.093T12 17.346t1.092.446t.446 1.092t-.446 1.093t-1.092.446M6.35 15.35l-1.023-1.034q1.302-1.302 3.004-2.04t3.672-.737t3.669.74t3.001 2.048L17.65 15.35q-1.1-1.1-2.55-1.725T12 13t-3.1.625t-2.55 1.725M2.1 11.1l-1.023-1.023q2.089-2.1 4.875-3.32T12 5.54t6.048 1.219t4.875 3.319L21.9 11.1q-1.925-1.925-4.462-3.012T12 7T6.563 8.088T2.1 11.1"></path>
                                        </svg>
                                        Wi-Fi access
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 14 14" className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12.5.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"></path>
                                                <path d="M11 7.5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2m-.5 5h.1A1.4 1.4 0 0 0 4 11.1V10m7.5 2.5h-.1a1.4 1.4 0 0 1-1.4-1.4V10m-3 3.5V10"></path>
                                            </g>
                                        </svg>
                                        Air conditioning
                                    </p>
                                    
                                    <div className="col-span-3 mt-20 flex items-center justify-between">
                                        <a className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-slate-500 text-sm font-semibold">Show more</span>
                                        </a>

                                        <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 9th */}
                <div className="col-span-2 bg-white p-6 shadow-md rounded-lg">
                    {/* Room Container */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white flex justify-center items-center">
                            <div className="flex flex-col">
                                {/* Title */}
                                <h2 className="text-2xl font-semibold text-red-700 text-left px-3 mb-2">Specialty Deluxe</h2>

                                {/* Room Image */}
                                <a href="/book-a-room" className="text-xl font-bold text-slate-600 text-left">
                                    <img
                                        src="/room_assets/MH-SPECIALTY-DELUXE.jpg"
                                        alt="Deluxe Room with King Bed"
                                        className="w-[500px] h-[200px] rounded-lg object-contain"
                                    />
                                </a>

                                {/* Room Capacity */}
                                <div className="flex items-center text-left mb-2">
                                    <p className="text-base font-medium text-slate-600 px-1 ml-2 mt-2">2 Adults | 2 Children</p>
                                    {/* <p className="text-sm text-slate-400">(12 years old and below)</p> */}
                                </div>

                                {/* Room Details */}
                                <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 256 256" className="mr-3">
                                        <path fill="#9f1239" d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"></path>
                                    </svg>
                                    25 ㎡ | Floor: 2, 3
                                </p>
                                <p className="text-sm text-slate-500 flex items-center text-left px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-3">
                                        <path fill="#9f1239" d="M3 18v-5q0-.444.256-.946T4 11.3V9q0-.846.577-1.423T6 7h4.5q.517 0 .883.213q.365.212.617.587q.252-.375.617-.587Q12.983 7 13.5 7H18q.846 0 1.423.577T20 9v2.3q.489.252.744.754q.256.502.256.946v5h-1v-2H4v2zm9.5-7H19V9q0-.425-.288-.712T18 8h-4.5q-.425 0-.712.288T12.5 9zM5 11h6.5V9q0-.425-.288-.712T10.5 8H6q-.425 0-.712.288T5 9zm-1 4h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z"></path>
                                    </svg>
                                    1 King Bed
                                </p>
                            </div>
                        </div>

                        {/* Price and Features */}
                        <div className="col-span-2 bg-white p-6 shadow-md rounded-base text-left">
                            <span className="text-3xl font-bold text-slate-700 text-left">PHP 4,800 </span>
                            <span className="text-2xl font-semibold text-slate-400">/night</span>
                            <div className="flex flex-col mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M8.1 13.34L3.91 9.16a4.01 4.01 0 0 1 0-5.66l7.02 7zm5.31-.34l6.88 6.88l-1.41 1.41L12 14.41l-6.88 6.88l-1.41-1.41l9.65-9.66l-.2-.22a1.98 1.98 0 0 1 0-2.81l4.34-4.37l.93.92L15.19 7l.96.94l3.24-3.25l.92.92l-3.25 3.24l.94.96l3.26-3.25l.92.94l-4.37 4.34c-.78.78-2.04.78-2.81 0l-.22-.2z"></path>
                                        </svg>
                                        Breakfast included
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" className="mr-2">
                                            <path fill="#9f1239" d="M14 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H17v11.5a.5.5 0 0 1-1 0V7h-1.5a.5.5 0 0 1-.5-.5zM13 3H6.14a2.5 2.5 0 0 0-2.452 2.01L3.49 6h-.74a.75.75 0 0 0 0 1.5h.44l-.111.56A1.5 1.5 0 0 0 2 9.5v5A1.5 1.5 0 0 0 3.5 16H4v1a1 1 0 1 0 2 0v-1h8v1a1 1 0 0 0 1 1v-3H3.5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5H15V8H4.11l.559-2.794A1.5 1.5 0 0 1 6.139 4H13zm2 9a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-8 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0"></path>
                                        </svg>
                                        Free parking
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"  className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                                                <path d="M21 13v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.4a.6.6 0 0 1 .6-.6zm-5 7l1 2m-9-2l-1 2m14-9V7a4 4 0 0 0-4-4h-5"></path>
                                                <path d="M15.4 8H8.6c-.331 0-.596-.268-.56-.598C8.186 6.075 8.863 3 12 3s3.814 3.075 3.96 4.402c.036.33-.229.598-.56.598"></path>
                                            </g>
                                        </svg>
                                        Ensuite bathroom
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32" className="mr-2">
                                            <path fill="#9f1239" d="M5 5C3.355 5 2 6.355 2 8v17h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h7.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H31V14.562a3.03 3.03 0 0 0-.469-1.593l-4.093-6.563A2.98 2.98 0 0 0 23.905 5zm0 2h5v6H4V8c0-.563.438-1 1-1m7 0h6v6h-6zm8 0h3.906c.348 0 .66.176.844.469L28.188 13H20zM4 15h25v2h-3v2h3v4h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3h-7.312c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4zm5 7c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m15 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2"></path>
                                        </svg>
                                        Free shuttle service
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="mr-2">
                                            <path fill="#9f1239" d="M12 20.423q-.646 0-1.092-.446t-.446-1.092t.446-1.093T12 17.346t1.092.446t.446 1.092t-.446 1.093t-1.092.446M6.35 15.35l-1.023-1.034q1.302-1.302 3.004-2.04t3.672-.737t3.669.74t3.001 2.048L17.65 15.35q-1.1-1.1-2.55-1.725T12 13t-3.1.625t-2.55 1.725M2.1 11.1l-1.023-1.023q2.089-2.1 4.875-3.32T12 5.54t6.048 1.219t4.875 3.319L21.9 11.1q-1.925-1.925-4.462-3.012T12 7T6.563 8.088T2.1 11.1"></path>
                                        </svg>
                                        Wi-Fi access
                                    </p>
                                    <p className="text-sm text-slate-500 flex items-center text-left px-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 14 14" className="mr-2">
                                            <g fill="none" stroke="#9f1239" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12.5.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"></path>
                                                <path d="M11 7.5v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2m-.5 5h.1A1.4 1.4 0 0 0 4 11.1V10m7.5 2.5h-.1a1.4 1.4 0 0 1-1.4-1.4V10m-3 3.5V10"></path>
                                            </g>
                                        </svg>
                                        Air conditioning
                                    </p>
                                    
                                    <div className="col-span-3 mt-20 flex items-center justify-between">
                                        <a className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-slate-500 text-sm font-semibold">Show more</span>
                                        </a>

                                        <button 
                                            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => {handleProceedToPayment()}}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    );
};

export default BookaRoom;
