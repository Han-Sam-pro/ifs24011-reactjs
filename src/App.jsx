import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/authLayout';
import LostFoundLayout from './features/lost_and_found/layouts/lostFoundLayout';

// Auth Pages
import LoginPage from './features/lost_and_found/pages/loginPage';
import RegisterPage from './features/lost_and_found/pages/registerPage';

// Lost & Founds Pages
import HomePage from './features/lost_and_found/pages/homePage';
import DetailPage from './features/lost_and_found/pages/detailPage';

// Users & Profile Pages
import UsersPage from './features/users/pages/userPage';
import ProfilePage from './features/users/pages/profilePage';

function App() {
  return (
    <Routes>
      {/* =========================================
          1. AUTH ROUTES (/auth membungkus AuthLayout)
          ========================================= */}
      <Route path="/auth" element={<AuthLayout />}>
        {/* /auth/login: Halaman Login */}
        <Route path="login" element={<LoginPage />} />
        
        {/* /auth/register: Halaman Registrasi */}
        <Route path="register" element={<RegisterPage />} />
        
        {/* Redirect /auth ke /auth/login */}
        <Route index element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* =========================================
          2. PROTECTED DASHBOARD ROUTES (/ membungkus LostFoundLayout)
          ========================================= */}
      <Route path="/" element={<LostFoundLayout />}>
        {/* /: Halaman Beranda (Daftar & filter laporan Lost & Found) */}
        <Route index element={<HomePage />} />

        {/* /lost_and_found/:id: Halaman Detail laporan Lost & Found */}
        <Route path="lost_and_found/:id" element={<DetailPage />} />

        {/* /users: Halaman Daftar Pengguna */}
        <Route path="users" element={<UsersPage />} />

        {/* /profile: Halaman Profil & Pengaturan Akun Pengguna */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* =========================================
          3. FALLBACK & REDIRECTS
          ========================================= */}
      {/* Alihkan rute lama /login & /register ke /auth/ */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />

      {/* Fallback untuk rute yang tidak ditemukan (404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;