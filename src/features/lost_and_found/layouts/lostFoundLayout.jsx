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

if (!token) {
  return <Navigate to="/auth/login" replace />;
}

  // Muat data profil saat layout pertama kali dirender
  useEffect(() => {
    if (!profile) {
      dispatch(asyncReceiveProfile());
    }
  }, [dispatch, profile]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LostFoundLayout;