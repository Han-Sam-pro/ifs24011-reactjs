import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import { showErrorDialog } from '../../../helpers/toolsHelper';
import { asyncChangeCover } from '../states/lostFoundSlice';

const ChangeCoverModal = ({ isOpen, onClose, id }) => {
  const dispatch = useDispatch();
  const { isLostFoundChangeCover } = useSelector((state) => state.lostFounds);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      return showErrorDialog('Silakan pilih foto terlebih dahulu!');
    }

    const res = await dispatch(asyncChangeCover({ id, file: selectedFile }));
    if (asyncChangeCover.fulfilled.match(res)) {
      setSelectedFile(null);
      setPreviewUrl('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">Ubah Cover Barang</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            {previewUrl ? (
              <div className="w-full h-48 rounded-lg overflow-hidden relative">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="text-center py-6">
                <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Klik untuk memilih gambar</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Maks. 2MB)</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundChangeCover}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-blue-400"
            >
              {isLostFoundChangeCover ? 'Mengunggah...' : 'Simpan Foto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeCoverModal;