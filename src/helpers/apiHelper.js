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
  // Destructuring opsi bawaan
  const { method = 'GET', body, params, headers = {}, ...customConfig } = options;

  // 1. Atur URL dan Query Parameters
  // DELCOM_BASEURL telah kita definisikan secara global di vite.config.js
  let url = `${DELCOM_BASEURL}${endpoint}`;
  
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

  // 4. Sertakan Body Request jika ada (kecuali untuk GET/HEAD)
  if (body) {
    config.body = JSON.stringify(body);
  }

  // 5. Lakukan Request dan Tangani Response
  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Jika response status tidak ok (misal: 400, 401, 404, 500)
    if (!response.ok) {
      // Melempar error agar bisa ditangkap di blok catch pada komponen/custom hooks
      throw new Error(data.message || 'Terjadi kesalahan saat menghubungi server');
    }

    return data;
  } catch (error) {
    console.error(`[apiFetch Error] ${method} ${endpoint}:`, error.message);
    throw error;
  }
};