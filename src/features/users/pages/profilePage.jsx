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

  if (isProfile && !profile) {
    return <div className="p-10 text-center text-gray-600 font-medium">Memuat data profil...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-900">Manajemen Profil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Foto Profil (Menggunakan BUTTON semantik untuk Aksesibilitas) */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col items-center">
          <button 
            type="button"
            onClick={handlePhotoClick}
            aria-label="Pilih dan ubah foto profil pengguna"
            className="relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full"
          >
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 relative ${isChangeProfilePhoto ? 'opacity-50' : ''}`}>
              {profile?.photo ? (
                <img 
                  src={profile.photo} 
                  alt={`Foto profil pengguna ${profile?.name || ''}`} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-2xl" aria-hidden="true">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            {/* Overlay Icon Kamera */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
              <FaCamera className="text-white text-2xl" aria-hidden="true" />
            </div>
          </button>
          
          <p className="mt-4 text-sm text-gray-600 font-medium">Klik untuk mengubah foto</p>
          
          {/* Label tersembunyi khusus screen reader untuk input file */}
          <label htmlFor="profile-photo-upload" className="sr-only">Unggah berkas foto profil</label>
          <input 
            id="profile-photo-upload"
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          {isChangeProfilePhoto && (
            <p className="text-xs text-blue-700 font-medium mt-2" role="status">Mengunggah foto...</p>
          )}
        </div>

        {/* KOLOM KANAN: Form Profil & Password */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Form Update Profil (Lengkap dengan htmlFor & id) */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Informasi Pribadi</h2>
            <form onSubmit={onUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="profile-name-input" className="block text-sm font-semibold text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input 
                  id="profile-name-input"
                  type="text" 
                  value={name} 
                  onChange={handleNameChange} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="profile-email-input" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  id="profile-email-input"
                  type="email" 
                  value={email} 
                  onChange={handleEmailChange} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={isChangeProfile} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors disabled:bg-blue-400 cursor-pointer shadow-sm"
              >
                <FaSave className="mr-2" aria-hidden="true" /> {isChangeProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>

          {/* Form Ganti Password (Lengkap dengan htmlFor & id) */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Ubah Kata Sandi</h2>
            <form onSubmit={onChangePassword} className="space-y-4">
              <div>
                <label htmlFor="profile-old-password-input" className="block text-sm font-semibold text-gray-700 mb-1">
                  Kata Sandi Saat Ini
                </label>
                <input 
                  id="profile-old-password-input"
                  type="password" 
                  value={oldPassword} 
                  onChange={handleOldPasswordChange} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="profile-new-password-input" className="block text-sm font-semibold text-gray-700 mb-1">
                  Kata Sandi Baru
                </label>
                <input 
                  id="profile-new-password-input"
                  type="password" 
                  value={newPassword} 
                  onChange={handleNewPasswordChange} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={isChangeProfilePassword} 
                className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors disabled:bg-gray-500 cursor-pointer shadow-sm"
              >
                <FaKey className="mr-2" aria-hidden="true" /> {isChangeProfilePassword ? 'Memproses...' : 'Ubah Kata Sandi'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;