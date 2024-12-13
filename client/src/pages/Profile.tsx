import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

interface Booking {
  id: string;
  name: string;
  room: string;
  number: string;
  checkIn: string;
  checkOut: string;
  guest: string;
  status: string;
}

const BookingTable: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filters, setFilters] = useState({
    date: "",
    room: "",
    guestName: "",
    resStatus: "",
    checkIn: false,
    checkOut: false,
  });

  // Fetch data from Supabase
  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*");
      
    if (error) {
      console.error("Error fetching bookings", error);
    } else {
      console.log("Fetched bookings:", data);
      setBookings(data as Booking[]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRowClick = (id: string) => {
    navigate(`/employee/edit-booking/${id}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = (booking: Booking) => {
    if (filters.date && !(booking.checkIn.includes(filters.date) || booking.checkOut.includes(filters.date))) {
      return false;
    }
    if (filters.room && booking.room !== filters.room) {
      return false;
    }
    if (filters.guestName && !booking.name.toLowerCase().includes(filters.guestName.toLowerCase())) {
      return false;
    }
    if (filters.resStatus && booking.status !== filters.resStatus) {
      return false;
    }
    return true;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Guest</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded">Daily</button>
          <button className="px-4 py-2 text-sm bg-gray-200 text-gray-600 rounded">Monthly</button>
          <button
            className="px-4 py-2 text-sm bg-red-800 text-white rounded"
            onClick={() => navigate("/employee/create-booking")}
          >
            + Create new booking
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow mb-6">
        <input
          type="date"
          className="border p-2 rounded text-gray-600 text-sm"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            className="text-gray-600"
            name="checkIn"
            checked={filters.checkIn}
            onChange={() =>
              setFilters({ ...filters, checkIn: !filters.checkIn })
            }
          />
          <span>Check-In</span>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            className="text-gray-600"
            name="checkOut"
            checked={filters.checkOut}
            onChange={() =>
              setFilters({ ...filters, checkOut: !filters.checkOut })
            }
          />
          <span>Check-Out</span>
        </div>
        <select
          className="border p-2 rounded text-sm text-gray-600"
          name="room"
          value={filters.room}
          onChange={handleFilterChange}
        >
          <option value="">Select Room Type</option>
          <option>Deluxe King</option>
          <option>Marison Suite</option>
        </select>
        <input
          type="text"
          placeholder="Guest Name"
          className="border p-2 rounded text-sm text-gray-600"
          name="guestName"
          value={filters.guestName}
          onChange={handleFilterChange}
        />
        <select
          className="border p-2 rounded text-sm text-gray-600"
          name="resStatus"
          value={filters.resStatus}
          onChange={handleFilterChange}
        >
          <option value="">Status</option>
          <option>Reserved</option>
          <option>Checked In</option>
        </select>
      </div>

      {/* Booking Table */}
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-left text-sm text-gray-600">
            <th className="p-4">Book ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Room</th>
            <th className="p-4">No.</th>
            <th className="p-4">Check In</th>
            <th className="p-4">Check Out</th>
            <th className="p-4">Guest</th>
            <th className="p-4">Res. Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.filter(applyFilters).map((booking) => (
            <tr
              key={booking.id}
              className="hover:bg-gray-50 border-b last:border-none text-sm text-gray-700 cursor-pointer"
              onClick={() => handleRowClick(booking.id)}
            >
              <td className="p-4">{booking.id}</td>
              <td className="p-4">{booking.name}</td>
              <td className="p-4">{booking.room}</td>
              <td className="p-4">{booking.number}</td>
              <td className="p-4">{booking.checkIn}</td>
              <td className="p-4">{booking.checkOut}</td>
              <td className="p-4">{booking.guest}</td>
              <td className="p-4">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
