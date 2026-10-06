import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaCamera, FaArrowLeft, FaCheckCircle, FaClock, FaUser } from 'react-icons/fa';
import { 
  asyncReceiveLostFoundDetail, 
  asyncDeleteLostFound, 
  clearLostFoundDetail 
} from '../states/lostFoundSlice';
import { formatDate, showConfirmDialog } from '../../../helpers/toolsHelper';

// Sesuaikan casing jika file Anda berawalan huruf kecil
import ChangeModal from '../modals/changeModal';
import ChangeCoverModal from '../modals/changeCoverModal';

const DetailPage = () => {  
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { lostFound, isLostFound, isLostFoundDeleted, isLostFoundChanged, isLostFoundChangedCover } = useSelector((state) => state.lostFounds);
  const { profile } = useSelector((state) => state.profile);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  useEffect(() => {
    dispatch(asyncReceiveLostFoundDetail(id));
    return () => {
      dispatch(clearLostFoundDetail());
    };
  }, [dispatch, id, isLostFoundChanged, isLostFoundChangedCover]);

  useEffect(() => {
    if (isLostFoundDeleted) {
      navigate('/');
    }
  }, [isLostFoundDeleted, navigate]);

  const handleDelete = async () => {
    const result = await showConfirmDialog(
      'Hapus Laporan?',
      'Laporan ini akan dihapus secara permanen dari sistem.'
    );
    if (result.isConfirmed) {
      dispatch(asyncDeleteLostFound(id));
    }
  };

  if (isLostFound && !lostFound) {
    return <div className="text-center py-20 text-gray-400 font-medium">Memuat detail rincian...</div>;
  }

  if (!lostFound) {
    return <div className="text-center py-20 text-gray-500">Laporan barang tidak ditemukan.</div>;
  }

  // Cek apakah user yang login adalah pemilik laporan (mendukung user_id, user.id, maupun author.id)
  const isOwner = 
    profile?.id === lostFound?.user_id || 
    profile?.id === lostFound?.user?.id ||
    profile?.id === lostFound?.author?.id;

  // Nama pelapor aman dari objek
  const authorName = 
    lostFound.author?.name || 
    lostFound.user?.name || 
    (typeof lostFound.author === 'string' ? lostFound.author : 'Anonim');

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Kembali
      </button>

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs">
        {/* Cover Image Adaptif */}
        <div className="relative aspect-video w-full bg-gray-900 flex items-center justify-center overflow-hidden">
          {lostFound.cover ? (
            <img src={lostFound.cover} alt={lostFound.title} className="w-full h-full object-contain" />
          ) : (
            <p className="text-gray-500 font-medium">Belum ada foto cover</p>
          )}

          {isOwner && (
            <button
              onClick={() => setIsCoverOpen(true)}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-xs flex items-center space-x-2 transition-all"
            >
              <FaCamera /> <span>Ubah Cover</span>
            </button>
          )}
        </div>

        {/* Rincian Konten */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  lostFound.status === 'lost' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {lostFound.status === 'lost' ? 'Kehilangan' : 'Ditemukan'}
                </span>
                {lostFound.is_completed === 1 && (
                  <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <FaCheckCircle className="mr-1" /> Kasus Selesai
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900">{lostFound.title}</h1>
            </div>

            {/* Aksi Pemilik */}
            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <FaEdit /> <span>Edit Data</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <FaTrash /> <span>Hapus</span>
                </button>
              </div>
            )}
          </div>

          {/* Metadata Pelapor & Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-400 text-lg" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Pelapor</p>
                <p className="font-semibold text-gray-800">{authorName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaClock className="text-gray-400 text-lg" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Tanggal Dilaporkan</p>
                <p className="font-semibold text-gray-800">{formatDate(lostFound.created_at || lostFound.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Deskripsi & Ciri-Ciri</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{lostFound.description}</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangeModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} data={lostFound} />
      <ChangeCoverModal isOpen={isCoverOpen} onClose={() => setIsCoverOpen(false)} id={lostFound.id} />
    </div>
  );
};

export default DetailPage;