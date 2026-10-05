import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, renderHook, act } from '@testing-library/react';
import Swal from 'sweetalert2';

// 1. Import Test Utils & Setup
import { renderWithProviders } from './test-utils';

// 2. Import Modul yang diuji
import { formatDate, showSuccessDialog, showErrorDialog } from './helpers/toolsHelper';
import useInput from './hooks/useInput';
import store from './store';
import { setAuthToken, isAuthLogout } from './states/auth/authSlice';
// SESUDAH:
// Ganti menjadi huruf 'a' kecil:
import AddModal from './features/lost_and_found/modals/addModal';
import App from './App';

// Mock library eksternal (SweetAlert2)
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

/* =========================================================================
   SKENARIO 1: UNIT TEST - HELPER TOOLS (toolsHelper.js)
   ========================================================================= */
describe('1. Unit Test - Tools Helper', () => {
  it('formatDate harus mengembalikan "-" jika tanggal null atau kosong', () => {
    expect(formatDate(null)).toBe('-');
    expect(formatDate('')).toBe('-');
  });

  it('formatDate harus memformat string tanggal ISO ke format lokal Indonesia', () => {
    const formatted = formatDate('2026-10-05T08:00:00Z');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Oktober');
  });

  it('showSuccessDialog harus memicu Swal.fire dengan icon success', () => {
    showSuccessDialog('Operasi berhasil');
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Berhasil!',
        icon: 'success',
      })
    );
  });

  it('showErrorDialog harus memicu Swal.fire dengan icon error', () => {
    showErrorDialog('Terjadi kegagalan');
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Terjadi Kesalahan!',
        icon: 'error',
      })
    );
  });
});

/* =========================================================================
   SKENARIO 2: UNIT TEST - CUSTOM HOOK (useInput.js)
   ========================================================================= */
describe('2. Unit Test - Custom Hook useInput', () => {
  it('harus menginisialisasi nilai default dan menangani perubahan state', () => {
    const { result } = renderHook(() => useInput('Nilai Awal'));
    expect(result.current[0]).toBe('Nilai Awal');

    act(() => {
      result.current[1]({ target: { value: 'Nilai Diubah' } });
    });

    expect(result.current[0]).toBe('Nilai Diubah');
  });
});

/* =========================================================================
   SKENARIO 3: UNIT TEST - REDUX STORE & AUTH SLICE
   ========================================================================= */
describe('3. Unit Test - Redux Store & Auth Reducers', () => {
  it('store terpusat harus memuat seluruh slice reducer', () => {
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('users');
    expect(state).toHaveProperty('profile');
    expect(state).toHaveProperty('lostFounds');
  });

  it('harus dapat menyimpan token login dan mengosongkannya saat logout', () => {
    store.dispatch(setAuthToken('dummy-token-abc'));
    expect(store.getState().auth.token).toBe('dummy-token-abc');

    store.dispatch(isAuthLogout());
    expect(store.getState().auth.token).toBeNull();
  });
});

/* =========================================================================
   SKENARIO 4: COMPONENT TEST - MODAL FORM (AddModal.jsx)
   ========================================================================= */
describe('4. Component Test - AddModal Component', () => {
  it('tidak merender apapun saat isOpen bernilai false', () => {
    renderWithProviders(<AddModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText('Tambah Laporan Barang')).not.toBeInTheDocument();
  });

  it('merender form input saat isOpen bernilai true dan menerima perubahan input', () => {
    renderWithProviders(<AddModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Tambah Laporan Barang')).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/Contoh: Dompet/i);
    fireEvent.change(titleInput, { target: { value: 'Kunci Motor Hilang' } });
    expect(titleInput.value).toBe('Kunci Motor Hilang');
  });
});

/* =========================================================================
   SKENARIO 5: INTEGRATION TEST - ROUTING & ROUTE GUARDING (App.jsx)
   ========================================================================= */
describe('5. Integration Test - App Routing & Guarding', () => {
  it('pengguna belum login (token null) yang mengakses "/" harus dialihkan ke /auth/login', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: { token: null },
      },
      initialEntries: ['/'],
    });

    // Harus terlempar ke halaman Login
    expect(screen.getByText(/Selamat Datang/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contoh@delcom.org/i)).toBeInTheDocument();
  });

  it('harus merender halaman registrasi pada rute /auth/register', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: { token: null },
      },
      initialEntries: ['/auth/register'],
    });

    expect(screen.getByText(/Buat Akun Baru/i)).toBeInTheDocument();
  });
});