import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';


const EventTable = () => {
  const [eventList, setEventList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const totalPages = Math.ceil(eventList.length / ITEMS_PER_PAGE);
  const indexOfLastUser = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = eventList.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected + 1);
  };

  const fetchData = async (collectionName:any, setDataFunction:any) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data :any= [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setDataFunction(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(`Error fetching data from ${collectionName}`);
    }
  };

  const handleEventClick = (eventType:any,id:any) => {
    console.log('eventtype', eventType);
    // Navigate to Fulldetails page with eventType as a query parameter
    router.push({
      pathname: '/fulldetails',
      query: { eventType,id },
    });
  };

  useEffect(() => {
    fetchData('eventuser', setEventList);
  }, []); // Empty dependency array to fetch data on component mount
  const handleUsersLinkClick = () => {
    // Display a toast message indicating the user is already on the page
    toast.error('You are already in this page');
  };


  return (
    
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-gray-900  p-3 md:flex md:justify-between min-h-screen relative">
        <ul className="md:items-center space-x-2">
          <li className="mx-2 mb-4">
            <Link href="/userstable" className="text-lg text-white hover:text-cyan-100 duration-500">
              Users
            </Link>
          </li>
          <li className="mx-4 mb-4">
            <Link href="/eventable" className="text-lg text-white hover:text-cyan-100 duration-500" onClick={handleUsersLinkClick}>
              Events
            </Link>
          </li>
        </ul>
      </div>
      <div className="h-screen bg-gradient-to-br from-pink-300 to-blue-300 animate-gradient"></div>
      <div className="container mx-auto p-4">
      <div className="absolute top-4 right-4 mt-16 mr-4">
          <button
            type="button"
            className="bg-cyan-700 text-white duration-500 px-4 mt-3 rounded-md  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#E0AED0]"
            onClick={() => {
              // Handle button click action
              router.push('/eventform');
            }}
          >
            Add event
          </button>
        </div>
        {/* Event Table*/}
        <div className=''>
        <h1 className="text-2xl font-bold mb-4 space-x-2 py-4s">Event Table</h1>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-[#A0E9FF]">
              <th className="py-2 px-4 border-b text-left">Event Name</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Time</th>
              <th className="py-2 px-4 border-b text-left">Venue</th>
              <th className="py-2 px-4 border-b text-left">Contact</th>
              <th className="py-2 px-4 border-b  text-left">Event Type</th>
              <th className="py-2 px-4 border-b text-left">Amount</th>
            
              {/* Add other event table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {eventList.map((event:any) => (
              <tr className="hover:bg-[#A0E9FF]"  key={event.id} onClick={() => handleEventClick(event.eventType,event.id)}>
                <td className="py-2 px-4 border-b ">{event.eventName.toUpperCase()}</td>
                <td className="py-2 px-4 border-b ">{event.date}</td>
                <td className="py-2 px-4 border-b ">{event.time}</td>
                <td className="py-2 px-4 border-b ">{event.venue}</td>
                <td className="py-2 px-4 border-b ">{event.contact}</td>
                <td className="py-2 px-4 border-b">
                  {event.eventType.map((type:any, index:any) => (
                    <span key={index}>{type}<br/></span>
                  ))}
                </td>
                <td className="py-2 px-4 border-b text-center">{event.approxamount}</td>
                {/* Add other event table columns as needed */}
              </tr>
            ))}
          </tbody>

        </table>
        </div>
        {totalPages > 1 && (
  <div className="flex justify-center mt-4">
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={'pagination'}
    //  activeClassName={'text-blue-500 font-bold'}
    activeClassName={'bg-blue-500 text-white'}
      previousClassName={'pagination-previous'}
      nextClassName={'pagination-next'}
      pageClassName={'pagination-page'}
    />
  </div>
)}
        <div className="mb-4">
          <p className="text-gray-600">
            Total Users: <span className="font-bold">{eventList.length}</span>
          </p>
        </div> 

        <Link href="/dashboard">
     <button type="submit" className="bg-cyan-700 text-white duration-500 mt-4 rounded-md  px-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#E0AED0]">Back</button>
     </Link>
       
      </div>
       
    </div>

  );
};

export default EventTable;