import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Calendar, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const JadwalSholat: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timings, setTimings] = useState<PrayerTimes | null>(null);
  const [locationName, setLocationName] = useState('Mengambil lokasi...');
  const [dateStr, setDateStr] = useState('');

  // Paksa aktifkan GPS via Android bridge saat halaman dibuka
  useEffect(() => {
    if (typeof (window as any).AndroidBridge !== 'undefined') {
      (window as any).AndroidBridge.checkAndEnableGps();
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem('waris_jadwal_sholat');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const today = new Date().toLocaleDateString();
        
        // Gunakan cache jika tanggal hari ini masih sama
        if (parsed.savedDate === today) {
          setTimings(parsed.timings);
          setLocationName(parsed.locationName);
          setDateStr(parsed.dateStr);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to parse cached jadwal', e);
      }
    }
    
    // Jika tidak ada cache atau sudah berganti hari, ambil data baru
    fetchLocationAndJadwal();
  }, []);

  const fetchLocationAndJadwal = () => {
    setLoading(true);
    setError('');
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Fetch Jadwal
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=20`, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            const data = await res.json();
            
            if (data.code === 200) {
              const newTimings = data.data.timings;
              const newDateStr = data.data.date.readable;
              let newLocationName = 'Lokasi ditemukan';
              
              // Reverse geocoding
              try {
                const geoController = new AbortController();
                const geoTimeoutId = setTimeout(() => geoController.abort(), 5000);
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
                  signal: geoController.signal
                });
                clearTimeout(geoTimeoutId);
                const geoData = await geoRes.json();
                newLocationName = geoData.address.city || geoData.address.town || geoData.address.village || 'Lokasi Anda';
              } catch (e) {
                newLocationName = 'Lokasi ditemukan';
              }

              setTimings(newTimings);
              setDateStr(newDateStr);
              setLocationName(newLocationName);

              // Simpan ke localStorage
              localStorage.setItem('waris_jadwal_sholat', JSON.stringify({
                timings: newTimings,
                dateStr: newDateStr,
                locationName: newLocationName,
                savedDate: new Date().toLocaleDateString()
              }));
              
            } else {
              setError('Gagal memuat jadwal sholat.');
            }
          } catch (err) {
            setError('Terjadi kesalahan jaringan saat mengambil jadwal.');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError(`Gagal mendapatkan lokasi (${err.message}). Pastikan GPS aktif untuk melihat jadwal lokal.`);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation tidak didukung di perangkat/browser ini.');
      setLoading(false);
    }
  };

  const prayerList = timings ? [
    { id: 'Fajr', name: 'Subuh', time: timings.Fajr },
    { id: 'Sunrise', name: 'Terbit', time: timings.Sunrise },
    { id: 'Dhuhr', name: 'Dzuhur', time: timings.Dhuhr },
    { id: 'Asr', name: 'Ashar', time: timings.Asr },
    { id: 'Maghrib', name: 'Maghrib', time: timings.Maghrib },
    { id: 'Isha', name: 'Isya', time: timings.Isha },
  ] : [];

  return (
    <div className="min-h-screen w-full bg-dark font-sans overflow-hidden">
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-[100dvh] relative flex flex-col shadow-2xl shadow-neonGreen/5 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center shadow-xl z-50">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-neonGreen/10 flex items-center justify-center text-neonGreen">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Jadwal Sholat</h2>
              <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                Real-time data
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10 p-6">
          {loading ? (
            <div className="animate-pulse">
              {/* Location Card Skeleton */}
              <div className="glass-card p-5 rounded-2xl flex items-center justify-between mb-8 border border-white/10 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 shrink-0"></div>
                  <div className="space-y-2.5">
                    <div className="h-4 w-32 bg-white/20 rounded"></div>
                    <div className="h-3 w-24 bg-white/20 rounded"></div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20"></div>
              </div>

              <div className="h-4 w-28 bg-white/20 rounded mb-5 ml-1"></div>

              {/* Prayer List Skeleton */}
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-4 rounded-2xl flex items-center justify-between border border-white/10 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20"></div>
                      <div className="h-4 w-20 bg-white/20 rounded"></div>
                    </div>
                    <div className="h-5 w-16 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="glass-card p-6 rounded-2xl text-center border-dashed border-red-500/20">
              <p className="text-sm text-red-400 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition-colors border border-white/10">
                Muat Ulang
              </button>
            </div>
          ) : (
            <>
              {/* Location Card */}
              <div className="glass-card p-5 rounded-2xl flex items-center justify-between mb-8 border border-neonGreen/20 shadow-[0_0_20px_rgba(80,255,176,0.05)] bg-gradient-to-br from-[#111A16] to-[#0D131C]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neonGreen/10 flex items-center justify-center text-neonGreen shrink-0 shadow-[0_0_15px_rgba(80,255,176,0.2)]">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{locationName}</h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                      <Calendar size={12} className="text-neonBlue" /> {dateStr}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={fetchLocationAndJadwal}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-neonGreen hover:bg-neonGreen/10 transition-colors shadow-inner"
                  title="Sinkronisasi Ulang Lokasi"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              <h4 className="text-sm font-semibold text-white/80 mb-4 px-1">Jadwal Hari Ini</h4>

              {/* Prayer List */}
              <div className="space-y-3">
                {prayerList.map((prayer, index) => {
                  return (
                    <div 
                      key={index}
                      className="glass-card p-4 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-gray-500 group-hover:text-neonGreen transition-colors" />
                        <span className="text-sm font-medium text-white">{prayer.name}</span>
                      </div>
                      <span className="text-base font-bold text-neonGreen tracking-wide">{prayer.time}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JadwalSholat;
