import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calculator, Clock, Search, Filter, Trash2, MoreVertical, CheckCircle2, Circle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
  id: number;
  name: string;
  date: string;
  timestamp: number;
  heirs: number;
  status: string;
  state: any;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  
  const [filterMode, setFilterMode] = useState<'Semua' | 'Selesai' | 'Tertunda'>('Semua');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('waris_history');
    if (saved) {
      setHistoryData(JSON.parse(saved));
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBulkDelete = () => {
    const newHistory = historyData.filter(item => !selectedIds.includes(item.id));
    setHistoryData(newHistory);
    localStorage.setItem('waris_history', JSON.stringify(newHistory));
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const longPressTimeout = useRef<any>(null);
  const isLongPressActive = useRef(false);

  const startPress = (id: number) => {
    isLongPressActive.current = false;
    longPressTimeout.current = setTimeout(() => {
      isLongPressActive.current = true;
      setIsSelectionMode(true);
      setSelectedIds(prev => prev.includes(id) ? prev : [...prev, id]);
    }, 600); // 600ms long press to enter selection mode
  };

  const endPress = (id: number, state: any) => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
    if (!isLongPressActive.current) {
      if (isSelectionMode) {
        toggleSelection(id);
      } else {
        navigate('/result', { state });
      }
    }
  };

  const cancelPress = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
      }
    };
  }, []);

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.date.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterMode === 'Semua' ? true : item.status === filterMode;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen w-full bg-dark font-sans overflow-hidden">
      {/* Mobile App Container */}
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-[100dvh] relative overflow-hidden flex flex-col shadow-2xl shadow-neonGreen/10">
        
        {/* Header */}
        <div className="bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center justify-between shadow-xl z-50">
          <div className="flex items-center">
            {isSelectionMode ? (
              <button onClick={() => { setIsSelectionMode(false); setSelectedIds([]); }} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
                <X size={22} />
              </button>
            ) : (
              <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
                <ArrowLeft size={22} />
              </button>
            )}
            
            <div className="flex items-center gap-3 ml-2">
              {isSelectionMode ? (
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">{selectedIds.length} Terpilih</h2>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide">Riwayat</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Perhitungan Faraid Anda
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* More Menu */}
          {!isSelectionMode && historyData.length > 0 && (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-40 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <button 
                      onClick={() => {
                        setIsSelectionMode(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                    >
                      <CheckCircle2 size={16} className="text-gray-400" />
                      Pilih Item
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          
          {/* Search Bar */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari riwayat..."
                className="w-full bg-[#141414] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neonGreen/50 focus:bg-[#1A1A1A] transition-all shadow-inner"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`w-12 h-[46px] bg-[#141414] border ${filterMode !== 'Semua' ? 'border-neonGreen/50 text-neonGreen' : 'border-white/10 text-gray-400'} rounded-xl flex items-center justify-center hover:text-neonGreen hover:border-neonGreen/30 transition-colors`}
              >
                <Filter size={18} />
              </button>
              
              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-36 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {['Semua', 'Selesai', 'Tertunda'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => {
                          setFilterMode(status as any);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${filterMode === status ? 'text-neonGreen font-bold bg-white/5' : 'text-white hover:bg-white/5'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* History List */}
          <div className="space-y-3 pb-8">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="glass-card bg-[#141414] p-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.03)]">
                    <div className="w-10 h-10 rounded-full bg-white/20 shrink-0"></div>
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                      <div className="h-3 w-1/2 bg-white/20 rounded"></div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 items-end mt-1">
                      <div className="w-16 h-5 bg-white/20 rounded-md"></div>
                      <div className="w-4 h-4 bg-white/10 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
             ) : filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <div 
                  key={item.id} 
                  onMouseDown={() => startPress(item.id)}
                  onMouseUp={() => endPress(item.id, item.state)}
                  onMouseLeave={cancelPress}
                  onTouchStart={() => startPress(item.id)}
                  onTouchEnd={() => endPress(item.id, item.state)}
                  onTouchMove={cancelPress}
                  className={`glass-card p-4 rounded-2xl flex items-center gap-4 transition-colors cursor-pointer border ${
                    selectedIds.includes(item.id) 
                      ? 'border-neonGreen/50 bg-neonGreen/5 shadow-[0_0_15px_rgba(80,255,176,0.1)]' 
                      : 'border-white/5 bg-[#141414] hover:bg-white/5'
                  }`}
                >
                  {isSelectionMode && (
                    <div className="shrink-0 mr-1 transition-all">
                      {selectedIds.includes(item.id) ? (
                        <CheckCircle2 size={22} className="text-neonGreen drop-shadow-[0_0_8px_rgba(80,255,176,0.5)]" />
                      ) : (
                        <Circle size={22} className="text-gray-600" />
                      )}
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.status === 'Selesai' ? 'bg-neonGreen/10 text-neonGreen' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    <Calculator size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
                      <Clock size={10} /> {item.date} • {item.heirs} Ahli Waris
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 items-end">
                    <span className={`text-[9px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                      item.status === 'Selesai' ? 'bg-neonGreen/10 text-neonGreen' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm">Tidak ada riwayat yang ditemukan.</p>
              </div>
            )}
          </div>
          
        </div>

        {/* Floating Delete Button in Selection Mode */}
        {isSelectionMode && selectedIds.length > 0 && (
          <div className="absolute bottom-6 left-0 w-full px-6 z-50 animate-slide-up">
            <button 
              onClick={handleBulkDelete}
              className="w-full bg-red-500/20 border border-red-500/50 text-red-500 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors backdrop-blur-xl shadow-[0_10px_40px_rgba(239,68,68,0.2)]"
            >
              <Trash2 size={18} />
              Hapus {selectedIds.length} Riwayat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
