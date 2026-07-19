import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Users, Wallet, CreditCard, FileText, ChevronRight, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Member {
  id: number;
  relId: string;
  relLabel: string;
  name: string;
  status: 'hidup' | 'meninggal';
}

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  
  const [assets, setAssets] = useState<string>('');
  const [funeral, setFuneral] = useState<string>('');
  const [debts, setDebts] = useState<string>('');
  const [wills, setWills] = useState<string>('');
  
  const [hukumType, setHukumType] = useState<'jumhur' | 'khi'>('jumhur');
  const [gonoGini, setGonoGini] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('waris_members');
    if (saved) {
      setMembers(JSON.parse(saved));
    }
  }, []);

  const livingMembers = members.filter(m => m.status === 'hidup');
  const hasSpouse = livingMembers.some(m => m.relId === 'suami' || m.relId === 'istri');

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah;
  };

  const handleCurrencyChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(formatRupiah(e.target.value));
  };

  const handleCalculate = () => {
    const calcState = {
      members: livingMembers,
      assets,
      funeral,
      debts,
      wills,
      hukumType,
      gonoGini: hukumType === 'khi' && hasSpouse ? gonoGini : '0'
    };

    // Simpan ke Riwayat (History)
    const savedHistory = localStorage.getItem('waris_history');
    const historyList = savedHistory ? JSON.parse(savedHistory) : [];
    
    const historyItem = {
      id: Date.now(),
      name: `Perhitungan Waris`,
      date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
      timestamp: Date.now(),
      heirs: livingMembers.length,
      status: 'Selesai',
      state: calcState
    };

    localStorage.setItem('waris_history', JSON.stringify([historyItem, ...historyList]));

    // Navigasi ke halaman hasil dengan membawa state perhitungan
    navigate('/result', { state: calcState });
  };

  return (
    <div className="h-[100dvh] w-full bg-dark font-sans overflow-hidden">
      {/* Mobile App Container */}
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-full relative overflow-hidden shadow-2xl shadow-neonBlue/10">
        
        {/* Header */}
        <div className="absolute top-0 left-0 w-full bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center shadow-xl z-50">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-neonBlue/20 flex items-center justify-center text-neonBlue">
              <DollarSign size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Kalkulator Waris</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Masukkan rincian harta & kewajiban
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="absolute top-[76px] bottom-[84px] w-full overflow-y-auto no-scrollbar p-6">
          
          <div className="space-y-6">

            {/* Referensi Hukum */}
            <div>
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Scale size={14} className="text-neonBlue" />
                Pilih Referensi Hukum
              </label>
              <div className="flex bg-[#141414] rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setHukumType('jumhur')}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${
                    hukumType === 'jumhur' ? 'bg-neonBlue/15 text-neonBlue shadow-md border border-neonBlue/30' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Jumhur Ulama (Murni)
                </button>
                <button
                  onClick={() => setHukumType('khi')}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${
                    hukumType === 'khi' ? 'bg-neonGreen/15 text-neonGreen shadow-md border border-neonGreen/30' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  KHI (Indonesia)
                </button>
              </div>
            </div>

            {/* Harta Gono Gini (Hanya KHI & Ada Pasangan) */}
            {hukumType === 'khi' && hasSpouse && (
              <div className="animate-fade-in bg-neonGreen/5 border border-neonGreen/20 p-4 rounded-xl space-y-3">
                <label className="text-[11px] font-bold text-neonGreen uppercase tracking-wider flex items-center gap-2">
                  <Wallet size={14} />
                  Harta Bersama (Gono-Gini)
                </label>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Dalam KHI, pasangan yang hidup berhak atas 50% harta bersama sebelum harta waris dibagikan. Masukkan nominal harta bersama di sini:
                </p>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neonGreen/70 font-bold">Rp</div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={gonoGini}
                    onChange={handleCurrencyChange(setGonoGini)}
                    placeholder="0"
                    className="w-full bg-[#0A0A0A] border border-neonGreen/30 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-neonGreen focus:bg-black transition-all"
                  />
                </div>
              </div>
            )}
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* Harta Peninggalan */}
            <div>
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Wallet size={14} className="text-neonGreen" />
                Total Harta Peninggalan
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={assets}
                  onChange={handleCurrencyChange(setAssets)}
                  placeholder="0"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-lg font-bold text-white placeholder-gray-600 focus:outline-none focus:border-neonGreen/50 focus:bg-[#1A1A1A] transition-all shadow-inner"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-2">Termasuk uang tunai, properti, kendaraan, emas, dll.</p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Kewajiban */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                Kewajiban Almarhum (Hak yang harus ditunaikan)
              </h3>
              
              <div>
                <label className="text-[10px] text-gray-400 mb-1 flex items-center gap-1.5">
                  <CreditCard size={12} className="text-red-400" />
                  Biaya Pemakaman / Tajhiz
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={funeral}
                    onChange={handleCurrencyChange(setFuneral)}
                    placeholder="0"
                    className="w-full bg-[#141414] border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-400/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 mb-1 flex items-center gap-1.5">
                  <FileText size={12} className="text-red-400" />
                  Hutang (Kepada Allah & Manusia)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={debts}
                    onChange={handleCurrencyChange(setDebts)}
                    placeholder="0"
                    className="w-full bg-[#141414] border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-400/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 mb-1 flex items-center gap-1.5">
                  <FileText size={12} className="text-neonBlue" />
                  Wasiat (Maksimal 1/3 Harta)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={wills}
                    onChange={handleCurrencyChange(setWills)}
                    placeholder="0"
                    className="w-full bg-[#141414] border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neonBlue/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Ahli Waris */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Users size={14} className="text-neonBlue" />
                  Ahli Waris (Hidup)
                </label>
                <button onClick={() => navigate('/add-member')} className="text-[10px] text-neonBlue hover:text-white transition-colors">
                  Edit Anggota
                </button>
              </div>
              
              <div className="bg-[#141414] border border-white/5 rounded-xl p-3 flex flex-wrap gap-2">
                {livingMembers.length > 0 ? (
                  livingMembers.map(m => (
                    <div key={m.id} className="bg-white/5 border border-white/10 rounded-md px-2.5 py-1 flex items-center gap-1.5">
                      <span className="text-xs font-medium text-gray-300">{m.relLabel}</span>
                      {m.name && m.name !== 'Tanpa Nama' && (
                        <span className="text-[10px] text-gray-500 truncate max-w-[80px]">({m.name})</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center w-full py-2">Belum ada ahli waris yang ditambahkan atau hidup.</p>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Action */}
        <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-4 bg-[#0A0A0A] border-t border-white/5 z-40">
          <button
            onClick={handleCalculate}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 bg-gradient-to-r from-neonBlue to-purple-500 text-white shadow-[0_0_20px_rgba(80,150,255,0.3)] hover:scale-[1.02]`}
          >
            Hitung Pembagian Faraid
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Calculator;
