'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaChartLine, FaSearch, FaCog } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                MF Portfolio Tracker
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium"
              >
                <FaChartLine className="mr-2" />
                Dashboard
              </Link>
              <Link 
                href="/funds" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <FaSearch className="mr-2" />
                Explore Funds
              </Link>
              <Link 
                href="/settings" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <FaCog className="mr-2" />
                Settings
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className="bg-blue-50 border-blue-500 text-blue-700 flex pl-3 pr-4 py-2 border-l-4 text-base font-medium items-center"
          >
            <FaChartLine className="mr-2" />
            Dashboard
          </Link>
          <Link 
            href="/funds" 
            className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 flex pl-3 pr-4 py-2 border-l-4 text-base font-medium items-center"
          >
            <FaSearch className="mr-2" />
            Explore Funds
          </Link>
          <Link 
            href="/settings" 
            className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 flex pl-3 pr-4 py-2 border-l-4 text-base font-medium items-center"
          >
            <FaCog className="mr-2" />
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
} 