import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaBoxOpen, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { asyncReceiveLostFounds, asyncReceiveStats } from '../states/lostFoundSlice';
import { formatDate } from '../../../helpers/toolsHelper';
import AddModal from '../modals/addModal';

const HomePage = () => {
  const dispatch = useDispatch();
  const { lostFounds, isLostFound, isLostFoundAdded } = useSelector((state) => state.lostFounds);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    dispatch(asyncReceiveStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(asyncReceiveLostFounds({ status: filterStatus }));
  }, [dispatch, filterStatus, isLostFoundAdded]);

  // Pastikan lostFounds berupa array
  const items = Array.isArray(lostFounds) ? lostFounds : [];

  const filteredData = items.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()) ||
    item.description?.toLowerCase().includes(keyword.toLowerCase())
  );

  const totalCount = items.length;
  const lostCount = items.filter((i) => i.status === 'lost').length;
  const foundCount = items.filter((i) => i.status === 'found').length;
  const completedCount = items.filter((i) => i.is_completed === 1 || i.is_completed === true).length;

  // Helper agar nama pelapor tidak error objek
  const getAuthorName = (item) => {
    if (typeof item.author === 'object' && item.author !== null) {
      return item.author.name || 'Anonim';
    }
    if (typeof item.user === 'object' && item.user !== null) {
      return item.user.name || 'Anonim';
    }
    if (typeof item.author === 'string') return item.author;
    if (typeof item.user === 'string') return item.user;
    return 'Anonim';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Laporan Barang</h1>
          <p className="text-gray-500 text-sm">Kelola dan pantau barang temuan dan kehilangan.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-sm transition-all"
        >
          <FaPlus /> <span>Tambah Laporan</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-2xl"><FaBoxOpen /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Laporan</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-2xl"><FaExclamationCircle /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Barang Hilang</p>
            <h3 className="text-2xl font-bold text-gray-800">{lostCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-2xl"><FaCheckCircle /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Barang Ditemukan</p>
            <h3 className="text-2xl font-bold text-gray-800">{foundCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl text-2xl"><FaCheckCircle /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Terselesaikan</p>
            <h3 className="text-2xl font-bold text-gray-800">{completedCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama barang atau deskripsi..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus('lost')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === 'lost' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            Hilang (Lost)
          </button>
          <button
            onClick={() => setFilterStatus('found')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === 'found' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
            }`}
          >
            Ditemukan (Found)
          </button>
        </div>
      </div>

      {isLostFound ? (
        <div className="text-center py-16 text-gray-400 animate-pulse font-medium">Memuat data barang...</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">Tidak ada laporan yang sesuai kriteria pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Link
              key={item.id}
              to={`/lost_and_found/${item.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all group flex flex-col"
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {item.cover ? (
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaBoxOpen className="text-5xl" />
                  </div>
                )}
                
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  item.status === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {item.status}
                </span>

                {item.is_completed === 1 && (
                  <span className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Selesai
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{item.description}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                  {/* INI BAGIAN YANG SUDAH DIPERBAIKI (Tidak mencetak objek) */}
                  <span>Pelapor: {getAuthorName(item)}</span>
                  <span>{formatDate(item.created_at || item.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AddModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};

export default HomePage;