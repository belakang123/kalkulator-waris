import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Navigation, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Mosque {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance: number;
}

const MasjidTerdekat: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

  // Haversine formula to calculate distance in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Paksa aktifkan GPS via Android bridge saat halaman dibuka
  useEffect(() => {
    if (typeof (window as any).AndroidBridge !== 'undefined') {
      (window as any).AndroidBridge.checkAndEnableGps();
    }
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Overpass API Query: Find mosques within 3000 meters
            const query = `[out:json][timeout:15];node(around:3000,${latitude},${longitude})[amenity=place_of_worship][religion=muslim];out;`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            
            const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            const data = await res.json();
            
            if (data && data.elements) {
              const foundMosques = data.elements
                .filter((el: any) => el.tags && el.tags.name)
                .map((el: any) => {
                  return {
                    id: el.id,
                    name: el.tags.name,
                    lat: el.lat,
                    lon: el.lon,
                    distance: calculateDistance(latitude, longitude, el.lat, el.lon)
                  };
                })
                .sort((a: Mosque, b: Mosque) => a.distance - b.distance)
                .slice(0, 15); // Top 15 closest
              
              setMosques(foundMosques);
            } else {
              setError('Tidak ada data masjid ditemukan di sekitar Anda.');
            }
          } catch (err) {
            setError('Gagal memuat data dari server peta.');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError(`Gagal mendapatkan lokasi (${err.message}). Pastikan GPS aktif dan coba lagi.`);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation tidak didukung di browser ini.');
      setLoading(false);
    }
  }, []);

  const openGoogleMaps = (lat: number, lon: number) => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isAndroid) {
      // Gunakan geo: URI — paling andal di Android WebView, langsung buka Google Maps
      window.location.href = `geo:${lat},${lon}?q=${lat},${lon}`;
    } else {
      // Fallback untuk iOS / Desktop
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <div className="min-h-screen w-full bg-dark font-sans overflow-hidden">
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-[100dvh] relative flex flex-col shadow-2xl shadow-white/5 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center shadow-xl z-50">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Masjid Terdekat</h2>
              <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                Radius 3 km
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {loading ? (
            <div className="animate-pulse space-y-4 pt-1">
              <div className="h-3 w-32 bg-white/20 rounded mb-4"></div>
              
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass-card p-4 rounded-2xl border border-white/10 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.03)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-white/20 shrink-0 mt-0.5"></div>
                      <div className="space-y-2.5 w-full mt-1.5">
                        <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                        <div className="h-3 w-1/2 bg-white/20 rounded"></div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/20 shrink-0"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-card p-6 rounded-2xl text-center border-dashed border-red-500/20">
              <p className="text-sm text-red-400 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition-colors border border-white/10">
                Muat Ulang
              </button>
            </div>
          ) : mosques.length === 0 ? (
            <div className="glass-card p-6 rounded-2xl text-center border-dashed border-white/20">
              <p className="text-sm text-gray-400">Tidak ada masjid yang terdeteksi dalam radius 3 km.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 font-medium">Ditemukan {mosques.length} Masjid</p>
              
              {mosques.map((mosque) => (
                <div key={mosque.id} className="glass-card p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all hover:bg-white/5 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 mt-0.5 shrink-0 group-hover:bg-neonBlue/10 group-hover:text-neonBlue transition-colors">
                        <MapPin size={18} />
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-sm font-bold text-white leading-snug truncate">{mosque.name}</h3>
                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5 font-medium truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-neonGreen shrink-0"></span>
                          {formatDistance(mosque.distance)}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedMosque(mosque)}
                      className="w-10 h-10 rounded-xl bg-neonBlue/10 flex items-center justify-center text-neonBlue shrink-0 hover:bg-neonBlue hover:text-dark transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,225,255,0.15)]"
                      title="Lihat Peta"
                    >
                      <Navigation size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Modal Navigasi Masjid */}
        {selectedMosque && (
          <div className="absolute inset-0 z-[100] flex items-end justify-center pb-6 px-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedMosque(null)}>
            <div
              className="bg-[#111111] border border-white/10 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Info Masjid */}
              <div className="px-5 pt-4 pb-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neonBlue/10 flex items-center justify-center text-neonBlue shrink-0 shadow-[0_0_20px_rgba(0,225,255,0.2)]">
                    <MapPin size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base leading-snug">{selectedMosque.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neonGreen shrink-0" />
                      {formatDistance(selectedMosque.distance)} dari lokasi Anda
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      {selectedMosque.lat.toFixed(5)}, {selectedMosque.lon.toFixed(5)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMosque(null)}
                    className="w-8 h-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-5 my-4 h-px bg-white/5" />

              {/* Actions */}
              <div className="px-5 pb-6 flex flex-col gap-3">
                <button
                  onClick={() => openGoogleMaps(selectedMosque.lat, selectedMosque.lon)}
                  className="w-full py-3.5 rounded-xl bg-neonBlue text-dark font-bold flex items-center justify-center gap-2 hover:bg-neonBlue/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,225,255,0.35)]"
                >
                  <Navigation size={18} />
                  Mulai Navigasi Rute
                </button>
                <p className="text-center text-[10px] text-gray-500">
                  Membuka Google Maps untuk rute ke masjid ini
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MasjidTerdekat;
