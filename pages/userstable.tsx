import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';

const UserTable = () => {
  const [userList, setUserList] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const totalPages = Math.ceil(userList.length / ITEMS_PER_PAGE);
  const indexOfLastUser = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = async (collectionName: any, setDataFunction: any) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data: any = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setDataFunction(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(`Error fetching data from ${collectionName}`);
    }
  };

  useEffect(() => {
    fetchData('users', setUserList);
  }, []);

  const handleUsersLinkClick = () => {
    // Display a toast message indicating the user is already on the page
    toast.error('You are already on this page');
    

  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-gray-900  p-3 md:flex md:justify-between relative min-h-screen">
        <ul className="md:items-center space-x-2">
          <li className="mx-2 mb-4">
            <Link href="/userstable" className="text-lg text-white hover:text-cyan-100 duration-500" onClick={handleUsersLinkClick}>
              Users
            </Link>
          </li>
          <li className="mx-4 mb-4">
            <Link href="/eventable" className="text-lg text-white hover:text-cyan-100 duration-500">
              Events
            </Link>
          </li>
        </ul>
      </div>

      <div className="container mx-auto p-4 ">
        <div className="absolute top-4 right-4 mt-16 mr-4">
          <button
            type="button"
            className="bg-cyan-700 text-white duration-500 px-4 mt-3 rounded-md space-y-0.5"
            onClick={() => {
              // Handle button click action
              router.push('/registerform');
            }}
          >
            Add User
          </button>
        </div>
        {/* User Table */}
        <h1 className="text-2xl font-bold mb-4">User Table</h1>

        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-[#A0E9FF]" id="usertable">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Event Type</th>
              <th className="py-2 px-4 border-b text-left ">Phone Number</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Country</th>
              <th className="py-2 px-4 border-b text-left">State</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user: any) => (
              <tr className="hover:bg-[#A0E9FF] cursor-pointer" key={user.id}>
                <td className="py-2 px-4 border-b ">{user.userName}</td>
                <td className="py-2 px-4 border-b ">{user.eventType}</td>
                <td className="py-2 px-4 border-b ">{user.phoneNumber}</td>
                <td className="py-2 px-4 border-b ">{user.email}</td>
                <td className="py-2 px-4 border-b ">{user.country}</td>
                <td className="py-2 px-4 border-b ">{user.state}</td>
              </tr>
            ))}
          </tbody>
        </table>

        
        {totalPages > 1 && (
  <div className="flex justify-center mt-4 hover:border-l-sky-600">
    <ReactPaginate
      previousLabel={<span className="bg-cyan-700 text-white px-2 py-1 rounded cursor-pointer">Previous</span>}
      nextLabel={<span className="bg-cyan-700 text-white px-2 py-1 rounded cursor-pointer">Next</span>}
      breakLabel={'...'}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={'pagination'}
      activeClassName={'active'}
      previousClassName={'pagination-previous'}
      nextClassName={'pagination-next'}
      pageClassName={'pagination-page'}
    />
  </div>
)}




        {/* Back button */}
        <Link href="/dashboard">
          <button type="submit" className="bg-cyan-700 text-white duration-500 mt-4 px-4 rounded-md">
            Back
          </button>
        </Link>
      </div> 
    </div>
  );
};

export default UserTable;
