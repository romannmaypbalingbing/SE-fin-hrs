import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

interface Booking {
  id: string;
  rooms: string[]; // Array of reserved room IDs
  guest: string; // Guest full name
  checkIn: string;
  checkOut: string;
  status: string; // Reservation status
}

const BookingTable: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filters, setFilters] = useState({
    date: "",
    guestName: "",
    resStatus: "",
  });

  const fetchBookings = async () => {
    const { data: bookingData, error: bookingError } = await supabase.from("booking").select("res_id");

    if (bookingError) {
      console.error("Error fetching booking data:", bookingError);
      return;
    }

    if (bookingData) {
      const formattedBookings: Booking[] = [];

      for (const booking of bookingData) {
        const { res_id } = booking;

        // Fetch reservation details
        const { data: reservationData, error: reservationError } = await supabase
          .from("reservation")
          .select("check_in_date, check_out_date, res_status")
          .eq("res_id", res_id)
          .single();

        if (reservationError) {
          console.error("Error fetching reservation data:", reservationError);
          continue;
        }

        // Fetch reserved rooms
        const { data: reservedRoomsData, error: reservedRoomsError } = await supabase
          .from("reserved_room")
          .select("room_id")
          .eq("res_id", res_id);

        if (reservedRoomsError) {
          console.error("Error fetching reserved rooms data:", reservedRoomsError);
          continue;
        }

        const rooms = reservedRoomsData?.map((room) => room.room_id) || ["Unknown"];

        // Fetch guest details where isReservor = true
        const { data: guestData, error: guestError } = await supabase
          .from("guests_info")
          .select("guest_firstname, guest_lastname")
          .eq("res_id", res_id)
          .eq("isReservor", true)
          .single();

        if (guestError) {
          console.error("Error fetching guest data:", guestError);
          continue;
        }

        const guestFullName = guestData
          ? `${guestData.guest_firstname || ""} ${guestData.guest_lastname || ""}`.trim()
          : "Unknown";

        // Add to formatted bookings
        formattedBookings.push({
          id: res_id,
          rooms,
          guest: guestFullName,
          checkIn: reservationData.check_in_date,
          checkOut: reservationData.check_out_date,
          status: reservationData.res_status,
        });
      }

      setBookings(formattedBookings);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // const handleRowClick = (id: string) => {
  //   navigate(`/employee/edit-booking/${id}`);
  // };

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
    if (filters.guestName && !booking.guest.toLowerCase().includes(filters.guestName.toLowerCase())) {
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
        <h1 className="text-xl font-semibold">Bookings</h1>
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
          <option>pending</option>
          <option>confirmed</option>
        </select>
      </div>

      {/* Booking Table */}
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-left text-sm text-gray-600">
            <th className="p-4">Book ID</th>
            <th className="p-4">Rooms</th>
            <th className="p-4">Guest</th>
            <th className="p-4">Check In</th>
            <th className="p-4">Check Out</th>
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
              <td className="p-4">{booking.rooms.join(", ")}</td>
              <td className="p-4">{booking.guest}</td>
              <td className="p-4">{booking.checkIn}</td>
              <td className="p-4">{booking.checkOut}</td>
              <td className="p-4">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
