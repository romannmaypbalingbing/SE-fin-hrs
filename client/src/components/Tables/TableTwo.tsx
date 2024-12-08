import { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import ProductOne from '../../images/product/product-01.png';

// Interfaces
interface Room {
  room_id: number;
  roomtype_id: number;
  room_status: string;
  reservor?: string;
}

interface RoomType {
  id: number;
  type: string;
}

const TableTwo = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch Room Types
  const fetchRoomTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('room_type')
        .select('*');

      if (error) {
        console.error('Error fetching room types:', error);
        setError('Error fetching room types');
      }

      setRoomTypes(data as RoomType[]);
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('Unexpected error');
    }
  };
  console.log(roomTypes);

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('room')
        .select('*');

      if (error) {
        console.error('Error fetching rooms:', error);
        setError('Error fetching rooms');
      }

      setRooms(data as Room[]);
    } catch (error) {
      console.error('Unexpected error fetching rooms:', error);
      setError('Unexpected error');
    }
  };

  useEffect(() => {
    fetchRoomTypes();
    fetchRooms();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">Room Information</h4>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Room No.</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Room Type</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Status</p>
        </div>
      </div>

      {rooms.map((room) => (
        <div
          key={room.room_id}
          className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
        >
          <div className="col-span-2 flex items-center">
            <div className="h-12.5 w-15 rounded-md">
              <p>
                
                {`${room.room_id}`}
                
              </p>
            </div>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {room.roomtype_id}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{room.room_status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;
