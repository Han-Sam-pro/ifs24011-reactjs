import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">Tambah Laporan Barang</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Laporan</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('lost')}
                className={`py-2 rounded-lg border font-medium text-sm transition-all ${
                  status === 'lost' ? 'bg-red-50 border-red-500 text-red-600 ring-2 ring-red-200' : 'border-gray-200 text-gray-600'
                }`}
              >
                Barang Hilang (Lost)
              </button>
              <button
                type="button"
                onClick={() => setStatus('found')}
                className={`py-2 rounded-lg border font-medium text-sm transition-all ${
                  status === 'found' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 ring-2 ring-emerald-200' : 'border-gray-200 text-gray-600'
                }`}
              >
                Barang Ditemukan (Found)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul / Nama Barang</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Contoh: Dompet Kulit Coklat"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi & Rincian Lokasi</label>
            <textarea
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Jelaskan ciri-ciri barang dan lokasi kejadian..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundAdd}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center disabled:bg-blue-400"
            >
              <FaPlus className="mr-2" /> {isLostFoundAdd ? 'Menyimpan...' : 'Tambah Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;