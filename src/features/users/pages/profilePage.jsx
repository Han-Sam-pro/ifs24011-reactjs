import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCamera, FaSave, FaKey } from 'react-icons/fa';
import useInput from '../../../hooks/useInput';
import { showErrorDialog } from '../../../helpers/toolsHelper';
import { 
  asyncReceiveProfile, 
  asyncUpdateProfile, 
  asyncChangePassword, 
  asyncChangePhoto 
} from '../states/profileSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const { profile, isProfile, isChangeProfile, isChangeProfilePassword, isChangeProfilePhoto } = useSelector((state) => state.profile);

  const [name, handleNameChange, setName] = useInput('');
  const [email, handleEmailChange, setEmail] = useInput('');
  const [oldPassword, handleOldPasswordChange, setOldPassword] = useInput('');
  const [newPassword, handleNewPasswordChange, setNewPassword] = useInput('');

  useEffect(() => {
    dispatch(asyncReceiveProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
    }
  }, [profile, setName, setEmail]);

  const onUpdateProfile = (e) => {
    e.preventDefault();
    if (!name || !email) return showErrorDialog('Nama dan Email tidak boleh kosong!');
    dispatch(asyncUpdateProfile({ name, email }));
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return showErrorDialog('Semua kolom kata sandi harus diisi!');
    if (newPassword.length < 6) return showErrorDialog('Kata sandi baru minimal 6 karakter!');
    
    await dispatch(asyncChangePassword({ oldPassword, newPassword }));
    setOldPassword('');
    setNewPassword('');
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(asyncChangePhoto(file));
    }
  };

  if (isProfile && !profile) return <div className="p-10 text-center">Memuat profil...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-800">Manajemen Profil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Foto Profil */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 relative ${isChangeProfilePhoto ? 'opacity-50' : ''}`}>
              {profile?.photo ? (
                <img src={profile.photo} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-2xl">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FaCamera className="text-white text-2xl" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 font-medium">Klik untuk mengubah foto</p>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          {isChangeProfilePhoto && <p className="text-xs text-blue-500 mt-2">Mengunggah...</p>}
        </div>

        {/* Form Profil & Password */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Informasi Pribadi</h2>
            <form onSubmit={onUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" value={name} onChange={handleNameChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={handleEmailChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <button type="submit" disabled={isChangeProfile} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors disabled:bg-blue-400">
                <FaSave className="mr-2" /> {isChangeProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Ubah Kata Sandi</h2>
            <form onSubmit={onChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi Saat Ini</label>
                <input type="password" value={oldPassword} onChange={handleOldPasswordChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi Baru</label>
                <input type="password" value={newPassword} onChange={handleNewPasswordChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <button type="submit" disabled={isChangeProfilePassword} className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors disabled:bg-gray-500">
                <FaKey className="mr-2" /> {isChangeProfilePassword ? 'Memproses...' : 'Ubah Kata Sandi'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;