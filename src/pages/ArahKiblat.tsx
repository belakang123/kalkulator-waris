import React, { useState, useEffect } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArahKiblat: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [isAbsolute, setIsAbsolute] = useState(false);

  // Paksa aktifkan GPS via Android bridge saat halaman dibuka
  useEffect(() => {
    if (typeof (window as any).AndroidBridge !== 'undefined') {
      (window as any).AndroidBridge.checkAndEnableGps();
    }
  }, []);

  useEffect(() => {
    // 1. Get Location & Qibla Angle
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const res = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            const data = await res.json();
            
            if (data.code === 200) {
              setQiblaAngle(data.data.direction);
              setupCompass();
            } else {
              setError('Gagal mendapatkan arah Kiblat dari server.');
            }
          } catch (err) {
            setError('Terjadi kesalahan jaringan saat mengambil data kiblat.');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError(`Gagal mendapatkan lokasi (${err.message}). Pastikan GPS aktif dan akurat.`);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation tidak didukung pada browser ini.');
      setLoading(false);
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const setupCompass = () => {
    if (window.DeviceOrientationEvent) {
      if ('ondeviceorientationabsolute' in window) {
        window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
      } else {
        (window as any).addEventListener('deviceorientation', handleOrientation as EventListener, true);
      }
    } else {
      setError('Sensor orientasi perangkat (Kompas) tidak didukung/ditemukan.');
    }
  };

  const handleOrientation = (event: any) => {
    let heading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
    if (heading != null) {
      setDeviceHeading(heading);
      setIsAbsolute(event.absolute || event.webkitCompassHeading !== undefined);
    }
  };

  // Calculate rotation for the compass needle (Qibla pointer)
  const qiblaPointerRotation = qiblaAngle !== null ? qiblaAngle - deviceHeading : 0;
  
  // Highlight if aligned within 5 degrees
  const isAligned = Math.abs(qiblaPointerRotation % 360) < 5 || Math.abs((qiblaPointerRotation % 360) - 360) < 5;

  return (
    <div className="min-h-screen w-full bg-dark font-sans overflow-hidden">
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-[100dvh] relative flex flex-col shadow-2xl shadow-neonBlue/5 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center shadow-xl z-50">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-neonBlue/10 flex items-center justify-center text-neonBlue">
              <Compass size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Arah Kiblat</h2>
              <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                Kalibrasi kompas Anda
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center justify-center p-6 relative">
          {loading ? (
            <div className="animate-pulse flex flex-col items-center w-full mt-[-40px]">
              {/* Compass Skeleton */}
              <div className="w-72 h-72 rounded-full border-[6px] border-white/10 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] mb-12 flex items-center justify-center relative">
                 <div className="absolute top-[-10px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[15px] border-transparent border-b-white/30"></div>
                 <div className="w-4 h-4 rounded-full bg-white/20"></div>
              </div>
              
              {/* Status Display Skeleton */}
              <div className="glass-card w-full p-6 rounded-3xl border border-white/10 bg-white/10">
                <div className="h-6 w-48 bg-white/20 rounded mx-auto mb-6"></div>
                <div className="flex justify-around items-center p-3 bg-white/10 rounded-xl">
                  <div className="w-20 space-y-2">
                    <div className="h-2 w-16 bg-white/20 rounded mx-auto"></div>
                    <div className="h-5 w-12 bg-white/20 rounded mx-auto"></div>
                  </div>
                  <div className="w-[1px] h-8 bg-white/20"></div>
                  <div className="w-20 space-y-2">
                    <div className="h-2 w-16 bg-white/20 rounded mx-auto"></div>
                    <div className="h-5 w-12 bg-white/20 rounded mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="glass-card p-6 rounded-2xl text-center border-dashed border-red-500/20 w-full">
              <p className="text-sm text-red-400 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition-colors border border-white/10">
                Muat Ulang
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full mt-[-40px]">
              
              {/* Native-like SVG Compass Dial */}
              <div className="relative mb-12 flex items-center justify-center w-[320px] h-[320px] filter drop-shadow-2xl">
                <svg viewBox="0 0 320 320" className="w-full h-full overflow-visible">
                  {/* Outer Bezel */}
                  <circle cx="160" cy="160" r="150" fill="#0A0A0A" stroke="#1F1F1F" strokeWidth="10" />
                  <circle cx="160" cy="160" r="145" fill="none" stroke="#000" strokeWidth="2" />
                  
                  {/* Static Fixed Pointer (Phone Heading) */}
                  <polygon 
                    points="160,0 172,-15 148,-15" 
                    fill={isAligned ? "#00E1FF" : "#FFFFFF"} 
                    className="transition-colors duration-500 drop-shadow-lg"
                  />

                  {/* Rotating Dial Group */}
                  <g style={{ transform: `rotate(${-deviceHeading}deg)`, transformOrigin: '160px 160px', transition: 'transform 0.15s ease-out' }}>
                    {/* Inner Dial Background */}
                    <circle cx="160" cy="160" r="140" fill="#141414" />
                    
                    {/* Tick Marks and Degree Numbers */}
                    {[...Array(180)].map((_, i) => {
                      const angle = i * 2;
                      const isPrimary = angle % 90 === 0;
                      const isSecondary = angle % 30 === 0;
                      const isTertiary = angle % 10 === 0;
                      
                      let length = 5;
                      let strokeWidth = 1;
                      let color = "#444";
                      
                      if (isPrimary) {
                        length = 16; strokeWidth = 3; color = angle === 0 ? "#EF4444" : "#FFFFFF";
                      } else if (isSecondary) {
                        length = 12; strokeWidth = 2; color = "#888";
                      } else if (isTertiary) {
                        length = 8; strokeWidth = 1.5; color = "#666";
                      }

                      return (
                        <g key={`tick-${angle}`} style={{ transform: `rotate(${angle}deg)`, transformOrigin: '160px 160px' }}>
                          <line x1="160" y1="20" x2="160" y2={20 + length} stroke={color} strokeWidth={strokeWidth} />
                          {isSecondary && !isPrimary && (
                            <text 
                              x="160" 
                              y="46" 
                              fill="#666" 
                              fontSize="11" 
                              fontWeight="bold" 
                              textAnchor="middle" 
                              transform={angle > 90 && angle < 270 ? `rotate(180 160 42)` : ''}
                            >
                              {angle}°
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Cardinal Direction Letters */}
                    <g transform="rotate(0 160 160)"><text x="160" y="52" fill="#EF4444" fontSize="24" fontWeight="900" textAnchor="middle">U</text></g>
                    <g transform="rotate(90 160 160)"><text x="160" y="52" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle">T</text></g>
                    <g transform="rotate(180 160 160)"><text x="160" y="52" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle">S</text></g>
                    <g transform="rotate(270 160 160)"><text x="160" y="52" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle">B</text></g>

                    {/* Classic North/South Needle (Background) */}
                    <g opacity="0.3">
                      {/* Red North half */}
                      <polygon points="160,70 168,160 160,160" fill="#EF4444" />
                      <polygon points="160,70 152,160 160,160" fill="#B91C1C" />
                      {/* White South half */}
                      <polygon points="160,250 168,160 160,160" fill="#E5E7EB" />
                      <polygon points="160,250 152,160 160,160" fill="#9CA3AF" />
                    </g>

                    {/* Qibla Indicator */}
                    {qiblaAngle !== null && (
                      <g style={{ transform: `rotate(${qiblaAngle}deg)`, transformOrigin: '160px 160px' }}>
                        {/* Line to Kaaba */}
                        <line 
                          x1="160" y1="160" x2="160" y2="40" 
                          stroke={isAligned ? "#00E1FF" : "#50FFB0"} 
                          strokeWidth="2.5" 
                          strokeDasharray="4 2"
                          className="transition-colors duration-500"
                        />
                        {/* Glow behind Kaaba when aligned */}
                        {isAligned && (
                           <circle cx="160" cy="22" r="20" fill="#00E1FF" opacity="0.3" filter="blur(4px)" />
                        )}
                        
                        {/* Kaaba Icon (SVG drawn) */}
                        <g transform="translate(146, 12)" className={`transition-transform duration-500 ${isAligned ? 'scale-110' : ''}`} style={{ transformOrigin: '14px 10px' }}>
                          <rect x="0" y="0" width="28" height="32" fill="#111" stroke="#333" strokeWidth="1" rx="2" />
                          <rect x="0" y="6" width="28" height="4" fill="#EAB308" />
                          <rect x="0" y="12" width="28" height="1.5" fill="#EAB308" />
                        </g>
                      </g>
                    )}

                    {/* Center Pin */}
                    <circle cx="160" cy="160" r="10" fill="#1A1A1A" stroke="#444" strokeWidth="3" />
                    <circle cx="160" cy="160" r="3" fill={isAligned ? "#00E1FF" : "#50FFB0"} className="transition-colors duration-500" />
                  </g>
                </svg>
              </div>

              {/* Status Display */}
              <div className="glass-card w-full p-6 rounded-3xl text-center border border-white/5 relative overflow-hidden shadow-2xl">
                {isAligned && <div className="absolute inset-0 bg-neonBlue/20 blur-2xl"></div>}
                <div className="relative z-10">
                  <h3 className={`font-bold text-xl mb-2 transition-colors duration-500 ${isAligned ? 'text-neonBlue drop-shadow-[0_0_10px_rgba(0,225,255,0.8)]' : 'text-white'}`}>
                    {isAligned ? 'Arah Kiblat Sesuai!' : 'Putar Perangkat Anda'}
                  </h3>
                  <div className="flex justify-around items-center mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Sudut Kiblat</p>
                      <p className="text-lg font-bold text-white">{qiblaAngle?.toFixed(1)}°</p>
                    </div>
                    <div className="w-[1px] h-8 bg-white/10"></div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Heading</p>
                      <p className="text-lg font-bold text-white">{deviceHeading.toFixed(1)}°</p>
                    </div>
                  </div>
                  
                  {!isAbsolute && (
                     <p className="text-[10px] text-yellow-500/90 mt-4 bg-yellow-500/10 p-2.5 rounded-lg border border-yellow-500/20 text-left flex items-start gap-2">
                       <span className="text-lg shrink-0 leading-none">⚠️</span> Sensor mungkin tidak menunjukkan utara mutlak. Gunakan kalibrasi angka 8 di udara.
                     </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArahKiblat;
