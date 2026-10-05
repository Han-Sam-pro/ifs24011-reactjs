import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';

// Gunakan ../../../ untuk kembali ke folder src/
import AuthLayout from '../../../layouts/authLayout';
import useInput from '../../../hooks/useInput';
import { asyncLoginUser } from '../../../states/auth/authSlice';
import { showErrorDialog } from '../../../helpers/toolsHelper';

const LoginPage = () => {
  const [email, handleEmailChange] = useInput('');
  const [password, handlePasswordChange] = useInput('');
  
  const dispatch = useDispatch();
  const { isAuthLogin } = useSelector((state) => state.auth);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return showErrorDialog('Email dan Password wajib diisi!');
    }
    dispatch(asyncLoginUser({ email, password }));
  };

  return (
    <div>
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900">Selamat Datang</h2>
        <p className="text-gray-500 mt-2">Silakan masuk untuk melanjutkan</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
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
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAuthLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-blue-400 flex justify-center items-center shadow-md"
        >
          {isAuthLogin ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Belum punya akun?{' '}
        <Link to="/auth/register" className="font-semibold text-blue-600 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;