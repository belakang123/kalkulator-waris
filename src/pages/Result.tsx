import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, PieChart, Users, AlertCircle, CheckCircle2, BookOpen, ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import { calculateFaraid, Member, FaraidResult } from '../utils/faraidEngine';

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    members: Member[];
    assets: string;
    funeral: string;
    debts: string;
    wills: string;
    hukumType: 'jumhur' | 'khi';
    gonoGini: string;
  } | null;

  if (!state) {
    return (
      <div className="min-h-screen bg-dark flex flex-col justify-center items-center p-6">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-white font-bold mb-2">Data Tidak Ditemukan</h2>
        <p className="text-gray-400 text-center text-sm mb-6">Silakan mulai perhitungan dari halaman Kalkulator.</p>
        <button onClick={() => navigate('/calculator')} className="bg-neonGreen text-dark px-6 py-2 rounded-full font-bold">Kembali</button>
      </div>
    );
  }

  const { members, hukumType } = state;
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const parseCurrency = (val: string) => {
    if (!val) return 0;
    return parseInt(val.replace(/[^0-9]/g, '')) || 0;
  };

  const totalAssets = parseCurrency(state.assets);
  const funeral = parseCurrency(state.funeral);
  const debts = parseCurrency(state.debts);
  const wills = parseCurrency(state.wills);
  const gonoGini = parseCurrency(state.gonoGini);

  const totalDeductions = funeral + debts + wills + gonoGini;
  const tirkah = Math.max(0, totalAssets - totalDeductions);

  const results = useMemo(() => {
    return calculateFaraid(members, tirkah, hukumType);
  }, [members, tirkah, hukumType]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // ─── Export PDF ────────────────────────────────────────────────────────────
  const exportToPDF = () => {
    setIsExporting(true);
    setExportStatus('idle');
    const hukumLabel = hukumType === 'khi' ? 'Kompilasi Hukum Islam (KHI)' : 'Jumhur Ulama';
    const tanggal = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const namaFile = `Laporan_Warisan_${new Date().getTime()}.pdf`;

    const rowsHTML = results.map((res, idx) => {
      const status = res.isMahjub
        ? `<span style="color:#ef4444;font-weight:700;">TERHIJAB</span><br/><small style="color:#fca5a5;font-size:9px;">${res.mahjubReason}</small>`
        : `<span style="color:#16a34a;font-weight:700;">${res.shareFraction}</span>`;
      const pct = res.isMahjub ? '-' : `${(res.shareDecimal * 100).toFixed(2)}%`;
      const jumlah = res.isMahjub ? '-' : formatRupiah(res.shareAmount);
      const tipe = res.isMahjub ? '-' : res.type === 'asabah' ? 'Asabah' : 'Furud';
      const nama = res.member.name && res.member.name !== 'Tanpa Nama' ? res.member.name : '-';
      const rowBg = idx % 2 === 0 ? '#f9fafb' : '#ffffff';
      return `
        <tr style="background:${rowBg};">
          <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:600;color:#111827;">${idx + 1}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#111827;">${res.member.relLabel}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#374151;">${nama}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:center;">${status}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:11px;color:#6b7280;text-align:center;">${tipe}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:center;color:#374151;">${pct}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:700;color:#111827;text-align:right;">${jumlah}</td>
        </tr>`;
    }).join('');

    const penjelasanHTML = explanation.map(p =>
      `<p style="margin:0 0 8px 0;font-size:11px;line-height:1.7;color:#374151;text-align:justify;">${p}</p>`
    ).join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <title>Laporan Pembagian Warisan Faraid</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; background: #fff; }
    .page { max-width: 800px; margin: 0 auto; padding: 32px 28px; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #166534; padding-bottom: 16px; margin-bottom: 24px; }
    .header-title h1 { font-size: 20px; font-weight: 800; color: #166534; letter-spacing: -0.3px; }
    .header-title p { font-size: 11px; color: #6b7280; margin-top: 3px; }
    .badge { background: #166534; color: #fff; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; white-space: nowrap; }
    .section-title { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0; }
    .summary-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; }
    .summary-item { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px dashed #d1fae5; font-size: 12px; }
    .summary-item:last-child { border-bottom: none; }
    .summary-item .lbl { color: #374151; }
    .summary-item .val { font-weight: 700; color: #111827; }
    .tirkah-box { background: #166534; border-radius: 8px; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
    .tirkah-box .lbl { color: #a7f3d0; font-size: 11px; font-weight: 600; }
    .tirkah-box .val { color: #fff; font-size: 18px; font-weight: 800; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #166534; }
    thead th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #fff; letter-spacing: 0.3px; }
    thead th:last-child { text-align: right; }
    thead th:nth-child(4), thead th:nth-child(5), thead th:nth-child(6) { text-align: center; }
    tfoot tr { background: #f0fdf4; }
    tfoot td { padding: 10px 12px; font-size: 12px; font-weight: 800; color: #166534; border-top: 2px solid #166534; }
    tfoot td:last-child { text-align: right; }
    .penjelasan-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; }
    .penjelasan-box .title { font-size: 12px; font-weight: 700; color: #92400e; margin-bottom: 10px; }
    .disclaimer { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; margin-top: 8px; }
    .disclaimer p { font-size: 10px; color: #9ca3af; line-height: 1.6; text-align: center; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-title">
      <h1>Laporan Pembagian Warisan Faraid</h1>
      <p>WarisSync &bull; Kalkulator Faraid Islam &bull; ${tanggal}</p>
    </div>
    <span class="badge">${hukumLabel}</span>
  </div>
  <p class="section-title">Ringkasan Harta Peninggalan</p>
  <div class="summary-box">
    <div class="summary-grid">
      <div class="summary-item"><span class="lbl">Total Peninggalan</span><span class="val">${formatRupiah(totalAssets)}</span></div>
      ${gonoGini > 0 ? `<div class="summary-item"><span class="lbl">Harta Bersama (Gono-Gini)</span><span class="val" style="color:#dc2626;">- ${formatRupiah(gonoGini)}</span></div>` : ''}
      ${funeral > 0 ? `<div class="summary-item"><span class="lbl">Biaya Tajhiz (Pemakaman)</span><span class="val" style="color:#dc2626;">- ${formatRupiah(funeral)}</span></div>` : ''}
      ${debts > 0 ? `<div class="summary-item"><span class="lbl">Hutang Almarhum</span><span class="val" style="color:#dc2626;">- ${formatRupiah(debts)}</span></div>` : ''}
      ${wills > 0 ? `<div class="summary-item"><span class="lbl">Wasiat</span><span class="val" style="color:#dc2626;">- ${formatRupiah(wills)}</span></div>` : ''}
    </div>
    <div class="tirkah-box">
      <span class="lbl">HARTA BERSIH (TIRKAH) &mdash; Yang dibagikan kepada ahli waris</span>
      <span class="val">${formatRupiah(tirkah)}</span>
    </div>
  </div>
  <p class="section-title">Rincian Pembagian Kepada Ahli Waris</p>
  <table>
    <thead>
      <tr>
        <th style="width:30px;">#</th>
        <th>Hubungan</th>
        <th>Nama</th>
        <th style="width:90px;">Bagian</th>
        <th style="width:70px;">Status</th>
        <th style="width:65px;">Persen</th>
        <th style="width:140px;">Jumlah (IDR)</th>
      </tr>
    </thead>
    <tbody>${rowsHTML}</tbody>
    <tfoot>
      <tr>
        <td colspan="6" style="font-size:12px;font-weight:800;color:#166534;">Total Tirkah yang Dibagikan</td>
        <td style="text-align:right;font-size:13px;font-weight:800;color:#166534;">${formatRupiah(tirkah)}</td>
      </tr>
    </tfoot>
  </table>
  <div class="penjelasan-box">
    <div class="title">&#128214; Penjelasan Syar'i &amp; Dasar Hukum</div>
    ${penjelasanHTML}
  </div>
  <div class="disclaimer">
    <p>Dokumen ini dibuat secara otomatis oleh aplikasi WarisSync. Perhitungan mengacu pada hukum faraid Islam berdasarkan ${hukumLabel}. Untuk keputusan hukum resmi, disarankan berkonsultasi dengan Ulama atau Pengadilan Agama setempat. &bull; ${tanggal}</p>
  </div>
  <div class="footer">
    <span>WarisSync &mdash; Kalkulator Faraid Islam</span>
    <span>Halaman 1 dari 1</span>
  </div>
</div>
</body>
</html>`;

    try {
      // ✔ Prioritas 1: Android JavascriptInterface → generate PDF native via PrintDocumentAdapter
      const androidBridge = (window as any).AndroidBridge;
      if (androidBridge && typeof androidBridge.generatePdf === 'function') {
        const b64 = btoa(unescape(encodeURIComponent(htmlContent)));
        androidBridge.generatePdf(b64, namaFile);
        // Toast sistem ditampilkan oleh Kotlin, in-app toast muncul di sini
        setExportStatus('success');
        setTimeout(() => setExportStatus('idle'), 3500);
        setIsExporting(false);
        return;
      }

      // ✔ Fallback: Blob download untuk browser/dev mode (HTML preview)
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = namaFile.replace('.pdf', '.html'); // browser tidak bisa generate PDF native
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3500);
    } catch {
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3500);
    } finally {
      setIsExporting(false);
    }
  };

  // ─── Generator Penjelasan Syar'i ───────────────────────────────────────────
  const generateExplanation = (members: Member[], results: FaraidResult[]): string[] => {
    const living = members.filter(m => m.status === 'hidup');
    const count = {
      suami: living.filter(m => m.relId === 'suami').length,
      istri: living.filter(m => m.relId === 'istri').length,
      ayah: living.filter(m => m.relId === 'ayah').length,
      ibu: living.filter(m => m.relId === 'ibu').length,
      anak_lk: living.filter(m => m.relId === 'anak_lk').length,
      anak_pr: living.filter(m => m.relId === 'anak_pr').length,
      saudara_kandung_lk: living.filter(m => m.relId === 'saudara_kandung_lk').length,
      saudara_kandung_pr: living.filter(m => m.relId === 'saudara_kandung_pr').length,
      saudara_seayah_lk: living.filter(m => m.relId === 'saudara_seayah_lk').length,
      saudara_seayah_pr: living.filter(m => m.relId === 'saudara_seayah_pr').length,
      saudara_seibu_lk: living.filter(m => m.relId === 'saudara_seibu_lk').length,
      saudara_seibu_pr: living.filter(m => m.relId === 'saudara_seibu_pr').length,
    };

    const paragraphs: string[] = [];

    // 1. Pembuka
    const ahliWarisList: string[] = [];
    if (count.suami > 0) ahliWarisList.push('1 orang suami');
    if (count.istri > 0) ahliWarisList.push(`${count.istri} orang istri`);
    if (count.ayah > 0) ahliWarisList.push('1 orang ayah');
    if (count.ibu > 0) ahliWarisList.push('1 orang ibu');
    if (count.anak_lk > 0) ahliWarisList.push(`${count.anak_lk} orang anak laki-laki`);
    if (count.anak_pr > 0) ahliWarisList.push(`${count.anak_pr} orang anak perempuan`);
    if (count.saudara_kandung_lk > 0) ahliWarisList.push(`${count.saudara_kandung_lk} orang saudara kandung laki-laki`);
    if (count.saudara_kandung_pr > 0) ahliWarisList.push(`${count.saudara_kandung_pr} orang saudara kandung perempuan`);
    if (count.saudara_seayah_lk > 0) ahliWarisList.push(`${count.saudara_seayah_lk} orang saudara seayah laki-laki`);
    if (count.saudara_seayah_pr > 0) ahliWarisList.push(`${count.saudara_seayah_pr} orang saudara seayah perempuan`);
    if (count.saudara_seibu_lk > 0) ahliWarisList.push(`${count.saudara_seibu_lk} orang saudara seibu laki-laki`);
    if (count.saudara_seibu_pr > 0) ahliWarisList.push(`${count.saudara_seibu_pr} orang saudara seibu perempuan`);

    const hukumLabel = hukumType === 'khi' ? 'Kompilasi Hukum Islam (KHI)' : 'pendapat Jumhur Ulama';
    paragraphs.push(
      `Almarhum/almarhumah meninggalkan ${ahliWarisList.join(', ')}. Pembagian harta warisan dihitung berdasarkan ${hukumLabel} dengan tirkah (harta bersih) sebesar ${formatRupiah(tirkah)}.`
    );

    const hasChildren = count.anak_lk > 0 || count.anak_pr > 0;

    // 2. Penjelasan per ahli waris
    for (const res of results) {
      const rel = res.member.relId;
      const nama = res.member.name && res.member.name !== 'Tanpa Nama' ? ` (${res.member.name})` : '';
      const label = res.member.relLabel;
      const fractionStr = res.shareFraction;
      const pctStr = (res.shareDecimal * 100).toFixed(1) + '%';
      const rupiahStr = formatRupiah(res.shareAmount);

      if (res.isMahjub) {
        paragraphs.push(
          `${label}${nama} tidak mendapatkan warisan karena terhijab (terhalang). ${res.mahjubReason}. Dalam syariat Islam, keberadaan ahli waris yang lebih dekat hubungan nasabnya dapat menghalangi ahli waris lain untuk mendapatkan bagian.`
        );
        continue;
      }

      if (rel === 'suami') {
        const alasan = hasChildren
          ? "Karena ada anak, bagian suami menjadi 1/4 (seperempat) dari harta warisan. Hal ini berdasarkan firman Allah QS. An-Nisa' [4]: 12."
          : "Karena tidak ada anak, bagian suami adalah 1/2 (setengah) dari harta warisan. Hal ini berdasarkan firman Allah QS. An-Nisa' [4]: 12.";
        paragraphs.push(`Suami${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. ${alasan}`);
      }
      else if (rel === 'istri') {
        const jml = count.istri > 1 ? ` Bagian ini dibagi rata antara ${count.istri} istri, sehingga masing-masing mendapatkan ${formatRupiah(res.shareAmount)}.` : '';
        const alasan = hasChildren
          ? `Karena ada anak, bagian istri adalah 1/8 (seperdelapan) dari harta warisan berdasarkan QS. An-Nisa' [4]: 12.${jml}`
          : `Karena tidak ada anak, bagian istri adalah 1/4 (seperempat) dari harta warisan berdasarkan QS. An-Nisa' [4]: 12.${jml}`;
        paragraphs.push(`Istri${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. ${alasan}`);
      }
      else if (rel === 'ayah') {
        const alasan = count.anak_lk > 0
          ? "Karena ada anak laki-laki, ayah mendapatkan bagian tetap 1/6 (seperenam) berdasarkan QS. An-Nisa' [4]: 11. Hak asabah ayah terhalang oleh anak laki-laki."
          : count.anak_pr > 0
            ? "Karena ada anak perempuan tanpa anak laki-laki, ayah mendapatkan 1/6 sebagai furud ditambah sisa harta sebagai asabah berdasarkan QS. An-Nisa' [4]: 11."
            : "Karena tidak ada anak, ayah berkedudukan sebagai asabah (penerima sisa harta) setelah semua furud dibagikan berdasarkan QS. An-Nisa' [4]: 11.";
        paragraphs.push(`Ayah${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. ${alasan}`);
      }
      else if (rel === 'ibu') {
        const totalSdr = count.saudara_kandung_lk + count.saudara_kandung_pr + count.saudara_seayah_lk + count.saudara_seayah_pr;
        const alasan = hasChildren
          ? "Karena ada anak, bagian ibu adalah 1/6 (seperenam) berdasarkan QS. An-Nisa' [4]: 11."
          : totalSdr >= 2
            ? "Karena ada dua saudara atau lebih, bagian ibu diturunkan menjadi 1/6 (seperenam) berdasarkan QS. An-Nisa' [4]: 11."
            : "Karena tidak ada anak maupun dua saudara atau lebih, ibu mendapatkan 1/3 (sepertiga) dari harta warisan berdasarkan QS. An-Nisa' [4]: 11.";
        paragraphs.push(`Ibu${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. ${alasan}`);
      }
      else if (rel === 'anak_lk') {
        const alasan = count.anak_pr > 0
          ? "Anak laki-laki berkedudukan sebagai asabah bersama anak perempuan. Pembagiannya mengikuti kaidah \"lidzdzakari mitslu hadhdhil untsayain\" — bagian laki-laki dua kali bagian perempuan, berdasarkan QS. An-Nisa' [4]: 11."
          : "Anak laki-laki berkedudukan sebagai asabah (penerima seluruh sisa harta) setelah semua furud dibagikan. Jika lebih dari satu, sisa dibagi rata di antara mereka berdasarkan QS. An-Nisa' [4]: 11.";
        paragraphs.push(`Anak laki-laki${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. ${alasan}`);
      }
      else if (rel === 'anak_pr') {
        const alasan = count.anak_lk > 0
          ? "Karena ada anak laki-laki, anak perempuan menjadi asabah bil ghair dengan bagian setengah dari bagian anak laki-laki berdasarkan QS. An-Nisa' [4]: 11."
          : count.anak_pr === 1
            ? "Karena hanya seorang anak perempuan tanpa anak laki-laki, bagiannya adalah 1/2 (setengah) dari tirkah berdasarkan QS. An-Nisa' [4]: 11."
            : "Karena dua atau lebih anak perempuan tanpa anak laki-laki, mereka bersama-sama mendapatkan 2/3 (dua pertiga) dan dibagi rata di antara mereka berdasarkan QS. An-Nisa' [4]: 11.";
        paragraphs.push(`Anak perempuan${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. ${alasan}`);
      }
      else if (rel === 'saudara_kandung_lk') {
        paragraphs.push(`Saudara kandung laki-laki${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. Saudara kandung laki-laki berkedudukan sebagai asabah (penerima sisa harta) karena tidak ada ayah maupun anak, berdasarkan QS. An-Nisa' [4]: 176.`);
      }
      else if (rel === 'saudara_kandung_pr') {
        const alasan = count.saudara_kandung_lk > 0
          ? "Karena ada saudara kandung laki-laki, saudara kandung perempuan menjadi asabah bil ghair dengan bagian setengah dari bagian saudara laki-laki berdasarkan QS. An-Nisa' [4]: 176."
          : count.anak_pr > 0
            ? "Karena ada anak perempuan tanpa anak laki-laki, saudara kandung perempuan menjadi asabah ma'al ghair (penerima sisa bersama anak perempuan)."
            : count.saudara_kandung_pr === 1
              ? "Karena hanya seorang dan tidak ada saudara kandung laki-laki, bagiannya adalah 1/2 (setengah) berdasarkan QS. An-Nisa' [4]: 176."
              : "Karena dua atau lebih dan tidak ada saudara kandung laki-laki, mereka bersama mendapatkan 2/3 dan dibagi rata berdasarkan QS. An-Nisa' [4]: 176.";
        paragraphs.push(`Saudara kandung perempuan${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. ${alasan}`);
      }
      else if (rel === 'saudara_seayah_lk') {
        paragraphs.push(`Saudara seayah laki-laki${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. Berkedudukan sebagai asabah karena tidak ada saudara kandung yang menghalangi, berdasarkan QS. An-Nisa' [4]: 176.`);
      }
      else if (rel === 'saudara_seayah_pr') {
        paragraphs.push(`Saudara seayah perempuan${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. Bagian ini ditetapkan berdasarkan kaidah takmilah (pelengkap hingga 2/3) atau furud mandiri jika tidak ada saudara kandung, sesuai QS. An-Nisa' [4]: 176.`);
      }
      else if (rel === 'saudara_seibu_lk' || rel === 'saudara_seibu_pr') {
        const totalSeibu = count.saudara_seibu_lk + count.saudara_seibu_pr;
        const alasan = totalSeibu === 1
          ? "Karena hanya seorang saudara seibu, bagiannya adalah 1/6 (seperenam) berdasarkan QS. An-Nisa' [4]: 12. Laki-laki dan perempuan mendapat bagian yang sama."
          : `Karena ada ${totalSeibu} saudara seibu, mereka bersama-sama mendapatkan 1/3 (sepertiga) dan dibagi rata di antara mereka berdasarkan QS. An-Nisa' [4]: 12.`;
        paragraphs.push(`Saudara seibu${nama} mendapatkan bagian ${fractionStr} (${pctStr}) = ${rupiahStr}. ${alasan}`);
      }
    }

    // 3. Keterangan 'Aul / Radd
    const totalShareDecimal = results.filter(r => !r.isMahjub).reduce((s, r) => s + r.shareDecimal, 0);
    if (totalShareDecimal > 1.001) {
      paragraphs.push("Dalam kasus ini berlaku hukum 'Aul, yaitu kondisi di mana jumlah seluruh bagian furud melebihi 100%. Solusinya adalah menaikkan penyebut secara proporsional sehingga semua ahli waris tetap mendapat haknya meski sedikit berkurang dari porsi asalnya.");
    } else if (totalShareDecimal < 0.999 && results.filter(r => r.type === 'asabah').length === 0) {
      paragraphs.push("Dalam kasus ini terdapat sisa harta setelah seluruh furud dibagikan dan tidak ada asabah. Sisa tersebut dikembalikan kepada ahli waris yang berhak melalui mekanisme Radd (pengembalian) secara proporsional sesuai porsi masing-masing.");
    }

    return paragraphs;
  };

  const explanation = useMemo(() => generateExplanation(members, results), [members, results]);

  return (
    <div className="min-h-screen w-full bg-dark font-sans overflow-hidden">
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-[100dvh] relative overflow-hidden flex flex-col shadow-2xl shadow-neonGreen/10">

        {/* ─── In-App Download Toast Notification ─── */}
        <div
          className={`absolute bottom-6 left-4 right-4 z-[200] transition-all duration-500 ease-out ${
            exportStatus !== 'idle'
              ? 'translate-y-0 opacity-100'
              : 'translate-y-24 opacity-0 pointer-events-none'
          }`}
        >
          {exportStatus === 'success' && (
            <div className="flex items-center gap-3 bg-[#0D2B1A] border border-neonGreen/30 rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(0,255,128,0.25)]">
              <div className="w-10 h-10 rounded-full bg-neonGreen/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-neonGreen" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neonGreen">Laporan Berhasil Diunduh!</p>
                <p className="text-[11px] text-neonGreen/60 mt-0.5">File tersimpan di folder Downloads</p>
              </div>
              <FileDown size={18} className="text-neonGreen/50 shrink-0" />
            </div>
          )}
          {exportStatus === 'error' && (
            <div className="flex items-center gap-3 bg-[#2B0D0D] border border-red-500/30 rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(255,0,0,0.2)]">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-red-400">Gagal Mengunduh</p>
                <p className="text-[11px] text-red-400/60 mt-0.5">Silakan coba lagi</p>
              </div>
            </div>
          )}
        </div>


        {/* Header */}
        <div className="bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center justify-between shadow-xl z-50">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
              <ArrowLeft size={22} />
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="w-10 h-10 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen">
                <PieChart size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">Hasil Faraid</h2>
                <p className="text-[10px] text-neonGreen font-medium mt-0.5">
                  {hukumType === 'khi' ? 'Berdasarkan KHI (Indonesia)' : 'Berdasarkan Jumhur Ulama'}
                </p>
              </div>
            </div>
          </div>

          {/* Tombol Export PDF */}
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neonGreen/10 border border-neonGreen/20 text-neonGreen text-xs font-bold hover:bg-neonGreen hover:text-dark active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(0,255,128,0.1)]"
          >
            <FileDown size={15} />
            {isExporting ? 'Memproses...' : 'Ekspor PDF'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-20">
          
          {/* Ringkasan Harta */}
          <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/5 rounded-2xl p-5 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neonGreen/5 rounded-full blur-3xl" />
            
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Ringkasan Harta</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Total Peninggalan</span>
                <span className="text-sm font-bold text-white">{formatRupiah(totalAssets)}</span>
              </div>
              
              {gonoGini > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neonGreen">Harta Bersama (Gono-Gini)</span>
                  <span className="text-xs font-bold text-neonGreen">-{formatRupiah(gonoGini)}</span>
                </div>
              )}
              
              {(funeral > 0 || debts > 0 || wills > 0) && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-red-400">Kewajiban (Tajhiz/Hutang/Wasiat)</span>
                  <span className="text-xs font-bold text-red-400">-{formatRupiah(funeral + debts + wills)}</span>
                </div>
              )}
              
              <div className="h-px w-full bg-white/10 my-2" />
              
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-gray-500 block mb-1">HARTA BERSIH (TIRKAH)</span>
                  <span className="text-[10px] text-neonBlue block">Yang dibagi secara waris</span>
                </div>
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  {formatRupiah(tirkah)}
                </span>
              </div>
            </div>
          </div>

          {/* Daftar Penerima */}
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users size={14} className="text-neonBlue" />
            Rincian Pembagian
          </h3>

          {results.length === 0 ? (
            <div className="text-center p-6 border border-white/5 rounded-xl">
              <p className="text-sm text-gray-400">Tidak ada ahli waris yang dimasukkan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((res, idx) => (
                <div key={idx} className={`relative overflow-hidden rounded-xl p-4 border transition-all ${
                  res.isMahjub 
                    ? 'bg-red-500/5 border-red-500/10' 
                    : 'bg-[#141414] border-white/5'
                }`}>
                  
                  {/* Progress Bar Background */}
                  {!res.isMahjub && res.shareDecimal > 0 && (
                    <div 
                      className="absolute top-0 left-0 h-full bg-neonGreen/5 pointer-events-none transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, res.shareDecimal * 100)}%` }}
                    />
                  )}

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${res.isMahjub ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {res.member.relLabel}
                          </span>
                          {!res.isMahjub && (
                            <span className="text-[9px] bg-neonBlue/20 text-neonBlue px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                              {res.type === 'asabah' ? 'Asabah (Sisa)' : 'Furud'}
                            </span>
                          )}
                        </div>
                        {res.member.name && res.member.name !== 'Tanpa Nama' && (
                          <span className="text-[10px] text-gray-400">{res.member.name}</span>
                        )}
                      </div>
                      
                      {res.isMahjub ? (
                        <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">TERHIJAB</span>
                      ) : (
                        <div className="text-right">
                          <span className="text-xs font-bold text-neonGreen block">{res.shareFraction}</span>
                          <span className="text-[9px] text-gray-500 block">{(res.shareDecimal * 100).toFixed(1)}%</span>
                        </div>
                      )}
                    </div>

                    {res.isMahjub ? (
                      <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1.5">
                        <AlertCircle size={10} />
                        {res.mahjubReason}
                      </p>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <span className="text-sm font-bold text-white block">
                          {formatRupiah(res.shareAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Penjelasan Syar'i ─── */}
          <div className="mt-6">
            <button
              onClick={() => setShowExplanation(v => !v)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
                  <BookOpen size={17} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-amber-300">Penjelasan Syar'i</p>
                  <p className="text-[10px] text-amber-500/70 mt-0.5">Dasar hukum & alasan pembagian</p>
                </div>
              </div>
              <div className="text-amber-400 group-hover:text-amber-300 transition-colors">
                {showExplanation ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {showExplanation && (
              <div className="mt-3 space-y-3 animate-fade-in">
                {explanation.map((para, idx) => (
                  <div
                    key={idx}
                    className="relative p-4 rounded-xl bg-[#111] border border-white/5 overflow-hidden"
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400/60 to-amber-600/20 rounded-l-xl" />
                    <p className="pl-3 text-[12px] text-gray-300 leading-relaxed">
                      {para}
                    </p>
                  </div>
                ))}

                <div className="mt-4 p-4 rounded-xl bg-neonGreen/5 border border-neonGreen/10 flex gap-3 items-start">
                  <CheckCircle2 size={16} className="text-neonGreen/60 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Perhitungan ini berdasarkan pedoman Fikih Waris yang valid. Untuk keputusan hukum resmi, disarankan tetap berkonsultasi dengan Ulama atau Pengadilan Agama setempat.
                  </p>
                </div>
              </div>
            )}
          </div>

          {!showExplanation && (
            <div className="mt-6 text-center px-4">
              <CheckCircle2 size={28} className="text-neonGreen/40 mx-auto mb-2" />
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Perhitungan ini berdasarkan pedoman Fikih Waris yang valid. Untuk keputusan hukum resmi, disarankan berkonsultasi dengan Ulama atau Pengadilan Agama setempat.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Result;
