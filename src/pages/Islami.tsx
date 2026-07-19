import React, { useState } from 'react';
import { Moon, Sparkles, MapPin, Clock, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Islami: React.FC = () => {
  const navigate = useNavigate();


  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const banners = [
    {
      type: "Mutiara Hadis",
      content: '"Barangsiapa menempuh jalan untuk menuntut ilmu, maka Allah akan mudahkan baginya jalan menuju surga."',
      source: "(HR. Muslim)",
      icon: <Sparkles size={16} className="text-emerald-400" />,
      gradient: "from-emerald-900/40 to-[#0A0A0A]",
      border: "border-emerald-500/20",
      textClass: "text-emerald-400",
      glow1: "bg-emerald-500/20",
      glow2: "bg-neonBlue/10"
    },
    {
      type: "Keutamaan Sedekah",
      content: '"Sedekah itu dapat menghapus dosa sebagaimana air memadamkan api."',
      source: "(HR. Tirmidzi)",
      icon: <Sparkles size={16} className="text-neonBlue" />,
      gradient: "from-blue-900/40 to-[#0A0A0A]",
      border: "border-blue-500/20",
      textClass: "text-neonBlue",
      glow1: "bg-blue-500/20",
      glow2: "bg-purple-500/10"
    },
    {
      type: "Doa Harian",
      content: '"Rabbana atina fiddunya hasanah wa fil akhiroti hasanah waqina adzabannar."',
      source: "(Al-Baqarah: 201)",
      icon: <Sparkles size={16} className="text-yellow-400" />,
      gradient: "from-yellow-900/40 to-[#0A0A0A]",
      border: "border-yellow-500/20",
      textClass: "text-yellow-400",
      glow1: "bg-yellow-500/20",
      glow2: "bg-orange-500/10"
    }
  ];

  React.useEffect(() => {
    // Simulate loading effect for the UI
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds
    return () => clearInterval(interval);
  }, [loading, banners.length]);

  return (
    <div className="min-h-screen w-full bg-dark font-sans overflow-hidden">
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-[100dvh] relative flex flex-col shadow-2xl shadow-neonGreen/5 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center justify-between shadow-xl z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neonGreen/10 flex items-center justify-center text-neonGreen">
              <Moon size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Islami</h2>
              <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                Fitur & Layanan Islami
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
          
          {loading ? (
            <div className="animate-pulse">
              {/* Banner Skeleton */}
              <div className="mx-6 mt-6 mb-4 h-40 rounded-3xl bg-white/10 border border-white/10"></div>
              
              {/* Icons Skeleton */}
              <div className="px-8 mt-8 mb-8 flex justify-between">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"></div>
                    <div className="h-2 w-16 bg-white/10 rounded mt-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Hero Banner Carousel */}
              <div className="mx-6 mt-6 mb-4 h-40 relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-[#0A0A0A]">
                
                {/* Scrolling Container */}
                <div 
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
                >
                  {banners.map((banner, idx) => (
                    <div key={idx} className={`w-full h-full flex-shrink-0 p-6 bg-gradient-to-br ${banner.gradient} border ${banner.border} relative overflow-hidden`}>
                      <div className={`absolute -top-12 -right-12 w-32 h-32 ${banner.glow1} rounded-full blur-3xl`}></div>
                      <div className={`absolute -bottom-8 -left-8 w-24 h-24 ${banner.glow2} rounded-full blur-2xl`}></div>
                      
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {banner.icon}
                            <span className={`text-[10px] font-bold ${banner.textClass} uppercase tracking-widest`}>{banner.type}</span>
                          </div>
                          <p className="text-[13px] text-gray-200 font-medium leading-relaxed italic line-clamp-3">
                            {banner.content}
                          </p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-semibold text-right">
                          {banner.source}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dot Indicators */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                  {banners.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1 rounded-full transition-all duration-300 ${idx === currentBannerIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Action Buttons (3 Circular Icons) */}
              <div className="px-8 mt-8 mb-8 flex justify-between relative z-20">
                {/* Button 1: Jadwal Sholat */}
                <div className="flex flex-col items-center gap-3">
                  <button 
                    onClick={() => navigate('/jadwal-sholat')}
                    className="w-[4.5rem] h-[4.5rem] rounded-full glass-card bg-[#111111]/90 flex items-center justify-center text-neonGreen hover:bg-neonGreen/20 transition-all shadow-[0_0_15px_rgba(80,255,176,0.15)] group"
                  >
                    <Clock size={28} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <span className="text-[11px] text-gray-400 font-medium">Jadwal Sholat</span>
                </div>

                {/* Button 2: Arah Kiblat */}
                <div className="flex flex-col items-center gap-3">
                  <button 
                    onClick={() => navigate('/arah-kiblat')}
                    className="w-[4.5rem] h-[4.5rem] rounded-full glass-card bg-[#111111]/90 flex items-center justify-center text-neonBlue hover:bg-neonBlue/20 transition-all shadow-[0_0_15px_rgba(0,225,255,0.15)] group"
                  >
                    <Compass size={28} className="group-hover:rotate-45 transition-transform duration-500" />
                  </button>
                  <span className="text-[11px] text-gray-400 font-medium">Arah Kiblat</span>
                </div>

                {/* Button 3: Masjid Sekitar */}
                <div className="flex flex-col items-center gap-3">
                  <button 
                    onClick={() => navigate('/masjid-terdekat')}
                    className="w-[4.5rem] h-[4.5rem] rounded-full glass-card bg-[#111111]/90 flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] group"
                  >
                    <MapPin size={28} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <span className="text-[11px] text-gray-400 font-medium text-center">Masjid Terdekat</span>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default Islami;
