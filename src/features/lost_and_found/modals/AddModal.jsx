import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaPlus } from 'react-icons/fa';
import useInput from '../../../hooks/useInput';
import { showErrorDialog } from '../../../helpers/toolsHelper';
import { asyncAddLostFound } from '../states/lostFoundSlice';

const AddModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isLostFoundAdd } = useSelector((state) => state.lostFounds);

  const [title, handleTitleChange, setTitle] = useInput('');
  const [description, handleDescriptionChange, setDescription] = useInput('');
  const [status, handleStatusChange, setStatus] = useInput('lost');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      return showErrorDialog('Judul dan Deskripsi wajib diisi!');
    }

    const res = await dispatch(asyncAddLostFound({ title, description, status }));
    if (asyncAddLostFound.fulfilled.match(res)) {
      setTitle('');
      setDescription('');
      setStatus('lost');
      onClose();
    }
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="add-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 id="add-modal-title" className="text-lg font-bold text-gray-900">
            Tambah Laporan Barang
          </h2>
          <button 
            onClick={onClose} 
            aria-label="Tutup jendela tambah laporan" 
            className="p-1 text-gray-500 hover:text-gray-700 rounded-lg cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-1">Jenis Laporan</span>
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Pilih jenis laporan">
              <button
                type="button"
                aria-pressed={status === 'lost'}
                onClick={() => setStatus('lost')}
                className={`py-2 rounded-lg border font-medium text-sm transition-all cursor-pointer ${
                  status === 'lost' ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-200' : 'border-gray-300 text-gray-700'
                }`}
              >
                Barang Hilang (Lost)
              </button>
              <button
                type="button"
                aria-pressed={status === 'found'}
                onClick={() => setStatus('found')}
                className={`py-2 rounded-lg border font-medium text-sm transition-all cursor-pointer ${
                  status === 'found' ? 'bg-emerald-50 border-emerald-600 text-emerald-700 ring-2 ring-emerald-200' : 'border-gray-300 text-gray-700'
                }`}
              >
                Barang Ditemukan (Found)
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="add-title-input" className="block text-sm font-semibold text-gray-700 mb-1">
              Judul / Nama Barang
            </label>
            <input
              id="add-title-input"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Contoh: Dompet Kulit Coklat"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="add-desc-input" className="block text-sm font-semibold text-gray-700 mb-1">
              Deskripsi & Ciri-Ciri
            </label>
            <textarea
              id="add-desc-input"
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Jelaskan ciri-ciri barang..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              disabled={isLostFoundAdd}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center disabled:bg-blue-400 cursor-pointer shadow-sm"
            >
              <FaPlus className="mr-2" aria-hidden="true" /> {isLostFoundAdd ? 'Menyimpan...' : 'Tambah Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;