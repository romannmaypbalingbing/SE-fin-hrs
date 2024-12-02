import React, { useState } from 'react';

const DateTimePicker = () => {
    const [selectedTime, setSelectedTime] = useState('12:00 AM');  // Default selected time

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };

    return (
        <div>
            <button 
                type="button" 
                data-modal-target="timepicker-modal" 
                data-modal-toggle="timepicker-modal" 
                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
            >
                <svg 
                    className="w4 h-4 me-1" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        fillRule="evenodd" 
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" 
                        clipRule="evenodd"
                    />
                </svg>
                Appointment Date
            </button>

            {/* Modal */}
            <div 
                id="timepicker-modal" 
                tabIndex="-1" 
                aria-hidden="true" 
                className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative p-4 w-full max-w-[23rem] max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Schedule an appointment
                            </h3>
                            <button 
                                type="button" 
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                                data-modal-toggle="timepicker-modal"
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 pt-0">
                            <div 
                                inline-datepicker 
                                datepicker-autoselect-today 
                                className="mx-auto sm:mx-0 flex justify-center my-5 [&>div>div]:shadow-none [&>div>div]:bg-gray-50 [&_div>button]:bg-gray-50"
                            ></div>
                            <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                                Pick your time
                            </label>

                            {/* Time options */}
                            <ul id="timetable" className="grid w-full grid-cols-3 gap-2 mb-5">
                                {['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'].map((time) => (
                                    <li key={time}>
                                        <input 
                                            type="radio" 
                                            id={time} 
                                            value={time} 
                                            className="hidden peer" 
                                            name="timetable" 
                                            checked={selectedTime === time} 
                                            onChange={handleTimeChange}
                                        />
                                        <label 
                                            htmlFor={time} 
                                            className={`inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center cursor-pointer ${selectedTime === time ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-500'} border rounded-lg`}
                                        >
                                            {time}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateTimePicker;
