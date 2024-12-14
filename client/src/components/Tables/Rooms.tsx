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
  roomtype_id: number;
  roomtype_name: string;
  roomtype_totalrooms: number;
  roomtype_price: number;
  roomtype_capacity: string;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [filteredRoomType, setFilteredRoomType] = useState<number | null>(null); // State for filtering by room type
  const [filteredRoomStatus, setFilteredRoomStatus] = useState<string | null>(null); // State for filtering by room status
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchRoomTypes();
      await fetchRooms();
    };
    fetchData();
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

  // const calculateStayDuration = (checkoutDate: string) => {
  //   const today = new Date();
  //   const checkout = new Date(checkoutDate);
  //   const diffTime = checkout.getTime() - today.getTime();
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays <= 0 ? 'Checks out today' : `${diffDays} days left`;
  // };

  const handleViewDetails = (roomId: number) => {
    console.log(`View details for room ${roomId}`);
  };

  // Filter the rooms based on the selected room type and room status
  const filteredRooms = rooms.filter((room) => {
    const isRoomTypeMatch = filteredRoomType ? room.roomtype_id === filteredRoomType : true;
    const isRoomStatusMatch = filteredRoomStatus ? room.room_status === filteredRoomStatus : true;
    return isRoomTypeMatch && isRoomStatusMatch;
  });

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (roomTypes.length === 0) {
    return <p className="text-gray-500">No room types available</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Filter Dropdowns in one row */}
      <div className="py-3 px-3 flex space-x-4">
        <div>
          <label htmlFor="roomTypeFilter" className="mr-2 text-lg font-semibold">
            Room Type:
          </label>
          <select
            id="roomTypeFilter"
            value={filteredRoomType || ''}
            onChange={(e) => setFilteredRoomType(Number(e.target.value) || null)}
            className="py-1 px-2 text-sm border rounded-md"
          >
            <option value="">All Room Types</option>
            {roomTypes.map((roomType) => (
              <option key={roomType.roomtype_id} value={roomType.roomtype_id}>
                {roomType.roomtype_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="roomStatusFilter" className="mr-2 text-lg font-semibold">
            Room Status:
          </label>
          <select
            id="roomStatusFilter"
            value={filteredRoomStatus || ''}
            onChange={(e) => setFilteredRoomStatus(e.target.value || null)}
            className="py-1 px-2 text-sm border rounded-md"
          >
            <option value="">All Room Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            {/* <option value="occupied">Occupied</option> */}
          </select>
        </div>
      </div>

      {/* Room List */}
      {roomTypes.map((roomType) => {
        // Only display rooms of the selected type if filtering is applied
        const roomsOfType = filteredRooms.filter((room) => room.roomtype_id === roomType.roomtype_id);

        // Only render the room type name when showing all room types, or when it's the selected filter type
        if (filteredRoomType === null || filteredRoomType === roomType.roomtype_id) {
          return (
            <div key={roomType.roomtype_id}>
              {(filteredRoomType === null || filteredRoomType === roomType.roomtype_id) && (
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white dark:bg-slate-500 py-3 px-3">
                  {roomType.roomtype_name}
                </h4>
              )}

              {/* Table Header */}
              <div className="grid grid-cols-6 border-t border-b bg-slate-200 border-stroke drop-shadow-sm py-2.5 px-4 font-semibold text-black dark:text-slate-300 dark:bg-slate-600 sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-2">Room Type</div>
                <div className="col-span-2">Room ID</div>
                <div className="col-span-2">Room Status</div>
              </div>

              {roomsOfType.length > 0 ? (
                roomsOfType.map((room) => (
                  <div
                    key={room.room_id}
                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                  >
                    <div className="col-span-2 flex items-center">{roomType.roomtype_name}</div>
                    <div className="col-span-2 flex items-center">{room.room_id}</div>
                    <div className="col-span-2 flex items-center">{room.room_status}</div>

                    <div className="col-span-2 flex items-center">
                      <button onClick={() => handleViewDetails(room.room_id)}
                              className="px-4 py-2 text-sm text-slate-700 italic dark:text-slate-500 hover:text-red-800">
                        view details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 p-5">No rooms available</p>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Rooms;
