import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import marisonlogo from "../assets/MARISON-LOGO.png";
import qrplaceholder from "../../public/qr-placeholder.png";
import supabase from "../supabaseClient";

interface Room {
  name: string;
  qty: number;
  total: number;
}

const ReceiptCard: React.FC = () => {
  const location = useLocation();
  const { res_id, selectedRooms, checkInDate, checkOutDate, stayDuration, subtotal, discount, reservor } = location.state as {
    res_id: string;
    selectedRooms: { room: { roomtype_name: string, roomtype_price: string }, quantity: number }[];
    checkInDate: string;
    checkOutDate: string;
    stayDuration: string;
    subtotal: number;
    discount: number;
    reservor: string;
  } || {};
  
  const [booking_id, setBookingId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const insertBookingData = async () => {
      const { data: bookingData, error: bookingError } = await supabase
        .from("booking")
        .insert([
          {
            res_id: res_id,
            booking_status: "confirmed",
          },
        ])
        .select("booking_id");

      if (bookingError) {
        console.error("Error inserting booking data:", bookingError);
        setError("Failed to retrieve booking details.");
      } else {
        console.log("Booking data inserted successfully:", bookingData);
        setBookingId(bookingData[0]?.booking_id || null);
      }
    };

    insertBookingData();
  }, [res_id]);

  console.log(res_id, selectedRooms, checkInDate, checkOutDate, stayDuration, subtotal, discount, reservor);


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
            <span>{booking_id}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500 font-mono">Stay Duration:</span>
            <span>{stayDuration}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500 font-mono">Guest:</span>
            <span>{reservor}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 pb-6 pt-2 text-xs">
        <table className="w-full text-left">
  <thead>
    <tr className="flex">
      <th className="w-full py-2 italic text-slate-600">
        Reservations and Services Availed
      </th>
      <th className="min-w-[44px] py-2 text-right">QTY</th>
      {/* <th className="min-w-[44px] py-2">Total</th> */}
    </tr>
  </thead>
  <tbody>
    {selectedRooms.map(({ room, quantity }, index) => (
      <tr key={index}>
        <td className="py-2">{room.roomtype_name}</td>
        <td className="py-2 text-center">{quantity}</td>
        {/* <td className="py-2 text-center">{room.roomtype_price}</td> */}
      </tr>
    ))}
  </tbody>
</table>
<div className="border-b border-dashed"></div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-mono ">Subtotal:</span>
            <span className="text-black text-lg font-bold">PHP {(subtotal-(subtotal*discount))}</span>
          </div>

          <div className="border-b border-dashed"></div>
          <div className="justify-center items-center flex flex-col gap-2">
            <p className="flex gap-2 w-20 h-20">
              <img src={qrplaceholder} alt="QR Code" />
            </p>
            <p className="flex gap-2">bookings@themarisonhotel.com</p>
            <p className="flex gap-2">tel: (052) 732-7777</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
