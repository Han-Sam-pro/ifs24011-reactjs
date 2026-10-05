import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaSearchLocation, FaUserCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { isAuthLogout } from '../../../states/auth/authSlice';

const NavbarComponent = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          <FaBars className="text-xl" />
        </button>
        <Link to="/" className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
          <FaSearchLocation className="text-2xl" />
          <span className="hidden sm:inline">Delcom Lost & Found</span>
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
        >
          {profile?.photo ? (
            <img src={profile.photo} alt={profile?.name} className="w-8 h-8 rounded-full object-cover border" />
          ) : (
            <FaUserCircle className="text-2xl text-gray-400" />
          )}
          <span className="hidden md:inline text-sm font-medium text-gray-700">{profile?.name || 'Pengguna'}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-400">Masuk sebagai</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{profile?.email}</p>
            </div>
            <Link
              to="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FaUserCircle className="mr-2 text-gray-400" /> Profil Saya
            </Link>
            <button
              onClick={() => {
                setDropdownOpen(false);
                dispatch(isAuthLogout());
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
            >
              <FaSignOutAlt className="mr-2 text-red-400" /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavbarComponent;