import { apiFetch, getAccessToken } from '../../../helpers/apiHelper';

/**
 * Mengambil daftar barang hilang & temuan dengan filter opsional
 * GET /lost-founds
 * 
 * @param {object} filterParams - Objek filter query params
 * @param {string} [filterParams.status] - 'lost' atau 'found'
 * @param {number|string} [filterParams.is_completed] - 1 (selesai) atau 0 (belum selesai)
 * @param {number|string} [filterParams.is_me] - 1 (hanya laporan milik user yang login)
 */
export const getLostFounds = async (filterParams = {}) => {
  // Membersihkan filter yang nilainya kosong/undefined sebelum dijadikan query params
  const cleanParams = Object.fromEntries(
    Object.entries(filterParams).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );

  return await apiFetch('/lost-founds', {
    params: cleanParams,
  });
};

/**
 * Melihat detail lengkap laporan barang berdasarkan ID
 * GET /lost-founds/:id
 * 
 * @param {string|number} id - ID laporan
 */
export const getLostFoundDetail = async (id) => {
  return await apiFetch(`/lost-founds/${id}`);
};

/**
 * Menambahkan laporan kehilangan atau penemuan baru
 * POST /lost-founds
 * 
 * @param {object} payload - { title, description, status, location, date, ... }
 */
export const createLostFound = async (payload) => {
  return await apiFetch('/lost-founds', {
    method: 'POST',
    body: payload,
  });
};

/**
 * Memperbarui data laporan dan/atau status penyelesaian
 * PUT /lost-founds/:id
 * 
 * @param {string|number} id - ID laporan
 * @param {object} payload - Data yang diperbarui (misal: { title, status, is_completed, ... })
 */
export const updateLostFound = async (id, payload) => {
  return await apiFetch(`/lost-founds/${id}`, {
    method: 'PUT',
    body: payload,
  });
};

/**
 * Mengunggah atau mengganti foto bukti / cover barang
 * POST /lost-founds/:id/cover
 * 
 * @param {string|number} id - ID laporan
 * @param {File} coverFile - File gambar cover
 */
export const uploadLostFoundCover = async (id, coverFile) => {
  const formData = new FormData();
  formData.append('cover', coverFile);

  const token = getAccessToken();

  try {
    const response = await fetch(`${DELCOM_BASEURL}/lost-founds/${id}/cover`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengunggah cover laporan');
    }

    return data;
  } catch (error) {
    console.error(`[API Error] POST /lost-founds/${id}/cover:`, error.message);
    throw error;
  }
};

/**
 * Menghapus laporan barang
 * DELETE /lost-founds/:id
 * 
 * @param {string|number} id - ID laporan
 */
export const deleteLostFound = async (id) => {
  return await apiFetch(`/lost-founds/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Mengambil statistik laporan harian
 * GET /lost-founds/stats/daily
 */
export const getDailyStats = async () => {
  return await apiFetch('/lost-founds/stats/daily');
};

/**
 * Mengambil statistik laporan bulanan
 * GET /lost-founds/stats/monthly
 */
export const getMonthlyStats = async () => {
  return await apiFetch('/lost-founds/stats/monthly');
};