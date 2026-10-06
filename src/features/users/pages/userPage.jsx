import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle, FaEnvelope } from 'react-icons/fa';
import { asyncReceiveUsers } from '../states/usersSlice';

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, isUsersLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(asyncReceiveUsers());
  }, [dispatch]);

  // Pastikan users berupa array
  const userList = Array.isArray(users) ? users : [];

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Direktori Pengguna</h1>
      
      {isUsersLoading ? (
        <div className="flex justify-center items-center h-40" role="status" aria-live="polite">
          <p className="text-gray-600 font-medium animate-pulse">Memuat daftar pengguna...</p>
        </div>
      ) : userList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-600 font-medium">Belum ada data pengguna yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userList.map((user) => (
            <div 
              key={user.id} 
              className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow"
            >
              {user.photo ? (
                <img 
                  src={user.photo} 
                  alt={`Foto profil pengguna ${user.name}`} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" 
                />
              ) : (
                <FaUserCircle className="w-16 h-16 text-gray-400" aria-hidden="true" />
              )}
              
              <div className="overflow-hidden">
                {/* Heading tingkat 2 untuk semantik yang benar */}
                <h2 className="text-lg font-bold text-gray-900 truncate">{user.name}</h2>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FaEnvelope className="mr-2 text-gray-500 shrink-0" aria-hidden="true" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;