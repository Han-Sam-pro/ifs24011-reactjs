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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Direktori Pengguna</h1>
      
      {isUsersLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 animate-pulse">Memuat daftar pengguna...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
              {user.photo ? (
                <img src={user.photo} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" />
              ) : (
                <FaUserCircle className="w-16 h-16 text-gray-300" />
              )}
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  {user.email}
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