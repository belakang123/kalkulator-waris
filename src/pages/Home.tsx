import React, { useState, useEffect } from 'react';
import { Calculator, BookOpen, Users, ChevronRight, Info } from 'lucide-react';
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

const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('waris_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ambil 3 teratas saja
      setRecentHistory(parsed.slice(0, 3));
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 150) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-dark font-sans overflow-hidden">
      {/* Mobile App Container */}
      <div className="animate-slide-in-left w-full bg-[#0A0A0A] min-h-screen relative overflow-hidden flex flex-col shadow-2xl shadow-neonGreen/5">

        {/* Mini Sticky Header (Muncul saat discroll) */}
        <div
          className={`absolute top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out transform ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
            }`}
        >
          <div className="bg-[#0A0A0A] border-b border-white/10 p-4 pt-6 flex justify-between items-center shadow-2xl px-6">
            <h2 className="text-xl font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonGreen to-neonBlue">Waris</span>
              <span className="text-white font-light">Sync</span>
            </h2>
            <button 
              onClick={() => navigate('/info')}
              className="bg-white/5 border border-white/10 text-gray-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        {/* 1. Curved Top Header */}
        <div className="relative w-full h-72 bg-gradient-to-br from-neonBlue to-neonGreen rounded-b-[3.5rem] p-8 flex flex-col justify-end pb-16 overflow-hidden shrink-0">
          
          {/* Version / Info Badge */}
          <div className="absolute top-6 right-6 z-20">
            <button 
              onClick={() => navigate('/info')}
              className="flex items-center justify-center bg-dark/10 backdrop-blur-md border border-dark/10 text-dark w-9 h-9 rounded-full shadow-sm hover:bg-dark/20 transition-all hover:scale-105 active:scale-95"
            >
              <Info size={16} className="text-dark" />
            </button>
          </div>

          {/* Decorative glowing orbs */}
          <div className="absolute top-[-50px] right-[-50px] w-56 h-56 bg-white/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-[-20px] w-32 h-32 bg-dark/20 rounded-full blur-2xl"></div>

          <div className="z-10">
            <p className="text-dark/70 font-medium text-sm mb-1">Selamat datang di</p>
            <h1 className="text-4xl font-extrabold text-dark tracking-tight">
              Waris<span className="font-light">Sync</span>
            </h1>
            <p className="text-dark/80 text-sm mt-2 max-w-[200px] leading-relaxed">
              Kalkulator Faraid cerdas & sesuai syariat.
            </p>
          </div>
        </div>

        {/* 3. Scrollable Content Area */}
        <div
          className="flex-1 w-full h-full overflow-y-auto no-scrollbar absolute top-0 left-0 pt-[16rem] z-30 pointer-events-none"
          onScroll={handleScroll}
        >
          {/* Pembungkus ber-background gelap untuk "menutup" header saat discroll */}
          <div className="bg-[#0A0A0A] min-h-screen rounded-t-[2.5rem] px-6 relative pt-4 pb-32 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] isolate pointer-events-auto">
            
            {/* 2. Action Buttons (3 Circular Icons) */}
            {/* Efek -mt-12 membuatnya menyembul ke atas menabrak header */}
            <div className="z-20 flex justify-between relative shrink-0 mb-8 -mt-12">
              {/* Button 1 */}
              <div className="flex flex-col items-center gap-3">
                <button 
                  onClick={() => navigate('/add-member')}
                  className="w-[4.5rem] h-[4.5rem] rounded-full glass-card bg-[#111111]/90 flex items-center justify-center text-neonGreen hover:bg-neonGreen/20 transition-all glow-green"
                >
                  <Users size={28} />
                </button>
                <span className="text-[11px] text-gray-400 font-medium">Tambah Anggota</span>
              </div>

              {/* Button 2 (Main Action) */}
              <div className="flex flex-col items-center gap-3">
                <button 
                  onClick={() => navigate('/calculator')}
                  className="w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-neonGreen to-neonBlue flex items-center justify-center text-dark shadow-[0_0_20px_rgba(80,255,176,0.5)] hover:scale-105 transition-transform"
                >
                  <Calculator size={28} strokeWidth={2.5} />
                </button>
                <span className="text-[11px] text-white font-semibold">Hitung Waris</span>
              </div>

              {/* Button 3 */}
              <div className="flex flex-col items-center gap-3">
                <button 
                  onClick={() => navigate('/fikih-waris')}
                  className="w-[4.5rem] h-[4.5rem] rounded-full glass-card bg-[#111111]/90 flex items-center justify-center text-neonBlue hover:bg-neonBlue/20 transition-all glow-blue"
                >
                  <BookOpen size={28} />
                </button>
                <span className="text-[11px] text-gray-400 font-medium">Fikih Waris</span>
              </div>
            </div>

            {/* Banner Promo / Info */}
            <div 
              onClick={() => navigate('/ai')}
              className="bg-[#111111] border border-white/5 rounded-2xl p-5 mb-8 flex items-center justify-between border-l-4 border-l-neonBlue cursor-pointer hover:bg-white/10 transition-colors shadow-lg"
            >
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Konsultasi AI</h3>
                <p className="text-xs text-gray-400">Tanya asisten cerdas soal hukum waris</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-neonBlue/20 flex items-center justify-center text-neonBlue">
                <ChevronRight size={18} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-sm">Riwayat Perhitungan</h3>
              <button 
                onClick={() => navigate('/history')}
                className="text-neonGreen text-xs font-medium hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-[#111111] p-4 rounded-2xl flex items-center gap-4 border border-white/5 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-white/20 shrink-0"></div>
                      <div className="flex-1 space-y-2.5">
                        <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                        <div className="h-3 w-1/2 bg-white/20 rounded"></div>
                      </div>
                      <div className="w-16 h-6 bg-white/20 rounded-md shrink-0"></div>
                    </div>
                  ))}
                </div>
              ) : recentHistory.length > 0 ? (
                recentHistory.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => navigate('/result', { state: item.state })}
                    className="bg-[#111111] border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-[#151515] transition-colors cursor-pointer shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neonGreen shrink-0">
                      <Calculator size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.date} • {item.heirs} Ahli Waris</p>
                    </div>
                    <span className="text-[10px] bg-neonGreen/10 text-neonGreen px-2 py-1 rounded-md font-medium shrink-0 uppercase tracking-wider">
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-[#111111] p-6 rounded-2xl text-center border-dashed border-white/10">
                  <p className="text-xs text-gray-500">Belum ada riwayat perhitungan.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
