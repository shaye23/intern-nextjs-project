import React from 'react'
import Link from 'next/link';
const Sidebar = () => {
  return (
    <div className='flex'>
    <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-gray-900  p-3 md:flex md:justify-between min-h-screen relative">
    <ul className="md:items-center space-x-2">
      <li className="mx-2 mb-4">
        <Link href="/userstable" className="text-lg text-white hover:text-cyan-100 duration-500">
          Users
        </Link>
      </li>
      <li className="mx-4 mb-4">
        <Link href="/eventable" className="text-lg text-white hover:text-cyan-100 duration-500" >
          Events
        </Link>
      </li>
    </ul>
  </div>
  </div>
  )
}

export default Sidebar;