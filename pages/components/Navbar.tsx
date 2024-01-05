import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logout successfully');
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 p-5 md:flex md:items-center md:justify-between w-full">
      <div className="flex items-center justify-between w-full">
        <span className="text-2xl text-white font-primary font-semibold cursor-pointer">
          EVENTLY
        </span>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none w-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        > 
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:hidden mt-4 space-y-4`}
      >
        {user ? (
          <>
            {user.profilePictureUrl && (
              <div>
                <img
                  src={user.profilePictureUrl}
                  alt="Profile"
                  className="rounded-full h-8 w-8 object-cover"
                />
              </div>
            )}
            <button
              className="bg-white text-primary rounded-md duration-500 px-6"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="bg-white text-primary rounded-md duration-500 px-6"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>
        ) : (
          <>
            <button className="bg-cyan-700 text-white duration-500 px-6 rounded-md">
              <Link href="/signup">Signup</Link>
            </button>

            <button className="bg-cyan-700 text-white duration-500 px-6 rounded-md">
              <Link href="/login">Login</Link>
            </button>
          </>
        )}
      </div>

      {/* Desktop menu */}
      <div className="md:flex md:items-center md:justify-between space-x-4">
        {user ? (
          <>
            {user.profilePictureUrl && (
              <div className="hidden md:block">
                <img
                  src={user.profilePictureUrl}
                  alt="Profile"
                  className="rounded-full h-8 w-8 object-cover"
                />
              </div>
            )}
            <Link href="/dashboard">
            <button
              className="hidden md:block bg-white text-primary rounded-md duration-500 px-6"
              
            >
              Dashboard
            </button>
            </Link>
            <button
              className="hidden md:block bg-white text-primary rounded-md duration-500 px-6"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="hidden md:block bg-cyan-700 text-white duration-500 px-6 rounded-md">
              <Link href="/signup">Signup</Link>
            </button>

            <button className="hidden md:block bg-cyan-700 text-white duration-500 px-6 rounded-md">
              <Link href="/login">Login</Link>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;