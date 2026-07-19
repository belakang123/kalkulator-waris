import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Check, Info, Trash2, Calculator, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RELATIONSHIPS = [
  { id: 'istri', label: 'Istri', gender: 'female' },
  { id: 'suami', label: 'Suami', gender: 'male' },
  { id: 'anak_lk', label: 'Anak Laki-laki', gender: 'male' },
  { id: 'anak_pr', label: 'Anak Perempuan', gender: 'female' },
  { id: 'ayah', label: 'Ayah', gender: 'male' },
  { id: 'ibu', label: 'Ibu', gender: 'female' },
  { id: 'saudara_kandung_lk', label: 'Sdr. Kandung Laki', gender: 'male' },
  { id: 'saudara_kandung_pr', label: 'Sdr. Kandung Pr.', gender: 'female' },
  { id: 'saudara_seayah_lk', label: 'Sdr. Seayah Laki', gender: 'male' },
  { id: 'saudara_seayah_pr', label: 'Sdr. Seayah Pr.', gender: 'female' },
  { id: 'saudara_seibu_lk', label: 'Sdr. Seibu Laki', gender: 'male' },
  { id: 'saudara_seibu_pr', label: 'Sdr. Seibu Pr.', gender: 'female' },
];

const RELATIONSHIP_CATEGORIES = [
  {
    id: 'pasangan_anak',
    title: 'Pasangan & Anak',
    items: ['suami', 'istri', 'anak_lk', 'anak_pr'],
  },
  {
    id: 'orang_tua',
    title: 'Orang Tua',
    items: ['ayah', 'ibu'],
  },
  {
    id: 'saudara',
    title: 'Saudara',
    items: [
      'saudara_kandung_lk',
      'saudara_kandung_pr',
      'saudara_seayah_lk',
      'saudara_seayah_pr',
      'saudara_seibu_lk',
      'saudara_seibu_pr',
    ],
  },
];

interface Member {
  id: number;
  relId: string;
  relLabel: string;
  name: string;
  status: 'hidup' | 'meninggal';
}

const AddMember: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('waris_members');
    if (saved) {
      // Handle migration from old 'saudara_lk' to 'saudara_kandung_lk'
      const parsed = JSON.parse(saved);
      return parsed.map((m: Member) => {
        if (m.relId === 'saudara_lk') return { ...m, relId: 'saudara_kandung_lk', relLabel: 'Sdr. Kandung Laki' };
        if (m.relId === 'saudara_pr') return { ...m, relId: 'saudara_kandung_pr', relLabel: 'Sdr. Kandung Pr.' };
        return m;
      });
    }
    return [];
  });

  // Bottom Sheet states
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pasangan_anak');
  const [selectedRel, setSelectedRel] = useState<string>('');
  const [name, setName] = useState<string>('');
  
  // Accordion guide state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  // Notification state
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('waris_members', JSON.stringify(members));
  }, [members]);

  const handleSave = () => {
    if (!selectedRel) return;
    const rel = RELATIONSHIPS.find((r) => r.id === selectedRel);
    if (!rel) return;

    const newMember: Member = {
      id: Date.now(),
      relId: rel.id,
      relLabel: rel.label,
      name: name.trim() || `Tanpa Nama`,
      status: 'hidup',
    };

    setMembers([...members, newMember]);
    
    // Close sheet & Reset form
    setIsSheetOpen(false);
    setSelectedRel('');
    setName('');
    
    // Show notification
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };



  return (
    <div className="h-[100dvh] w-full bg-dark font-sans overflow-hidden">
      {/* Mobile App Container */}
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-full relative overflow-hidden flex flex-col shadow-2xl shadow-neonGreen/10">
        
        {/* Header */}
        <div className="shrink-0 w-full bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center shadow-xl z-50">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Ahli Waris</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Kelola data kerabat almarhum
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          
          {/* Guide Accordion */}
          <div className="glass-card border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="w-full px-4 py-3 flex items-center justify-between bg-white/[0.01] hover:bg-white/[0.03] transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Info size={16} className="text-neonBlue" />
                <span className="text-xs font-semibold text-white">Panduan Sudut Pandang Ahli Waris</span>
              </div>
              <span className={`text-[10px] text-neonBlue font-bold transition-transform duration-300 ${isGuideOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {isGuideOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-white/5 animate-fade-in text-[11px] text-gray-400 leading-relaxed space-y-2">
                <p>
                  Semua hubungan kekeluargaan harus dilihat dari <strong className="text-white">sudut pandang almarhum/ah</strong> (orang yang wafat).
                </p>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-neonGreen font-semibold block text-[10px] uppercase tracking-wider">Contoh Kasus:</span>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Jika anak Anda meninggal: Masukkan diri Anda sebagai <strong className="text-white">Ayah / Ibu</strong>.</li>
                    <li>Jika suami meninggal: Masukkan diri Anda sebagai <strong className="text-white">Istri</strong>.</li>
                    <li>Jika ayah meninggal: Masukkan diri Anda sebagai <strong className="text-white">Anak Laki-laki / Anak Perempuan</strong>.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Heirs Section */}
          {members.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daftar Tersimpan</h3>
                <span className="text-[10px] bg-neonGreen/10 border border-neonGreen/20 text-neonGreen px-2 py-0.5 rounded-full font-bold">
                  {members.length} Orang
                </span>
              </div>

              <div className="space-y-3">
                {members.map((member) => {
                  const relInfo = RELATIONSHIPS.find((r) => r.id === member.relId);
                  const isMale = relInfo?.gender === 'male';

                  return (
                    <div 
                      key={member.id} 
                      className="glass-card bg-[#121212]/50 border border-white/5 rounded-2xl p-4 flex justify-between items-center group transition-all hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          isMale 
                            ? 'bg-neonBlue/10 text-neonBlue border border-neonBlue/20 shadow-[0_0_10px_rgba(0,225,255,0.05)]' 
                            : 'bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.05)]'
                        }`}>
                          {member.relLabel.charAt(0)}
                        </div>

                        <div>
                          <span className="text-sm font-bold text-white">{member.relLabel}</span>
                          <p className="text-[11px] text-gray-500 mt-0.5">{member.name}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeMember(member.id)}
                        className="w-9 h-9 rounded-full bg-red-500/5 text-red-400/70 hover:text-red-400 flex items-center justify-center hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <div className="w-16 h-16 rounded-full bg-neonGreen/10 flex items-center justify-center text-neonGreen mb-4 shadow-[0_0_30px_rgba(80,255,176,0.1)]">
                <UserPlus size={28} />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Belum Ada Ahli Waris</h4>
              <p className="text-xs text-gray-400 max-w-[280px] leading-relaxed mb-6 font-medium">
                Tambahkan hubungan kekeluargaan ahli waris terhadap almarhum/ah untuk mulai menghitung pembagian waris secara Faraid.
              </p>
              <button
                onClick={() => {
                  setSelectedRel('');
                  setName('');
                  setIsSheetOpen(true);
                }}
                className="px-5 py-3 rounded-xl bg-neonGreen text-dark font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(80,255,176,0.25)] hover:scale-[1.03] active:scale-97 transition-all"
              >
                <Plus size={16} strokeWidth={2.5} />
                Tambah Hubungan
              </button>
            </div>
          )}

        </div>

        {/* Bottom Actions */}
        {members.length > 0 && (
          <div className="shrink-0 w-full px-6 pb-6 pt-4 bg-[#0A0A0A] border-t border-white/5 z-40 flex flex-col gap-3">
            <button
              onClick={() => {
                setSelectedRel('');
                setName('');
                setIsSheetOpen(true);
              }}
              className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all"
            >
              <Plus size={18} />
              Tambah Hubungan Baru
            </button>

            <button
              onClick={() => navigate('/calculator')}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 bg-gradient-to-r from-neonGreen to-emerald-500 text-dark shadow-[0_0_20px_rgba(80,255,176,0.3)] hover:scale-[1.02]"
            >
              <Calculator size={18} />
              Lanjut ke Kalkulator
            </button>
          </div>
        )}

        {/* Success Toast Notification */}
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 z-[102] transition-all duration-300 ease-in-out ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
          <div className="glass-card bg-neonGreen/10 border border-neonGreen/30 px-4 py-2.5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(80,255,176,0.2)]">
            <div className="w-5 h-5 rounded-full bg-neonGreen flex items-center justify-center text-dark shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">Berhasil ditambahkan!</span>
          </div>
        </div>

        {/* BOTTOM SHEET DRAWER */}
        {/* Backdrop overlay */}
        <div 
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
            isSheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsSheetOpen(false)}
        />

        {/* Drawer container */}
        <div 
          className={`fixed bottom-0 left-0 right-0 bg-[#0F0F0F] border-t border-white/10 rounded-t-[2rem] z-[101] shadow-[0_-10px_40px_rgba(0,0,0,0.6)] transform transition-transform duration-300 ease-out flex flex-col max-h-[85vh] ${
            isSheetOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Handle */}
          <div className="w-full flex justify-center py-3">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pb-3 flex justify-between items-center border-b border-white/5">
            <h3 className="text-base font-bold text-white">Tambah Hubungan</h3>
            <button 
              onClick={() => setIsSheetOpen(false)}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5">
            
            {/* 1. Category and Selector */}
            <div className="space-y-3">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                1. Hubungan Keluarga
              </label>

              {/* Tabs */}
              <div className="flex bg-[#161616] rounded-xl p-1 border border-white/5">
                {RELATIONSHIP_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveTab(category.id)}
                    className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${
                      activeTab === category.id 
                        ? 'bg-neonGreen/10 text-neonGreen border border-neonGreen/10 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>

              {/* Option Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {RELATIONSHIPS.filter((rel) => 
                  RELATIONSHIP_CATEGORIES.find((c) => c.id === activeTab)?.items.includes(rel.id)
                ).map((rel) => {
                  const count = members.filter((m) => m.relId === rel.id).length;
                  let isDisabled = false;
                  let disableReason = "";

                  if (rel.id === 'suami') {
                    if (members.some((m) => m.relId === 'istri')) {
                      isDisabled = true;
                      disableReason = "Sudah ada Istri";
                    } else if (count >= 1) {
                      isDisabled = true;
                      disableReason = "Maksimal 1 Suami";
                    }
                  } else if (rel.id === 'istri') {
                    if (members.some((m) => m.relId === 'suami')) {
                      isDisabled = true;
                      disableReason = "Sudah ada Suami";
                    } else if (count >= 4) {
                      isDisabled = true;
                      disableReason = "Maksimal 4 Istri";
                    }
                  } else if (rel.id === 'ayah' && count >= 1) {
                    isDisabled = true;
                    disableReason = "Maksimal 1 Ayah";
                  } else if (rel.id === 'ibu' && count >= 1) {
                    isDisabled = true;
                    disableReason = "Maksimal 1 Ibu";
                  }

                  const isSelected = selectedRel === rel.id;

                  return (
                    <button
                      key={rel.id}
                      disabled={isDisabled}
                      onClick={() => setSelectedRel(rel.id)}
                      className={`relative overflow-hidden rounded-xl p-3 text-left transition-all duration-300 border text-xs ${
                        isDisabled 
                          ? 'bg-red-500/5 border-red-500/10 opacity-40 cursor-not-allowed'
                          : isSelected
                            ? 'bg-neonGreen/10 border-neonGreen text-neonGreen shadow-[0_0_15px_rgba(80,255,176,0.1)]'
                            : 'bg-[#161616] border-white/5 text-gray-300 hover:bg-white/[0.03] hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span>{rel.label}</span>
                        {isSelected && <Check size={14} />}
                      </div>

                      {isDisabled ? (
                        <span className="text-[9px] text-red-400 font-medium block mt-1 leading-tight">
                          {disableReason}
                        </span>
                      ) : (
                        <span className="text-[9px] opacity-50 block mt-1">
                          {rel.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Additional Info */}
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                2. Detail Anggota
              </label>

              {/* Name Input */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 font-medium">Nama Ahli Waris</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ahmad, Kakak (Opsional)"
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neonGreen/45 transition-all shadow-inner"
                />
              </div>


            </div>

            {/* Quick Tips */}
            <div className="bg-neonBlue/5 border border-neonBlue/15 rounded-2xl p-3 flex gap-2.5">
              <Info size={16} className="text-neonBlue shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                Pilih hubungan yang tepat terhadap almarhum. Kesalahan dalam relasi kekeluargaan akan mempengaruhi kalkulasi bagian Faraid secara langsung.
              </p>
            </div>

          </div>

          {/* Sticky Bottom Actions inside sheet */}
          <div className="p-6 bg-[#0F0F0F] border-t border-white/5 flex gap-3">
            <button
              onClick={() => setIsSheetOpen(false)}
              className="flex-1 py-3.5 rounded-xl border border-white/10 text-white font-bold text-xs hover:bg-white/5 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedRel}
              className={`flex-1 py-3.5 rounded-xl font-bold text-xs transition-all ${
                selectedRel
                  ? 'bg-neonGreen text-dark shadow-[0_0_15px_rgba(80,255,176,0.25)] active:scale-97'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              Simpan Hubungan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddMember;
