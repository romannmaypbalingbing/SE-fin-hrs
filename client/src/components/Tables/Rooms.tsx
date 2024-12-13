import { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

interface Room {
  room_id: number;
  roomtype_id: number;
  room_status: string;
  reservor?: string;
  checkout_date?: string;
}

interface RoomType {
  id: number;
  type: string;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoomTypes();
    fetchRooms();
  }, []);

  const fetchRoomTypes = async () => {
  const { data, error } = await supabase.from('room_type').select('*');
  if (error) {
    console.error('Error fetching room types:', error);
    setError('Error fetching room types');
  } else {
    console.log('Room types fetched:', data); // Confirm data structure
    setRoomTypes(data as RoomType[]);
  }
};

const fetchRooms = async () => {
  const { data, error } = await supabase.from('room').select('*');
  if (error) {
    console.error('Error fetching rooms:', error);
    setError('Error fetching rooms');
  } else {
    console.log('Rooms fetched:', data); // Confirm data structure
    setRooms(data as Room[]);
  }
};


  const calculateStayDuration = (checkoutDate: string) => {
    const today = new Date();
    const checkout = new Date(checkoutDate);
    const diffTime = checkout.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 0 ? 'Checks out today' : `${diffDays} days left`;
  };

  const handleViewDetails = (roomId: number) => {
    console.log(`View details for room ${roomId}`);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (roomTypes.length === 0) {
    return <p className="text-gray-500">No room types available</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {roomTypes.map((roomType) => (
        <div key="{roomType.id}">
          <h4 className="text-xl font-semibold text-black dark:text-white">{roomType.type}</h4>
          {rooms
            .filter((room) => room.roomtype_id === roomType.id)
            .map((room) => (
              <div
                key={room.room_id}
                className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
              >
                <div className="col-span-2 flex items-center">{room.room_id}</div>
                <div className="col-span-2 flex items-center">{room.reservor || "No reservor"}</div>
                <div className="col-span-2 flex items-center">{room.room_status}</div>
                <div className="col-span-2 flex items-center">
                  {room.checkout_date
                    ? calculateStayDuration(room.checkout_date)
                    : "No checkout date"}
                </div>
                <div className="col-span-2 flex items-center">
                  <button onClick={() => handleViewDetails(room.room_id)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Rooms;