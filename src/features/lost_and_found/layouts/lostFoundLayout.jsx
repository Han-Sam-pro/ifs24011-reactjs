import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import NavbarComponent from '../components/navbarComponent';
import SidebarComponent from '../components/sidebarComponent';
import { asyncReceiveProfile } from '../../users/states/profileSlice';

const LostFoundLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);

  // Route Guarding
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  useEffect(() => {
    if (!profile) {
      dispatch(asyncReceiveProfile());
    }
  }, [dispatch, profile]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* FITUR UTAMA WCAG: Skip to Content Link untuk pengguna Keyboard/Screen Reader */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Lewati ke konten utama
      </a>

      <NavbarComponent onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Landmark <main> dengan id="main-content" */}
        <main id="main-content" tabIndex="-1" className="flex-1 overflow-y-auto p-4 md:p-8 outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LostFoundLayout;