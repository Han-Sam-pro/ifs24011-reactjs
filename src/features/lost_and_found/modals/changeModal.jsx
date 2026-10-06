import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaSave } from 'react-icons/fa';
import useInput from '../../../hooks/useInput';
import { showErrorDialog } from '../../../helpers/toolsHelper';
import { asyncChangeLostFound } from '../states/lostFoundSlice';

const ChangeModal = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const { isLostFoundChange } = useSelector((state) => state.lostFounds);

  const [title, handleTitleChange, setTitle] = useInput('');
  const [description, handleDescriptionChange, setDescription] = useInput('');
  const [status, handleStatusChange, setStatus] = useInput('lost');
  const [isCompleted, setIsCompleted] = useState(0);

  useEffect(() => {
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
      setStatus(data.status || 'lost');
      setIsCompleted(data.is_completed ? 1 : 0);
    }
  }, [data, setTitle, setDescription, setStatus]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      return showErrorDialog('Judul dan Deskripsi wajib diisi!');
    }

    const payload = {
      title,
      description,
      status,
      is_completed: isCompleted,
    };

    const res = await dispatch(asyncChangeLostFound({ id: data.id, payload }));
    if (asyncChangeLostFound.fulfilled.match(res)) {
      onClose();
    }
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="change-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 id="change-modal-title" className="text-lg font-bold text-gray-900">
            Ubah Laporan Barang
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            aria-label="Tutup jendela ubah data"
            className="p-1 text-gray-500 hover:text-gray-700 rounded-lg cursor-pointer"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-1">Status Penyelesaian</span>
            <label htmlFor="change-is-completed-toggle" className="relative inline-flex items-center cursor-pointer">
              <input
                id="change-is-completed-toggle"
                type="checkbox"
                checked={isCompleted === 1}
                onChange={(e) => setIsCompleted(e.target.checked ? 1 : 0)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-800">
                {isCompleted === 1 ? 'Sudah Selesai / Ditemukan Kembali' : 'Belum Selesai'}
              </span>
            </label>
          </div>

          <div>
            <label htmlFor="change-title-input" className="block text-sm font-semibold text-gray-700 mb-1">
              Judul / Nama Barang
            </label>
            <input
              id="change-title-input"
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="change-description-input" className="block text-sm font-semibold text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              id="change-description-input"
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundChange}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center disabled:bg-blue-400 cursor-pointer shadow-sm"
            >
              <FaSave className="mr-2" aria-hidden="true" /> {isLostFoundChange ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeModal;