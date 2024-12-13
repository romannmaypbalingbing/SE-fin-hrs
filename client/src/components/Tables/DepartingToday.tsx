import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

interface Reservation {
  resID: string;
  guest: string;
  rooms: string; // Comma-separated room IDs
  checkin: string;
  checkout: string;
}

const TableOne: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        // Fetch reservations starting today
        const { data: reservationData, error: reservationError } = await supabase
          .from('reservation')
          .select(`res_id, check_in_date, check_out_date`)
          .eq('check_out_date', today);

        if (reservationError) {
          console.error('Error fetching reservations:', reservationError);
          return;
        }

        if (!reservationData || reservationData.length === 0) {
          console.log('No reservations starting today.');
          setReservations([]);
          return;
        }

        // Fetch related reservor names and room IDs for each reservation
        const reservationsWithDetails = await Promise.all(
          reservationData.map(async (reservation) => {
            const { res_id, check_in_date, check_out_date } = reservation;

            // Fetch reservor name
            const { data: guestData, error: guestError } = await supabase
              .from('guests_info')
              .select(`guest_firstname, guest_lastname`)
              .eq('res_id', res_id)
              .eq('isReservor', true)
              .single();

            if (guestError) {
              console.error(`Error fetching guest name for res_id ${res_id}:`, guestError);
            }

            const reservorName = guestData
              ? `${guestData.guest_firstname} ${guestData.guest_lastname}`
              : 'Unknown';

              console.log(res_id, reservorName);
            // Fetch reserved room IDs
            const { data: roomData, error: roomError } = await supabase
              .from('reserved_room')
              .select('room_id')
              .eq('res_id', res_id);

            if (roomError) {
              console.error(`Error fetching rooms for res_id ${res_id}:`, roomError);
            }

            const roomIDs = roomData ? roomData.map((room) => room.room_id).join(', ') : 'None';

            // Construct the final reservation object
            return {
              resID: res_id,
              guest: reservorName,
              rooms: roomIDs,
              checkin: check_in_date,
              checkout: check_out_date,
            };
          })
        );

        setReservations(reservationsWithDetails);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Departing Today
      </h4>

      <div className="flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">RES ID</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">CUSTOMER</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">ROOMS</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">CHECK-IN</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">CHECK-OUT</h5>
          </div>
        </div>

        {/* Table Rows */}
        {reservations.length > 0 ? (
          reservations.map((reservation, index) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                index === reservations.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
              }`}
              key={reservation.resID}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black text-sm dark:text-white">{reservation.resID}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black text-sm dark:text-white">{reservation.guest}</p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black text-sm dark:text-white">{reservation.rooms}</p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-meta-5 text-sm">{reservation.checkin}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-meta-5 text-sm">{reservation.checkout}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-5 text-center">
            <p className="text-black text-sm dark:text-white">No reservations arriving today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableOne;
