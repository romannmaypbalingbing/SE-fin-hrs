import React from "react";
import { useNavigate } from "react-router-dom";

const BookingTable: React.FC = () => {
  const navigate = useNavigate();

  const bookings = [
    {
      id: "54fss5d4fs3",
      name: "Boyd Briggs",
      room: "Deluxe King",
      number: "131",
      checkIn: "5 Jan 2024",
      checkOut: "7 Jan 2024",
      guest: "1 Person",
      status: "Reserved",
    },
    {
      id: "5as5sd4g8a",
      name: "Emily Wilson",
      room: "Marison Suite",
      number: "079",
      checkIn: "Dec 9 2024",
      checkOut: "8 Dec 2024",
      guest: "2 Persons",
      status: "Checked In",
    },
  ];

  const handleCreateBooking = () => {
    navigate("/employee/create-booking");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Guest</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded">
            Daily
          </button>
          <button className="px-4 py-2 text-sm bg-gray-200 text-gray-600 rounded">
            Monthly
          </button>
          <button
            className="px-4 py-2 text-sm bg-red-800 text-white rounded"
            onClick={handleCreateBooking}
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
        />
        <select className="border p-2 rounded text-sm text-gray-600">
          <option>Room</option>
          <option>Deluxe</option>
          <option>King</option>
        </select>
        <input
          type="text"
          placeholder="Guest Name"
          className="border p-2 rounded text-sm text-gray-600"
        />
        <select className="border p-2 rounded text-sm text-gray-600">
          <option>Res. Status</option>
          <option>In house</option>
          <option>Departed</option>
          <option>Due out</option>
        </select>
      </div>

      {/* Table */}
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
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="hover:bg-gray-50 border-b last:border-none text-sm text-gray-700"
            >
              <td className="p-4">{booking.id}</td>
              <td className="p-4">{booking.name}</td>
              <td className="p-4">{booking.room}</td>
              <td className="p-4">{booking.number}</td>
              <td className="p-4">{booking.checkIn}</td>
              <td className="p-4">{booking.checkOut}</td>
              <td className="p-4">{booking.guest}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    booking.status === "In house"
                      ? "bg-green-500"
                      : booking.status === "Departed"
                      ? "bg-gray-500"
                      : "bg-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
