import { apiFetch } from '../helpers/apiHelper';

/**
 * Memanggil API Registrasi
 * @param {object} payload - Berisi { name, email, password }
 */
export const register = async ({ name, email, password }) => {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
};

/**
 * Memanggil API Login
 * @param {object} payload - Berisi { email, password }
 */
export const login = async ({ email, password }) => {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
};