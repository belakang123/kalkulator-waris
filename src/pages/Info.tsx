import React, { useState } from 'react';
import { ArrowLeft, Info as InfoIcon, Shield, Code, CheckCircle2, Heart, ChevronDown, Star, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.exatemplate.warissync';

const Info: React.FC = () => {
  const navigate = useNavigate();
  const [expandedInfo, setExpandedInfo] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRateApp = () => {
    // Buka Play Store via intent URI (native Android), fallback ke browser
    const intentUrl =
      `intent://details?id=com.exatemplate.warissync` +
      `#Intent;scheme=market;package=com.android.vending;` +
      `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;
    window.location.href = intentUrl;
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'WarisSync – Kalkulator Waris Islam',
      text: 'Coba WarisSync! Aplikasi perhitungan harta warisan (Faraid) berbasis syariat Islam, dilengkapi arah kiblat, jadwal sholat, & asisten AI.',
      url: PLAY_STORE_URL,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (_) {
        // User membatalkan share sheet, abaikan
      }
    } else {
      // Fallback: salin link ke clipboard
      try {
        await navigator.clipboard.writeText(PLAY_STORE_URL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (_) {}
    }
  };

  const systemInfos = [
    {
      id: 1,
      title: "Smart Faraid Engine",
      subtitle: "Algoritma perhitungan akurasi tinggi",
      icon: <Code size={18} />,
      iconBg: "bg-neonBlue/10",
      iconColor: "text-neonBlue",
      content: (
        <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
          <p>
            Mesin utama di balik layar WarisSync dibangun dengan algoritma khusus yang telah disempurnakan untuk menangani ratusan kemungkinan kombinasi skenario ahli waris secara instan.
          </p>
          <ul className="list-disc pl-4 space-y-1 text-gray-400">
            <li>Mendeteksi otomatis siapa yang mendapat Hijab Hirman (terhalang) dan Nuqshan (pengurangan).</li>
            <li>Melakukan validasi asabah dan konversi sisa harta secara sistematis.</li>
            <li>Menyelesaikan kasus khusus seperti 'Aul, Radd, dan Gharrawain dengan sangat presisi.</li>
          </ul>
        </div>
      )
    },
    {
      id: 2,
      title: "Privasi & Keamanan Data",
      subtitle: "Data diolah secara lokal (Offline First)",
      icon: <Shield size={18} />,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      content: (
        <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
          <p>
            Kami sangat menghargai privasi informasi keluarga dan finansial Anda. Oleh karena itu, WarisSync dirancang menggunakan arsitektur <strong>Offline First</strong>.
          </p>
          <ul className="list-disc pl-4 space-y-1 text-gray-400">
            <li>Semua data keluarga dan perhitungan diproses sepenuhnya di dalam perangkat Anda.</li>
            <li>Tidak ada data rahasia maupun harta warisan yang diunggah ke server eksternal.</li>
            <li>Bahkan tanpa koneksi internet sama sekali, Anda tetap dapat melakukan perhitungan waris secara penuh.</li>
          </ul>
        </div>
      )
    },
    {
      id: 3,
      title: "Kompilasi Hukum Islam",
      subtitle: "Disesuaikan dengan standar KHI",
      icon: <CheckCircle2 size={18} />,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      content: (
        <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
          <p>
            Sistem perhitungan kami secara ketat mengikuti pedoman fikih Islam mayoritas (Jumhur Ulama) dan dapat diselaraskan dengan Kompilasi Hukum Islam (KHI) yang berlaku di Indonesia.
          </p>
          <ul className="list-disc pl-4 space-y-1 text-gray-400">
            <li>Mendukung opsi pemisahan Harta Bersama (Gono-gini) secara otomatis.</li>
            <li>Sistem akan mengklasifikasikan ahli waris dan porsinya sesuai asas keadilan berimbang (1:2 antara laki-laki dan perempuan) pada kondisi ahli waris tertentu.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen w-full bg-dark font-sans overflow-hidden">
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-[100dvh] relative flex flex-col shadow-2xl shadow-neonBlue/5 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center shadow-xl z-50">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <InfoIcon size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Info Aplikasi</h2>
              <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                WarisSync v1.7
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          
          {/* Logo / Banner */}
          <div className="glass-card rounded-[2rem] p-8 flex flex-col items-center justify-center border border-white/5 bg-gradient-to-br from-neonBlue/10 to-neonGreen/10 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-neonBlue/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-neonGreen/20 rounded-full blur-3xl"></div>
            
            <div className="w-20 h-20 bg-dark rounded-3xl shadow-2xl border border-white/10 flex items-center justify-center mb-4 relative z-10">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-neonBlue to-neonGreen text-3xl font-extrabold">W</span>
            </div>
            
            <h1 className="text-2xl font-extrabold text-white tracking-tight relative z-10">
              Waris<span className="font-light">Sync</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1 relative z-10 text-center">
              Sistem Perhitungan Faraid Cerdas
            </p>
            
            <div className="mt-4 bg-dark/50 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full relative z-10">
              <p className="text-[10px] font-bold text-neonGreen tracking-widest uppercase">Versi 1.7</p>
            </div>
          </div>

          {/* Fitur Utama */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Tentang Aplikasi</h3>
            <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                WarisSync adalah aplikasi perhitungan harta waris (Faraid) berbasis syariat Islam yang dilengkapi dengan asisten AI dan fitur pelengkap ibadah seperti arah kiblat dan jadwal sholat.
              </p>
            </div>
          </div>

          {/* Info Sistem */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Sistem Inti & Keamanan</h3>
            <div className="space-y-3">
              {systemInfos.map((info) => (
                <div 
                  key={info.id} 
                  className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                    expandedInfo === info.id 
                      ? 'border-white/20 bg-[#111827]/80 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                      : 'border-white/5 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <button
                    onClick={() => setExpandedInfo(expandedInfo === info.id ? null : info.id)}
                    className="w-full p-4 flex items-center justify-between gap-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${info.iconBg} flex items-center justify-center ${info.iconColor} shrink-0 transition-transform ${expandedInfo === info.id ? 'scale-110' : ''}`}>
                        {info.icon}
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold transition-colors ${expandedInfo === info.id ? 'text-white' : 'text-gray-200'}`}>
                          {info.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{info.subtitle}</p>
                      </div>
                    </div>
                    <div className={`shrink-0 transition-transform duration-300 ${
                      expandedInfo === info.id ? 'rotate-180 text-white' : 'text-gray-500'
                    }`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  
                  {/* Expandable Content */}
                  {expandedInfo === info.id && (
                    <div className="pb-5 px-5">
                      <div className="w-full h-[1px] bg-white/5 mb-4"></div>
                      {info.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Dukung Kami</h3>
            <div className="flex flex-col gap-3">
              {/* Beri Ulasan */}
              <button
                onClick={handleRateApp}
                className="glass-card w-full flex items-center gap-4 p-4 rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 hover:from-yellow-500/20 hover:border-yellow-400/40 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(234,179,8,0.08)] group"
              >
                <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400/20 group-hover:scale-110 transition-all duration-200 shadow-[0_0_15px_rgba(234,179,8,0.2)] shrink-0">
                  <Star size={22} className="fill-yellow-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-white leading-snug">Beri Ulasan</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Bantu kami berkembang di Google Play</p>
                </div>
                <div className="text-gray-600 shrink-0">›</div>
              </button>

              {/* Bagikan Aplikasi */}
              <button
                onClick={handleShareApp}
                className="glass-card w-full flex items-center gap-4 p-4 rounded-2xl border border-neonBlue/20 bg-gradient-to-br from-neonBlue/10 to-cyan-500/5 hover:from-neonBlue/20 hover:border-neonBlue/40 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(0,225,255,0.08)] group"
              >
                <div className="w-12 h-12 rounded-full bg-neonBlue/10 flex items-center justify-center text-neonBlue group-hover:bg-neonBlue/20 group-hover:scale-110 transition-all duration-200 shadow-[0_0_15px_rgba(0,225,255,0.2)] shrink-0">
                  <Share2 size={22} />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-white leading-snug">
                    {copied ? 'Link Disalin!' : 'Bagikan Aplikasi'}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {copied ? '✓ Link berhasil disalin ke clipboard' : 'Rekomendasikan ke teman & keluarga'}
                  </p>
                </div>
                <div className="text-gray-600 shrink-0">›</div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 pb-4 text-center">
            <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
              Dibuat dengan <Heart size={12} className="text-red-500 fill-red-500" /> oleh Tim exatemplate.com
            </p>
            <p className="text-[9px] text-gray-600 mt-1">
              &copy; {new Date().getFullYear()} WarisSync. Hak Cipta Dilindungi.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Info;
