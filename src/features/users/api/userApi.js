import { apiFetch, getAccessToken } from '../../../helpers/apiHelper';

/**
 * Mengambil daftar semua pengguna
 * GET /users
 */
export const getAllUsers = async () => {
  return await apiFetch('/users');
};

/**
 * Mengambil data profil pengguna yang sedang login (aktif)
 * GET /users/me
 */
export const getMyProfile = async () => {
  return await apiFetch('/users/me');
};

/**
 * Memperbarui informasi profil pengguna aktif (seperti nama/email)
 * PUT /users/me
 * @param {object} payload - Berisi { name, email } dll sesuai spesifikasi API
 */
export const updateMyProfile = async (payload) => {
  return await apiFetch('/users/me', {
    method: 'PUT',
    body: payload,
  });
};

/**
 * Mengubah kata sandi pengguna aktif
 * PUT /users/me/password
 * @param {object} payload - Berisi { oldPassword, newPassword }
 */
export const changeMyPassword = async ({ oldPassword, newPassword }) => {
  return await apiFetch('/users/me/password', {
    method: 'PUT',
    body: { oldPassword, newPassword },
  });
};

/**
 * Mengunggah foto avatar profil
 * POST /users/me/photo
 * @param {File} photoFile - Objek File gambar dari input type="file"
 */
export const uploadMyPhoto = async (photoFile) => {
  // Menggunakan FormData karena kita mengirim berkas (file)
  const formData = new FormData();
  
  // 'photo' adalah key standar. Sesuaikan jika API Delcom menggunakan key 'avatar' atau 'file'
  formData.append('photo', photoFile); 

  const token = getAccessToken();
  
  try {
    // Kita menggunakan fetch langsung karena apiFetch mengonversi body ke JSON string
    // Content-Type TIDAK diatur manual agar browser otomatis menambahkan 'boundary' multipart/form-data
    const response = await fetch(`${DELCOM_BASEURL}/users/me/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengunggah foto profil');
    }

    return data;
  } catch (error) {
    console.error('[API Error] POST /users/me/photo:', error.message);
    throw error;
  }
};  