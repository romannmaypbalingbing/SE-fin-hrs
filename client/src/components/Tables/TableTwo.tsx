import { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import ProductOne from '../../images/product/product-01.png';

interface Room {
  // image: string;
  name: string;
  type: string;
  price: number;
  status: string;
  reservor: string;
}

const TableTwo = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('room')
        .select('*');

        if (error) {
          throw new Error(error.message);
        }
        console.log(data);

        setRooms(data as Room[]);

    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);
  console.log(rooms);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Rooms
        </h4>
      </div>
      <div className="text-xl font-semibold text-black dark:text-white">
          {/* <img src={} alt="Product" /> */}
        </div>

      
      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Image</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Sold</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Profit</p>
        </div>
      </div>
      
      
      {rooms.map((room, index) => (
        <div
          className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={index}
        >
          <div className="col-span-2 flex items-center">
            <div className="h-12.5 w-15 rounded-md">
              <img src={ ProductOne} alt={room.name} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{room.name}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{room.type}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">${room.price}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{room.status}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{room.reservor}</p>
          </div>
        </div>
      ))}

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default TableTwo;
