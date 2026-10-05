import { useState } from 'react';

/**
 * Custom hook reusable untuk mengelola two-way data binding
 * pada elemen formulir input.
 * 
 * @param {any} defaultValue - Nilai awal input
 * @returns {Array} [value, handleValueChange, setValue]
 */
const useInput = (defaultValue = '') => {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (event) => {
    // Membaca nilai dari event target (input, textarea, atau select)
    setValue(event.target.value);
  };

  return [value, handleValueChange, setValue];
};

export default useInput;