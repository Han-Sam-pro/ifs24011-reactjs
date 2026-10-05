import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Definisikan DELCOM_BASEURL jika dijalankan di environment test
global.DELCOM_BASEURL = 'https://open-api.delcom.org/api/v1';

// Mock scrollTo bawaan browser yang sering tidak ada di JSDOM
window.scrollTo = vi.fn();