import React, { useEffect, useState } from "react";
import marisonlogo from "../assets/MARISON-LOGO.png";
import qrplaceholder from "../../public/qr-placeholder.png";
import supabase from "../supabaseClient";

interface Room {
  name: string;
  qty: number;
  total: string;
}

interface BookingDetails {
  bookingNo: string;
  stayDuration: string;
  guestName: string;
  rooms: Room[];
  contact: { email: string; phone: string };
}

const ReceiptCard: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("booking")
          .select(
            `
              booking_no,
              check_in,
              check_out,
              guest_name,
              rooms:room_details (
                name,
                qty,
                total
              ),
              contact:contact_info (
                email,
                phone
              )
            `
          )
          .eq("id", 1) // Replace with the appropriate condition
          .single();

        if (error) throw error;

        // Format data
        if (data) {
          setBookingDetails({
            bookingNo: data.booking_no,
            stayDuration: `${data.check_in} - ${data.check_out}`,
            guestName: data.guest_name,
            rooms: data.rooms,
            contact: data.contact,
          });
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-600">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-600">
        <p className="text-white">Failed to load booking details.</p>
      </div>
    );
  }

  const { bookingNo, stayDuration, guestName, rooms, contact } =
    bookingDetails;

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-600">
      <div className="w-80 rounded bg-gray-50 px-6 pt-4 shadow-lg">
        <img
          src={marisonlogo}
          alt="Marison Logo"
          className="mx-auto w-36 mt-8"
        />
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="w-full border-t mt-4 border-red-900 opacity-50"></div>
          <p className="text-xs italic text-slate-500">
            Corner Imelda Roces Ave, Legazpi City, Albay
          </p>
        </div>
        <div className="flex flex-col gap-3 border-b py-6 text-xs">
          <p className="flex justify-between">
            <span className="text-gray-500 font-mono">Booking no.:</span>
            <span>{bookingNo}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500 font-mono">Stay Duration:</span>
            <span>{stayDuration}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500 font-mono">Guest:</span>
            <span>{guestName}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 pb-6 pt-2 text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="flex">
                <th className="w-full py-2 italic text-slate-600">
                  Reservations and Services Availed
                </th>
                <th className="min-w-[44px] py-2">QTY</th>
                <th className="min-w-[44px] py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr className="flex" key={index}>
                  <td className="flex-1 py-1">{room.name}</td>
                  <td className="min-w-[44px] text-center">{room.qty}</td>
                  <td className="min-w-[44px]">{room.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-b border-dashed"></div>
          <div className="justify-center items-center flex flex-col gap-2">
            <p className="flex gap-2 w-20 h-20">
              <img src={qrplaceholder} alt="QR Code" />
            </p>
            <p className="flex gap-2">{contact.email}</p>
            <p className="flex gap-2">{contact.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
