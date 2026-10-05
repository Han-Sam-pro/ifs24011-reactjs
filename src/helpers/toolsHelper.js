import Swal from 'sweetalert2';

/**
 * Menampilkan pesan sukses interaktif
 * @param {string} message - Pesan yang ingin ditampilkan
 */
export const showSuccessDialog = (message) => {
  return Swal.fire({
    title: 'Berhasil!',
    text: message,
    icon: 'success',
    confirmButtonColor: '#3b82f6', // blue-500
    confirmButtonText: 'Tutup',
    customClass: {
      popup: 'font-sans'
    }
  });
};

/**
 * Menampilkan pesan error interaktif
 * @param {string} message - Pesan error yang ingin ditampilkan
 */
export const showErrorDialog = (message) => {
  return Swal.fire({
    title: 'Terjadi Kesalahan!',
    text: message,
    icon: 'error',
    confirmButtonColor: '#ef4444', // red-500
    confirmButtonText: 'Tutup',
    customClass: {
      popup: 'font-sans'
    }
  });
};

/**
 * Menampilkan dialog konfirmasi aksi
 * @param {string} title - Judul konfirmasi
 * @param {string} message - Pesan deskripsi
 */
export const showConfirmDialog = (title = 'Apakah Anda yakin?', message = 'Tindakan ini tidak dapat dibatalkan.') => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Ya, Lanjutkan!',
    cancelButtonText: 'Batal',
    customClass: {
      popup: 'font-sans'
    }
  });
};

/**
 * Helper pemformatan tanggal/waktu ke format lokal Indonesia
 * @param {string|Date} dateString - String tanggal dari API (contoh: ISO 8601)
 * @returns {string} String tanggal yang diformat (contoh: 5 Oktober 2026, 11:28)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};