import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaUser, FaTimes } from 'react-icons/fa';

const SidebarComponent = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Beranda & Laporan', path: '/', icon: <FaHome /> },
    { label: 'Direktori Pengguna', path: '/users', icon: <FaUsers /> },
    { label: 'Profil Saya', path: '/profile', icon: <FaUser /> },
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose} 
          aria-hidden="true"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity" 
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="font-bold text-gray-800">Menu Navigasi</span>
          {/* ARIA-LABEL DITAMBAHKAN */}
          <button 
            onClick={onClose} 
            aria-label="Tutup navigasi samping"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* ARIA-LABEL PADA NAV */}
        <nav aria-label="Menu Utama" className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-lg mr-3" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SidebarComponent;