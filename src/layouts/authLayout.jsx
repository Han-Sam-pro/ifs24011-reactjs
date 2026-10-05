import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { FaSearchLocation } from 'react-icons/fa';

const AuthLayout = () => {
  const { token } = useSelector((state) => state.auth);

  // Route Guarding: Jika sudah login, alihkan langsung ke Dashboard (/)
  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Kolom Kiri: Visual Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 justify-center items-center flex-col text-white p-12">
        <FaSearchLocation className="text-9xl mb-6 opacity-90 drop-shadow-md" />
        <h1 className="text-4xl font-bold mb-4 text-center">Delcom Lost & Found</h1>
        <p className="text-lg text-blue-100 text-center max-w-md">
          Temukan barang Anda yang hilang atau bantu orang lain menemukan barang mereka kembali dengan mudah dan aman.
        </p>
      </div>

      {/* Kolom Kanan: Shell Kontainer Form Dinamis */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;