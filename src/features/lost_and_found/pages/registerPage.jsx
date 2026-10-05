import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

// Gunakan ../../../ untuk kembali ke folder src/
import AuthLayout from '../../../layouts/authLayout';
import useInput from '../../../hooks/useInput';
import { asyncRegisterUser } from '../../../states/auth/authSlice';
import { showErrorDialog } from '../../../helpers/toolsHelper';

const RegisterPage = () => {
  const [name, handleNameChange] = useInput('');
  const [email, handleEmailChange] = useInput('');
  const [password, handlePasswordChange] = useInput('');
  const [confirmPassword, handleConfirmPasswordChange] = useInput('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthRegister } = useSelector((state) => state.auth);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return showErrorDialog('Semua kolom wajib diisi!');
    }
    if (password.length < 6) {
      return showErrorDialog('Password minimal harus 6 karakter!');
    }
    if (password !== confirmPassword) {
      return showErrorDialog('Konfirmasi password tidak cocok!');
    }

    const actionResult = await dispatch(asyncRegisterUser({ name, email, password }));
    if (asyncRegisterUser.fulfilled.match(actionResult)) {
      navigate('/auth/login');
    }
  };

  return (
    <div>
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900">Buat Akun Baru</h2>
        <p className="text-gray-500 mt-2">Bergabunglah dengan komunitas Delcom</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nama Lengkap"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="contoh@delcom.org"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Minimal 6 karakter"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ketik ulang password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAuthRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2 disabled:bg-blue-400 flex justify-center items-center shadow-md"
        >
          {isAuthRegister ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link to="/auth/login" className="font-semibold text-blue-600 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;