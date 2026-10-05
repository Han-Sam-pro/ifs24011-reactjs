/**
 * Fungsi utilitas untuk mengelola Access Token di localStorage
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const putAccessToken = (token) => {
  localStorage.setItem('accessToken', token);
};

export const removeAccessToken = () => {
  localStorage.removeItem('accessToken');
};

/**
 * Fungsi wrapper untuk Fetch HTTP Request ke REST API
 * 
 * @param {string} endpoint - Path API (contoh: '/lost-founds')
 * @param {object} options - Opsi konfigurasi (method, body, params, dll)
 * @returns {Promise<any>} Response dari API dalam format JSON
 */
export const apiFetch = async (endpoint, options = {}) => {
  const { method = 'GET', body, params, headers = {}, ...customConfig } = options;

  // 1. Fallback aman: jika DELCOM_BASEURL tidak terbaca, gunakan URL API Delcom langsung
  const baseUrl = (typeof DELCOM_BASEURL !== 'undefined' && DELCOM_BASEURL) 
    ? DELCOM_BASEURL 
    : 'https://open-api.delcom.org/api/v1';

  let url = `${baseUrl}${endpoint}`;
  
  if (params) {
    const queryParams = new URLSearchParams(params).toString();
    url += `?${queryParams}`;
  }

  // 2. Atur Headers
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  // 3. Otomatisasi Bearer Token Autentikasi
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // 4. Sertakan Body Request jika ada
  if (body) {
    config.body = JSON.stringify(body);
  }

  // 5. Lakukan Request dan Tangani Respon dengan Aman
  try {
    const response = await fetch(url, config);

    // Cek apakah balasan server benar-benar berupa JSON
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Jika server membalas HTML (seperti 404 / 500 / halaman index.html)
      throw new Error(`Respon server bukan JSON (Status: ${response.status}). URL API: ${url}`);
    }

    // Jika response status tidak ok (misal: 400, 401, 404, 500)
    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan saat menghubungi server');
    }

    return data;
  } catch (error) {
    console.error(`[apiFetch Error] ${method} ${url}:`, error.message);
    throw error;
  }
};