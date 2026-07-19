import React, { useState } from 'react';
import { ChevronDown, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FikihWaris: React.FC = () => {
  const navigate = useNavigate();
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const chapters = [
    {
      id: 1,
      title: "Bab 1: Pengertian & Dasar Hukum",
      content: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Pengertian Fikih Waris (Faraid)</strong><br />
            Ilmu Faraid adalah ilmu yang mempelajari tentang tata cara pembagian harta warisan menurut syariat Islam. Kata 'Faraid' merupakan bentuk jamak dari 'Faridah' yang berarti ketentuan atau bagian yang telah ditetapkan.
          </p>
          <p>
            <strong className="text-white">Dasar Hukum</strong><br />
            Dasar hukum pembagian waris secara mutlak bersumber dari Al-Qur'an, Hadits, dan Ijma' Ulama. Sumber utamanya terdapat dalam surat An-Nisa ayat 11, 12, dan 176 yang secara rinci menjelaskan bagian-bagian pasti setiap ahli waris.
          </p>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="italic text-gray-400 text-xs">
              "Allah mensyariatkan bagimu tentang (pembagian pusaka untuk) anak-anakmu. Yaitu: bahagian seorang anak lelaki sama dengan bagahian dua orang anak perempuan..." (QS. An-Nisa: 11)
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Bab 2: Rukun & Syarat Waris",
      content: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Rukun Waris (Unsur-unsur)</strong><br />
            Terdapat 3 rukun dalam kewarisan Islam:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Muwarris:</strong> Orang yang meninggal dunia dan meninggalkan harta.</li>
            <li><strong>Waris:</strong> Orang yang berhak menerima harta peninggalan.</li>
            <li><strong>Mauruts (Tirkah):</strong> Harta peninggalan orang yang meninggal setelah dikurangi biaya pengurusan jenazah, hutang, dan wasiat.</li>
          </ul>
          
          <p className="mt-4">
            <strong className="text-white">Syarat Waris</strong><br />
            Proses pewarisan baru dapat dilakukan jika memenuhi syarat berikut:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Meninggalnya Muwarris secara hakiki atau secara hukum (putusan hakim).</li>
            <li>Hidupnya ahli waris pada saat Muwarris meninggal dunia.</li>
            <li>Mengetahui status hubungan pewarisan (apakah karena nasab, pernikahan, atau memerdekakan budak).</li>
          </ul>
        </div>
      )
    },
    {
      id: 3,
      title: "Bab 3: Sebab & Penghalang Mewarisi",
      content: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Sebab-sebab Mewarisi</strong><br />
            Seseorang berhak mendapatkan warisan karena 3 sebab:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-neonGreen">
            <li><span className="text-gray-300"><strong>Nasab (Hubungan Darah):</strong> Keluarga kandung seperti anak, ayah, ibu, saudara.</span></li>
            <li><span className="text-gray-300"><strong>Pernikahan (Mushaharah):</strong> Hubungan suami istri yang sah.</span></li>
            <li><span className="text-gray-300"><strong>Wala':</strong> Hubungan karena memerdekakan hamba sahaya (budak).</span></li>
          </ol>

          <p className="mt-4">
            <strong className="text-white">Penghalang Mewarisi (Mawani' al-Irts)</strong><br />
            Hal-hal yang membatalkan hak waris seseorang:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-red-400">
            <li><span className="text-gray-300"><strong>Pembunuhan:</strong> Ahli waris yang membunuh Muwarris terhalang mendapatkan warisan.</span></li>
            <li><span className="text-gray-300"><strong>Beda Agama:</strong> Orang muslim tidak mewarisi harta orang non-muslim dan sebaliknya.</span></li>
            <li><span className="text-gray-300"><strong>Perbudakan:</strong> Seorang budak tidak bisa mewarisi atau mewariskan (namun tidak relevan lagi saat ini).</span></li>
          </ul>
        </div>
      )
    },
    {
      id: 4,
      title: "Bab 4: Ahli Waris Zawil Furud",
      content: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Pengertian Zawil Furud</strong><br />
            Adalah ahli waris yang bagiannya sudah ditentukan secara pasti dalam Al-Qur'an (seperti 1/2, 1/4, 1/8, 2/3, 1/3, dan 1/6). Mereka dibagikan hartanya lebih dulu.
          </p>
          
          <div className="space-y-3 mt-2">
            <div className="bg-white/5 p-3 rounded-lg border-l-2 border-neonBlue">
              <strong className="text-white">Bagian 1/2 (Setengah):</strong>
              <p className="mt-1">Diberikan kepada: Suami (jika tak ada anak), Anak Perempuan tunggal, Cucu perempuan dari anak laki-laki (tunggal), Saudari kandung tunggal, Saudari seayah tunggal.</p>
            </div>
            
            <div className="bg-white/5 p-3 rounded-lg border-l-2 border-neonBlue">
              <strong className="text-white">Bagian 1/4 (Seperempat):</strong>
              <p className="mt-1">Diberikan kepada: Suami (jika ada anak), Istri (jika tak ada anak).</p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border-l-2 border-neonBlue">
              <strong className="text-white">Bagian 1/8 (Seperdelapan):</strong>
              <p className="mt-1">Diberikan kepada: Istri (jika ada anak/cucu dari anak laki-laki).</p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border-l-2 border-neonBlue">
              <strong className="text-white">Bagian 2/3 (Dua pertiga):</strong>
              <p className="mt-1">Diberikan kepada: 2/lebih Anak Perempuan (tak ada anak laki), 2/lebih Cucu Perempuan, 2/lebih Saudari kandung, 2/lebih Saudari seayah.</p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border-l-2 border-neonBlue">
              <strong className="text-white">Bagian 1/3 (Sepertiga):</strong>
              <p className="mt-1">Diberikan kepada: Ibu (jika tak ada anak/cucu dan tak ada dua saudara/lebih), Saudara seibu (dua orang atau lebih).</p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border-l-2 border-neonBlue">
              <strong className="text-white">Bagian 1/6 (Seperenam):</strong>
              <p className="mt-1">Diberikan kepada: Ayah (jika ada anak), Ibu (jika ada anak/2 saudara), Kakek, Nenek, Cucu perempuan (bersama 1 anak perempuan), Saudari seayah (bersama 1 saudari kandung), Saudara seibu tunggal.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Bab 5: Ahli Waris Asabah",
      content: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Pengertian Asabah</strong><br />
            Ahli waris asabah adalah mereka yang mendapatkan seluruh sisa harta peninggalan setelah diambil oleh Zawil Furud. Jika harta habis oleh Zawil Furud, maka Asabah (kecuali anak laki-laki) tidak mendapat apa-apa. Jika ia sendirian, ia memborong seluruh harta.
          </p>

          <p><strong className="text-white">Macam-macam Asabah:</strong></p>
          <div className="space-y-2">
            <div className="bg-white/5 p-3 rounded-lg">
              <strong className="text-neonGreen">1. Asabah Binafsihi</strong>
              <p className="mt-1 text-xs">Asabah karena dirinya sendiri (semua laki-laki kecuali suami & saudara seibu). Urutan prioritasnya:<br/>
              - Arah Anak: Anak laki-laki, cucu laki-laki.<br/>
              - Arah Bapak: Ayah, kakek.<br/>
              - Arah Saudara: Saudara laki-laki kandung, saudara laki-laki seayah, anak mereka.<br/>
              - Arah Paman: Paman kandung, paman seayah, anak laki-laki mereka.</p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg">
              <strong className="text-neonGreen">2. Asabah Bil Ghair</strong>
              <p className="mt-1 text-xs">Asabah karena ditarik oleh orang lain (saudara laki-lakinya). Mereka adalah 4 wanita Zawil Furud yang ditarik menjadi Asabah:<br/>
              - Anak perempuan ditarik anak laki-laki.<br/>
              - Cucu perempuan ditarik cucu laki-laki.<br/>
              - Saudari kandung ditarik saudara laki-laki kandung.<br/>
              - Saudari seayah ditarik saudara laki-laki seayah.<br/>
              <span className="italic">Kaidah: Laki-laki mendapat bagian 2 kali lipat bagian perempuan.</span></p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg">
              <strong className="text-neonGreen">3. Asabah Ma'al Ghair</strong>
              <p className="mt-1 text-xs">Asabah bersama orang lain. Yaitu saudari kandung atau saudari seayah yang menjadi asabah ketika mewarisi bersama-sama dengan anak perempuan atau cucu perempuan.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Bab 6: Hijab (Terhalang Waris)",
      content: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Pengertian Hijab</strong><br />
            Hijab adalah penghalang yang menyebabkan seorang ahli waris tidak mendapatkan bagian warisan (atau berkurang bagiannya) karena adanya ahli waris yang lebih dekat kekerabatannya.
          </p>

          <div className="space-y-3">
            <div className="border border-white/10 rounded-lg p-3">
              <strong className="text-white">1. Hijab Nuqshan (Pengurangan)</strong>
              <p className="mt-1 text-xs">Penghalang yang mengurangi bagian seorang ahli waris. Contoh:<br/>
              - Suami dari 1/2 menjadi 1/4 karena ada anak.<br/>
              - Ibu dari 1/3 menjadi 1/6 karena ada anak/2 saudara.</p>
            </div>

            <div className="border border-white/10 rounded-lg p-3">
              <strong className="text-white">2. Hijab Hirman (Penghalang Penuh)</strong>
              <p className="mt-1 text-xs">Penghalang yang menggugurkan hak waris sepenuhnya secara total. Kaidah utamanya:<br/>
              <span className="text-red-400 block mt-1">
              - Kakek dihijab (terhalang) oleh Ayah.<br/>
              - Nenek dihijab oleh Ibu.<br/>
              - Cucu (laki/perempuan) dihijab oleh Anak laki-laki.<br/>
              - Saudara (kandung/seayah/seibu) dihijab oleh Anak Laki-laki, Cucu Laki-laki, dan Ayah.<br/>
              - Saudara seayah dihijab oleh Saudara Kandung.<br/>
              </span>
              <span className="italic block mt-2 text-neonGreen">Catatan: Ada 6 ahli waris utama yang tidak akan pernah terkena Hijab Hirman: Ayah, Ibu, Anak Laki-laki, Anak Perempuan, Suami, dan Istri.</span>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Bab 7: Masalah Khusus ('Aul & Radd)",
      content: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">'Aul (Kekurangan Harta)</strong><br />
            Terjadi ketika jumlah total bagian fardh (pecahan) lebih besar daripada harta (Asal Masalah). Solusinya adalah menaikkan angka pembagi (Asal Masalah) sebesar jumlah total bagian yang ada, sehingga bagian masing-masing ahli waris akan berkurang secara proporsional.
          </p>

          <p>
            <strong className="text-white">Radd (Kelebihan Harta)</strong><br />
            Terjadi ketika semua ahli waris Zawil Furud sudah mendapatkan bagiannya, tidak ada Asabah, dan harta masih tersisa. Sisa harta ini kemudian "dikembalikan" (di-radd) kepada para Zawil Furud sesuai porsi mereka (kecuali Suami dan Istri yang tidak berhak mendapat Radd menurut mayoritas ulama).
          </p>

          <div className="bg-white/5 p-3 rounded-lg border-l-2 border-neonGreen">
            <strong className="text-white">Masalah Gharrawain (Umariyatain)</strong>
            <p className="mt-1 text-xs">Kasus khusus dimana ahli waris hanya terdiri dari: Suami/Istri, Ibu, dan Ayah.<br/>
            Untuk menghindari Ibu mendapat lebih besar dari Ayah (yang melanggar kaidah laki-laki 2x perempuan), maka Ibu diberikan 1/3 dari <span className="underline">Sisa Harta</span> (bukan 1/3 dari total), setelah dikurangi bagian Suami/Istri.</p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Bab 8: Dzawil Arham",
      content: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Pengertian Dzawil Arham</strong><br />
            Adalah kerabat mayit (memiliki hubungan darah) namun mereka bukan termasuk kelompok Zawil Furud dan juga bukan kelompok Asabah. Mereka diletakkan di prioritas terakhir.
          </p>
          <p className="text-xs">
            Contoh: Cucu dari anak perempuan, Paman dari pihak Ibu, Bibi dari pihak Bapak, Keponakan dari saudara perempuan.
          </p>

          <p className="mt-2">
            <strong className="text-white">Hukum Warisnya</strong><br />
            Menurut mazhab mayoritas (Hanafi, Hanbali, Mutakhirin Syafi'i & Maliki), Dzawil Arham dapat mewarisi <strong>hanya jika</strong>:
          </p>
          <ul className="list-decimal pl-5 space-y-1 text-neonGreen text-xs">
            <li><span className="text-gray-300">Tidak ada satupun ahli waris Asabah.</span></li>
            <li><span className="text-gray-300">Tidak ada ahli waris Zawil Furud (selain suami/istri).</span></li>
          </ul>
          <p className="text-xs italic mt-2 text-gray-400">
            Jika syarat tersebut terpenuhi, maka harta atau sisa harta (setelah hak suami/istri) diberikan kepada kaum kerabat Dzawil Arham.
          </p>
        </div>
      )
    }
  ];

  const toggleChapter = (id: number) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  return (
    <div className="min-h-screen w-full bg-dark font-sans overflow-hidden">
      {/* Mobile App Container */}
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-[100dvh] relative flex flex-col shadow-2xl shadow-neonGreen/5 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center shadow-xl z-50">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-neonBlue/10 flex items-center justify-center text-neonBlue">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Fikih Waris</h2>
              <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                Panduan Hukum Faraid
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
          {/* Banner Hero */}
          <div className="p-5 mx-6 mt-6 mb-2 rounded-3xl bg-gradient-to-br from-[#111A16] to-[#0D131C] border border-white/10 relative overflow-hidden shadow-2xl">
            {/* Dekorasi Cahaya */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-neonBlue/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-neonGreen/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              {/* Header Banner */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-neonGreen to-neonBlue flex items-center justify-center text-dark shrink-0 shadow-[0_0_15px_rgba(80,255,176,0.3)]">
                  <BookOpen size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-white font-bold text-base tracking-wide">Ilmu Faraid</h3>
              </div>
              
              {/* Box Kutipan (Quote) */}
              <div className="relative pl-4 border-l-[3px] border-neonGreen/40 bg-white/5 py-3 pr-3 rounded-r-xl">
                <p className="text-xs text-gray-300 leading-relaxed italic font-medium">
                  "Pelajarilah ilmu faraid dan ajarkanlah, karena ilmu itu adalah separuh dari ilmu, ia akan dilupakan, dan ia adalah sesuatu yang pertama kali dicabut dari umatku."
                </p>
                <div className="mt-2 flex justify-end">
                  <span className="text-[10px] text-neonGreen font-bold tracking-wider px-2 py-1 bg-neonGreen/10 rounded-md">
                    HR. Ibnu Majah
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-sm font-semibold text-white/80 mb-4 px-1">Daftar Materi (Bab)</h4>
            
            <div className="space-y-3">
              {chapters.map((chapter) => (
                <div 
                  key={chapter.id} 
                  className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                    expandedChapter === chapter.id 
                      ? 'border-neonBlue/50 bg-[#111827]/80 shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                      : 'border-white/5 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                  >
                    <span className={`font-medium text-sm transition-colors ${
                      expandedChapter === chapter.id ? 'text-neonBlue' : 'text-white'
                    }`}>
                      {chapter.title}
                    </span>
                    <div className={`shrink-0 transition-transform duration-300 ${
                      expandedChapter === chapter.id ? 'rotate-180 text-neonBlue' : 'text-gray-500'
                    }`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  
                  {/* Expandable Content */}
                  {expandedChapter === chapter.id && (
                    <div className="pb-5 px-5">
                      <div className="w-full h-[1px] bg-white/5 mb-4"></div>
                      {chapter.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* AI Assistant CTA */}
            <div className="mt-8 glass-card p-5 rounded-2xl border border-neonGreen/20 bg-gradient-to-br from-neonGreen/5 to-transparent relative overflow-hidden group cursor-pointer hover:bg-neonGreen/10 transition-colors" onClick={() => navigate('/ai')}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-neonGreen/20 rounded-full blur-2xl group-hover:bg-neonGreen/30 transition-colors"></div>
              <h4 className="text-white font-semibold text-sm relative z-10">Punya Pertanyaan Spesifik?</h4>
              <p className="text-xs text-gray-400 mt-1 mb-4 relative z-10">Tanyakan kasus waris Anda langsung kepada Asisten AI kami.</p>
              <button 
                className="w-full py-3 rounded-xl bg-neonGreen/10 text-neonGreen font-medium text-sm border border-neonGreen/20 hover:bg-neonGreen hover:text-dark transition-all relative z-10 pointer-events-none"
              >
                Tanya AI Sekarang
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default FikihWaris;
