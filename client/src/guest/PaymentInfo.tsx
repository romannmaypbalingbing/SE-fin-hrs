import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GuestNavBar from '../components/GuestNavBar';
import Stepper from '../components/Stepper';
import supabase from '../supabaseClient';

interface Guest{ 
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

interface Payment{
    cardName: string;
    cardNumber: string;
    expDateMonth: string;
    expDateYear: string;
    securityCode: string;
}

const GuestInfo = () => {
    const [ paymentMethod, setPaymentMethod ] = useState<string>('Visa Card');
    const navigate = useNavigate();
    const location = useLocation();
    interface SelectedRoom {
        room: {
            roomtype_name: string;
        };
        quantity: number;
    }
    
    const {res_id, selectedRooms, checkInDate, checkOutDate, stayDuration, subtotal, discount} = 
        location.state as { 
            res_id: string,
            selectedRooms: SelectedRoom[], 
            checkInDate: string, 
            checkOutDate: string, 
            stayDuration: number, 
            subtotal: number, 
            discount: number } || {};

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    const calculateTotalCost = () => {
        return (subtotal * (1 - discount)).toFixed(2);
    }
    
    const [guests, setGuests] = useState<Guest[]>([
        {
            id: '1', 
            formData: {
                lastName: '',
                firstName: '',
                email: '',
                contactNumber: '',
                address: '',
                country: '',
            },
            shuttleService: false,
            arrivalDate: null, 
            arrivalTime: null
            },
    ]);

    const [payment, setPayment] = useState<Payment>({
        cardName: '',
        cardNumber: '',
        expDateMonth: '',
        expDateYear: '',
        securityCode: '',
    });

    const handlePaymentMethodChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(evt.target.id);
    };

    const handlePaymentChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = evt.target;
        setPayment((prevPayment) => ({ ...prevPayment, [name]: value }));
    }
    
    const handleGuestChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, guestID: string) => {
        const { name, value } = evt.target;
        setGuests((prevGuests) => 
            prevGuests.map((guest) =>
                guest.id === guestID
                    ? { ...guest, formData: { ...guest.formData, [name]: value } }
                    : guest
            )
        );
    };

    const addGuest = () => {
        const newGuest: Guest = { 
            id: (guests.length + 1).toString(), 
            formData: { 
                firstName: '', 
                lastName: '', 
                email: '', 
                contactNumber: '', 
                address: '', 
                country: '' 
            },
            arrivalDate: null,
            arrivalTime: null,
            shuttleService: false
        };
        setGuests([...guests, newGuest]);
    };

    const [shuttleService, setShuttleService] = React.useState(false);

    const handleShuttleChange = () => {
        setShuttleService(!shuttleService);
    };

    // State to track the arrival date and time
    const [arrivalDateTime, setArrivalDateTime] = useState<string | null>(null);
    const handleArrivalDateTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => { 
        setArrivalDateTime(evt.target.value);
    };

    const submitGuestInfo = async () => {
        try {
            //ensure guests array has at least one guest
            if (guests.length === 0) {
                alert('Please provide guest information.');
                return;
            }
            
            const guestInsertPromises = guests.map((guest, index) => { return supabase
                .from('guests_info')
                .insert([
                    {
                        guest_firstname: guest.formData.firstName,
                        guest_lastname: guest.formData.lastName,
                        guest_email: guest.formData.email,
                        guest_contactno: guest.formData.contactNumber,
                        guest_address: guest.formData.address,
                        guest_country: guest.formData.country,
                        guest_requests: guest.formData.notesandRequests || '',
                        res_id: res_id,
                        isReservor: index === 0,    //first guest information is the reservor
                    },
                ]);
            });

        const guestInsertResults = await Promise.all(guestInsertPromises);

        for (const result of guestInsertResults) {
            if (result.error) {
              console.error('Error inserting a guest:', result.error);
              alert('Error inserting guest information.');
              return;
            }
        }

        console.log('Guest data inserted:', guestInsertResults);

        // Insert shuttle service data
        const shuttleServiceData = guests.filter((guest) => guest.shuttleService).map((guest) => {
            return {
                shuttle_service : guest.shuttleService,
                shuttle_date: guest.arrivalDate,
                shuttle_time: guest.arrivalTime,
            };
        });
        try {
            const { data, error } = await supabase
              .from('reservation')
              .insert(shuttleServiceData);
          
            if (error) {
              console.error('Error inserting shuttle service data:', error);
            } else {
              console.log('Successfully inserted shuttle service data:', data);
            }
          } catch (error) {
            console.error('Unexpected error while inserting data:', error);
          }


        // Insert payment data
            const { data: paymentData, error: paymentError } = await supabase
                .from('payment')
                .insert([
                    {
                        card_name: payment.cardName,
                        card_number: payment.cardNumber,
                        exp_date_month: payment.expDateMonth,
                        exp_date_year: payment.expDateYear,
                        sec_Code: payment.securityCode,
                        payment_method: paymentMethod,
                    },
                ]);

            if (paymentError) {
                console.error('Error inserting payment data:', paymentError);
                alert('Error inserting payment data. Please try again later.');
                return;
            }

            console.log('Payment data inserted:', paymentData);
            const Guest = guests[0];
            const reservor =  `${Guest.formData.firstName} ${Guest.formData.lastName}`;
            alert('Payment and guest information submitted');
            navigate('/guest/receipt', {
                state: {res_id, selectedRooms, checkInDate, checkOutDate, stayDuration, subtotal, discount, reservor},
            }
            )
            
        } catch (error) {
            console.error('Error inserting guest data:', error);
            alert('Error inserting guest data. Please try again later.');
        }
    }


    const country = [
        "Afghanistan", "Aland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola",
        "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia",
        "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
        "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory",
        "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
        "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island",
        "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Cook Islands",
        "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
        "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea",
        "Estonia", "Eswatini", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland",
        "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia",
        "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam",
        "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands",
        "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
        "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan",
        "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic",
        "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
        "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius",
        "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco",
        "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua",
        "Niger", "Nigeria", "Niue", "Norfolk Island", "North Macedonia", "Northern Mariana Islands", "Norway", "Oman",
        "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn",
        "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russian Federation", "Rwanda",
        "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)",
        "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
        "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)",
        "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands",
        "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan",
        "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia",
        "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
        "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Viet Nam", "Western Sahara",
        "Yemen", "Zambia", "Zimbabwe"
      ];

        return (
            <div className="bg-slate-100 w-full">
                <GuestNavBar /> 
                <Stepper />
                {/* divides 2 columns */}
                <div className="grid grid-cols-2 gap-10 p-5">

                    {/* left side showing guest input fields */}
                    <div className="col-span-1 bg-white p-3 shadow-md rounded-lg mb-4"> {/* Form container set to white with rounded corners */}
                        {/* Grid layout with 2 columns */}
                        <div className="grid grid-cols-2 gap-4"> 
                            {/* Guest Information label */}
                            <div className="col-span-2">
                                {guests.map((guest, index) => (
                                    <div className="mt-5" key={guest.id}>
                                        <h2 className="text-xl font-semibold italic text-red-900 text-left mb-2">
                                            Guest Information #{index + 1}
                                        </h2>
                                        <div className="grid grid-cols-2 gap-x-4">
                                            {/* Last Name Input Field */}
                                            <div className="relative mb-3">
                                                <input
                                                    id="lastName"
                                                    type="text"
                                                    name="lastName"
                                                    placeholder="Last Name"
                                                    value={guest.formData.lastName}
                                                    onChange={(e) => handleGuestChange(e, guest.id)}
                                                    className="peer relative h-10 w-full rounded border border-slate-400 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-red-900 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                                />
                                                <label
                                                    htmlFor="lastName"
                                                    className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-500 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-red-900 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                                >
                                                    Last Name
                                                </label>
                                            </div>

                                            {/* First Name Input Field */}
                                            <div className="relative mb-3">
                                                <input
                                                    id="firstName"
                                                    type="text"
                                                    name="firstName"
                                                    placeholder="First Name"
                                                    value={guest.formData.firstName}
                                                    onChange={(e) => handleGuestChange(e, guest.id)}
                                                    className="peer relative h-10 w-full rounded border border-slate-400 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-red-900 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                                />
                                                <label
                                                    htmlFor="firstName"
                                                    className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-500 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-red-900 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                                >
                                                    First Name
                                                </label>
                                            </div>
                                        

                                            {/* Email Input Field */}
                                            <div className="relative mb-3">
                                                <input
                                                    id="email"
                                                    type="text"
                                                    name="email"
                                                    placeholder="Email"
                                                    value={guest.formData.email}
                                                    onChange={(e) => handleGuestChange(e, guest.id)}
                                                    className="peer relative h-10 w-full rounded border border-slate-400 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-red-900 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                                />
                                                <label
                                                    htmlFor="email"
                                                    className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-500 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-red-900 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                                >
                                                    Email
                                                </label>
                                            </div>
                                            <div className="relative mb-3">
                                                <input
                                                    id="contactNumber"
                                                    type="text"
                                                    name="contactNumber"
                                                    placeholder="Contact Number"
                                                    value={guest.formData.contactNumber}
                                                    onChange={(e) => handleGuestChange(e, guest.id)}
                                                    className="peer relative h-10 w-full rounded border border-slate-400 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-red-900 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                                />
                                                <label
                                                    htmlFor="contactNumber"
                                                    className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-500 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-red-900 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                                >
                                                    Contact Number
                                                </label>
                                            </div>
                                        </div>

                                        {/* Address Input Field */}
                                        <div className="relative mb-3">
                                            <input
                                                id="address"
                                                type="text"
                                                name="address"
                                                placeholder="Address"
                                                value={guest.formData.address}
                                                onChange={(e) => handleGuestChange(e, guest.id)}
                                                className="peer relative h-10 w-full rounded border border-slate-400 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-red-900 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                            />
                                            <label
                                                htmlFor="address"
                                                className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs"
                                            >
                                                Address (Optional)
                                            </label>
                                        </div>

                                        {/* Country Dropdown */}
                                        <div className="relative w-1/2">
                                            <select
                                                id="country"
                                                name="country"
                                                value={guest.formData.country}
                                                onChange={(e) => handleGuestChange(e, guest.id)}
                                                className="peer relative h-10 w-full rounded border border-slate-400 px-4 text-sm text-slate-500 outline-none"
                                            >
                                                <option value="" disabled>
                                                    -- Country --
                                                </option>
                                                {country && country.map((c, index) => (
                                                    <option key={index} value={c}>
                                                        {c}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}

                                {/* end of guest info */}

                                <div className="w-full mt-4 flex items-center justify-left">
                                    <button 
                                        className="flex items-center text-slate-600 font-sm italic hover:text-red-900"
                                        onClick={addGuest}
                                        
                                    >       
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 1024 1024" className="mr-2 fill-current group-hover:text-red-600">
                                            <path d="M352 480h320a32 32 0 1 1 0 64H352a32 32 0 0 1 0-64"></path>
                                            <path d="M480 672V352a32 32 0 1 1 64 0v320a32 32 0 0 1-64 0"></path>
                                            <path d="M512 896a384 384 0 1 0 0-768a384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896a448 448 0 0 1 0 896"></path>
                                        </svg>
                                        Add another guest
                                    </button>
                                </div>

                                {/* Adds line below the Contact Number field */}
                                <div className="w-full border-t border-slate-300 mt-6 "></div>

                                {/* Additional Information label */}
                                <label className="block text-xl text-slate-600 font-semibold italic text-left mt-4">
                                    Additional Information
                                </label>

                                {/* Checkbox for services */}
                                <div className="flex items-center mt-4">
                                    <input
                                        type="checkbox"
                                        id="shuttleService"
                                        name="shuttleService"
                                        checked={shuttleService}
                                        onChange={handleShuttleChange}
                                        className="peer"
                                    />
                                    <label htmlFor="shuttleservice" 
                                        className="ml-2 text-base text-slate-500 mr-2 inline-block">
                                            Hotel Shuttle Service
                                    </label>
                                </div>
                            
                                {/* Additional options if shuttle service is checked */}
                                {shuttleService && (
                                    <div className="flex flex-col">
                                        <label htmlFor="arrivalDateTime" className="block text-sm font-medium text-slate-500 text-left mt-2">
                                            Arrival Date and Time
                                        </label>
                                        <input 
                                            id="arrivalDateTime"
                                            type="datetime-local"
                                            name="arrivalDateTime"
                                            value={arrivalDateTime || ''}
                                            onChange={handleArrivalDateTimeChange}
                                            className="peer relative h-10 w-full rounded border border-slate-400 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white"
                                            />
                                        
                                    </div>
                                )}

                                <div className="relative my-4">
                                    <input
                                        id="requests"
                                        type="text"
                                        name="requests"
                                        placeholder="Notes and Requests"
                                        className="peer relative h-20 w-full rounded border border-slate-400 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-red-900 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                        
                                        onChange={(e) => handleGuestChange(e, '1')}
                                    />
                                    <label
                                        htmlFor="addInfo"
                                        className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-base text-slate-500 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-red-900 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                    >
                                        Notes and Requests (150 characters)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="col-span-1 grid grid-col-2 gap-4 ml-4"> {/* Grid layout with 2 columns */}
                    
                        {/* summary */}
                        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
                            {/* Booking Details */}
                            <h2 className="text-xl font-semibold text-red-800 mb-4">Your booking details</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                {/* Check-In */}
                                <div>
                                <p className="font-medium text-gray-700">Check-in</p>
                                <p>{formatDate(checkInDate)}</p>
                                
                                </div>
                                {/* Check-Out */}
                                <div>
                                <p className="font-medium text-gray-700">Check-out</p>
                                <p>{formatDate(checkOutDate)}</p>
                                
                                </div>
                            </div>

                            {/* Length of Stay */}
                            <p className="text-sm text-gray-600 mt-4">
                                <span className="font-medium text-gray-700">Total length of stay:</span> {stayDuration} nights
                            </p>

                            <hr className="my-4 border-gray-300" />

                            {/* Selected Rooms */}
                            <h3 className="text-lg font-semibold text-gray-700">Selected rooms</h3>
                            <p className="text-sm text-gray-600">{selectedRooms.length} rooms</p>
                            <ul className="mt-2 text-sm text-gray-700">
                                {selectedRooms.map(({ room, quantity }, index) => (
                                <li key={index}>
                                    {quantity} x {room.roomtype_name}
                                </li>
                                ))}
                            </ul> 

                            <hr className="my-4 border-gray-300" />

                            {/* Price Summary */}
                            <div className="flex justify-between text-lg text-gray-600">
                                <p>Total Cost</p>
                                <p className="font-medium font-bold text-gray-700">PHP {calculateTotalCost()}</p>
                            </div>
                        </div>
        
                        
                        {/* ))} */}
                        
                    

                        {/* payment */}
                        <div className="flex flex-col bg-white p-6 shadow-md rounded-lg">
                            <div className="w-full pt-1 pb-5"></div>
                                <div className="mb-10">
                                    <h1 className="text-center font-bold text-xl text-red-900 uppercase">Secure payment info</h1>
                                </div>
                                <div className="mb-3 flex -mx-2">
                                    <div className="px-2">
                                        <label htmlFor="type1" className="flex items-center cursor-pointer">
                                            <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" id="type1" defaultChecked onChange={handlePaymentMethodChange}/>
                                            <img src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png" className="h-8 ml-3" alt="Card 1" />
                                        </label>
                                    </div>
                                    <div className="px-2">
                                        <label htmlFor="type2" className="flex items-center cursor-pointer">
                                            <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" id="type2" onChange={handlePaymentMethodChange} />
                                            <img src="https://www.sketchappsources.com/resources/source-image/PayPalCard.png" className="h-8 ml-3" alt="Card 2" />
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3 mt-3">
                                    <input
                                        id="cardName"
                                        type="text"
                                        name="cardName"
                                        placeholder="CardName"
                                        value={payment.cardName}
                                        onChange={(e) => handlePaymentChange(e)}
                                        className="peer relative h-10 w-full rounded border border-slate-400 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-red-900 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                    />
                                    <label
                                        htmlFor="cardName"
                                        className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-500 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-red-900 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                    >
                                        Name on Card
                                    </label>   
                                </div>
                                <div className="mb-3 mt-2">
                                    <input
                                        id="cardNumber"
                                        type="text"
                                        name="cardNumber"
                                        placeholder="CardNumber"
                                        value={payment.cardNumber}
                                        onChange={(e) => handlePaymentChange(e)}
                                        className="peer relative h-10 w-full rounded border border-slate-400 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-red-900 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                    />
                                    <label
                                        htmlFor="cardNumber"
                                        className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-500 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-red-900 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                    >
                                        Name on Card
                                    </label>   
                                </div>
                                <div className="mb-3 -mx-2 flex items-end">
                                    <div className="px-2 w-1/2">
                                        <label className="font-bold text-sm mb-2 ml-1">Expiration date</label>
                                        <div>
                                            <select className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-red-800 transition-colors cursor-pointer">
                                                <option value="01">01 - January</option>
                                                <option value="02">02 - February</option>
                                                <option value="03">03 - March</option>
                                                <option value="04">04 - April</option>
                                                <option value="05">05 - May</option>
                                                <option value="06">06 - June</option>
                                                <option value="07">07 - July</option>
                                                <option value="08">08 - August</option>
                                                <option value="09">09 - September</option>
                                                <option value="10">10 - October</option>
                                                <option value="11">11 - November</option>
                                                <option value="12">12 - December</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="px-2 w-1/2">
                                        <select className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-red-800 transition-colors cursor-pointer">
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
                                            <option value="2027">2027</option>
                                            <option value="2028">2028</option>
                                            <option value="2029">2029</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-10">
                                    <label className="font-bold text-sm mb-2 ml-1">Security code</label>
                                    <div>
                                        <input className="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-red-800 transition-colors" placeholder="000" type="text" />
                                    </div>
                                </div>
                                <div>
                                    <button className="block w-full max-w-xs mx-auto bg-red-800 hover:bg-red-900 focus:bg-red-900 text-white rounded-lg px-3 py-3 font-semibold"
                                            onClick={submitGuestInfo}>
                                        <i className="mdi mdi-lock-outline mr-1"></i> Confirm
                                    </button>
                                </div>
                            </div>
                        </div>

                        
                    
                </div>
            </div>    
        );
    }

export default GuestInfo;
