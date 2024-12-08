import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

interface Reservation {
  resID: string;
  guest: string;
  rooms: string;
  checkin: string;
  checkout: string;
}

const DepartingToday = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // Get today’s date in YYYY-MM-DD format
        const { data, error } = await supabase
          .from('reservation')
          .select(`
            res_id,
            check_in_date,
            check_out_date,
            room_id,
            reservor_name
          `)
          .match({ check_out_date: today }); // Match using the actual database column name
  
        if (error) {
          console.error('Error fetching reservation data:', error);
          return;
        }
  
        if (data) {
          // Map Supabase response to fit the Reservation interface
          const mappedData: Reservation[] = data.map((item) => ({
            resID: item.res_id,
            guest: item.reservor_name,
            rooms: item.room_id,
            checkin: item.check_in_date,
            checkout: item.check_out_date,
          }));
          setReservations(mappedData);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };
  
    fetchReservations();
  }, []);

  console.log(reservations);
  

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Departing Today
      </h4>

      <div className="flex flex-col">
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
            <h5 className="text-sm font-medium uppercase xsm:text-sm">CHECKIN</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">CHECKOUT</h5>
          </div>
        </div>

        {reservations.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === reservations.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black text-sm dark:text-white sm:block">
                {brand.resID}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black text-sm dark:text-white">{brand.guest}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black text-sm dark:text-white">{brand.rooms}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5 text-sm">{brand.checkin}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5 text-sm">{brand.checkout}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartingToday;
