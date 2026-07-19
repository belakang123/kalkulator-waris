export interface Member {
  id: number;
  relId: string;
  relLabel: string;
  name: string;
  status: 'hidup' | 'meninggal';
}

export interface FaraidResult {
  member: Member;
  shareFraction: string;
  shareDecimal: number;
  shareAmount: number;
  isMahjub: boolean;
  mahjubReason: string;
  type: 'furud' | 'asabah' | 'mahjub';
}

// Helper untuk menyederhanakan pecahan (Fraction)
class Fraction {
  num: number;
  den: number;

  constructor(num: number, den: number) {
    if (den === 0) {
      this.num = 0;
      this.den = 1;
      return;
    }
    const gcd = this.gcd(num, den);
    this.num = num / gcd;
    this.den = den / gcd;
  }

  gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  add(other: Fraction): Fraction {
    return new Fraction(this.num * other.den + other.num * this.den, this.den * other.den);
  }

  sub(other: Fraction): Fraction {
    return new Fraction(this.num * other.den - other.num * this.den, this.den * other.den);
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  mulInt(val: number): Fraction {
    return new Fraction(this.num * val, this.den);
  }

  divInt(val: number): Fraction {
    return new Fraction(this.num, this.den * val);
  }

  valueOf(): number {
    return this.num / this.den;
  }

  toString(): string {
    if (this.num === 0) return "0";
    if (this.num === this.den) return "1";
    return `${this.num}/${this.den}`;
  }
}

export const calculateFaraid = (
  members: Member[],
  totalHartaNetto: number,
  hukumType: 'jumhur' | 'khi'
): FaraidResult[] => {
  // Hanya hitung anggota yang hidup
  const living = members.filter(m => m.status === 'hidup');
  
  // Hitung jumlah masing-masing golongan
  const count = {
    suami: 0, istri: 0, ayah: 0, ibu: 0,
    anak_lk: 0, anak_pr: 0,
    saudara_kandung_lk: 0, saudara_kandung_pr: 0,
    saudara_seayah_lk: 0, saudara_seayah_pr: 0,
    saudara_seibu_lk: 0, saudara_seibu_pr: 0,
  };

  living.forEach(m => {
    if (count[m.relId as keyof typeof count] !== undefined) {
      count[m.relId as keyof typeof count]++;
    }
  });

  const results: Record<number, { f: Fraction, isMahjub: boolean, reason: string, type: 'furud'|'asabah'|'mahjub' }> = {};
  living.forEach(m => {
    results[m.id] = { f: new Fraction(0, 1), isMahjub: false, reason: "", type: 'furud' };
  });

  // 1. Identifikasi Hijab (Mahjub)
  const isMahjub = (relId: string): { mahjub: boolean, reason: string } => {
    if (relId.startsWith('saudara_')) {
      if (count.ayah > 0) return { mahjub: true, reason: "Terhijab oleh Ayah" };
      if (count.anak_lk > 0) return { mahjub: true, reason: "Terhijab oleh Anak Laki-laki" };
      
      if (relId.startsWith('saudara_seayah')) {
        if (count.saudara_kandung_lk > 0) return { mahjub: true, reason: "Terhijab oleh Sdr. Kandung Laki-laki" };
        if (count.saudara_kandung_pr > 0 && count.anak_pr > 0) return { mahjub: true, reason: "Terhijab oleh Sdr. Kandung Pr (Asabah bersama Anak Pr)" };
        if (count.saudara_kandung_pr >= 2 && count.saudara_seayah_lk === 0) return { mahjub: true, reason: "Terhijab oleh 2+ Sdr. Kandung Pr" };
      }
      
      if (relId.startsWith('saudara_seibu')) {
        if (count.anak_pr > 0) return { mahjub: true, reason: "Terhijab oleh Anak Perempuan" };
      }
    }
    return { mahjub: false, reason: "" };
  };

  // Mark Mahjub
  living.forEach(m => {
    const { mahjub, reason } = isMahjub(m.relId);
    if (mahjub) {
      results[m.id].isMahjub = true;
      results[m.id].reason = reason;
      results[m.id].type = 'mahjub';
    }
  });

  // Hitung ahli waris yang tidak mahjub
  const activeCount = { ...count };
  Object.keys(activeCount).forEach(k => {
    if (isMahjub(k).mahjub) activeCount[k as keyof typeof activeCount] = 0;
  });

  // 2. Pembagian Dzawil Furud
  let totalFurud = new Fraction(0, 1);
  const addFurud = (relId: string, fraction: Fraction) => {
    const membersOfRel = living.filter(m => m.relId === relId && !results[m.id].isMahjub);
    if (membersOfRel.length > 0) {
      const perPerson = fraction.divInt(membersOfRel.length);
      membersOfRel.forEach(m => {
        results[m.id].f = perPerson;
        results[m.id].type = 'furud';
      });
      totalFurud = totalFurud.add(fraction);
    }
  };

  const hasChildren = activeCount.anak_lk > 0 || activeCount.anak_pr > 0;
  const totalSiblings = activeCount.saudara_kandung_lk + activeCount.saudara_kandung_pr + 
                        activeCount.saudara_seayah_lk + activeCount.saudara_seayah_pr + 
                        activeCount.saudara_seibu_lk + activeCount.saudara_seibu_pr;

  // Suami / Istri
  let spouseShare = new Fraction(0, 1);
  if (activeCount.suami > 0) {
    spouseShare = hasChildren ? new Fraction(1, 4) : new Fraction(1, 2);
    addFurud('suami', spouseShare);
  }
  if (activeCount.istri > 0) {
    spouseShare = hasChildren ? new Fraction(1, 8) : new Fraction(1, 4);
    addFurud('istri', spouseShare);
  }

  // Ibu
  let ibuShare = new Fraction(0, 1);
  if (activeCount.ibu > 0) {
    if (hasChildren || totalSiblings >= 2) {
      ibuShare = new Fraction(1, 6);
    } else {
      // Cek Masalah Gharrawain (Umariyatain): Suami/Istri + Ibu + Ayah (Tanpa anak & <2 saudara)
      const isGharrawain = (activeCount.suami > 0 || activeCount.istri > 0) && activeCount.ayah > 0;
      if (isGharrawain) {
        // Ibu dapat 1/3 dari sisa setelah porsi suami/istri
        const sisa = new Fraction(1, 1).sub(spouseShare);
        ibuShare = sisa.mul(new Fraction(1, 3));
      } else {
        ibuShare = new Fraction(1, 3);
      }
    }
    addFurud('ibu', ibuShare);
  }

  // Ayah
  let ayahIsAsabah = false;
  if (activeCount.ayah > 0) {
    if (activeCount.anak_lk > 0) {
      addFurud('ayah', new Fraction(1, 6)); // Hanya furud
    } else if (activeCount.anak_pr > 0) {
      addFurud('ayah', new Fraction(1, 6)); 
      ayahIsAsabah = true; // Furud + Asabah
    } else {
      ayahIsAsabah = true; // Asabah murni
    }
  }

  // Anak Perempuan
  let anakPrIsAsabah = activeCount.anak_lk > 0;
  if (activeCount.anak_pr > 0 && !anakPrIsAsabah) {
    addFurud('anak_pr', activeCount.anak_pr === 1 ? new Fraction(1, 2) : new Fraction(2, 3));
  }

  // Saudari Kandung
  let sdrKandungPrIsAsabah = false;
  if (activeCount.saudara_kandung_pr > 0) {
    if (activeCount.saudara_kandung_lk > 0) {
      sdrKandungPrIsAsabah = true; // Asabah Bil Ghair
    } else if (activeCount.anak_pr > 0) {
      sdrKandungPrIsAsabah = true; // Asabah Ma'al Ghair
    } else {
      addFurud('saudara_kandung_pr', activeCount.saudara_kandung_pr === 1 ? new Fraction(1, 2) : new Fraction(2, 3));
    }
  }

  // Saudari Seayah
  let sdrSeayahPrIsAsabah = false;
  if (activeCount.saudara_seayah_pr > 0) {
    if (activeCount.saudara_seayah_lk > 0) {
      sdrSeayahPrIsAsabah = true; // Asabah Bil Ghair
    } else if (activeCount.anak_pr > 0 && activeCount.saudara_kandung_pr === 0) {
      sdrSeayahPrIsAsabah = true; // Asabah Ma'al Ghair
    } else if (activeCount.saudara_kandung_pr === 1 && activeCount.anak_pr === 0) {
      // Takmilah li tsulutsain (Pelengkap 2/3)
      addFurud('saudara_seayah_pr', new Fraction(1, 6));
    } else if (activeCount.saudara_kandung_pr === 0 && activeCount.anak_pr === 0) {
      addFurud('saudara_seayah_pr', activeCount.saudara_seayah_pr === 1 ? new Fraction(1, 2) : new Fraction(2, 3));
    }
  }

  // Saudara/i Seibu
  const countSeibu = activeCount.saudara_seibu_lk + activeCount.saudara_seibu_pr;
  if (countSeibu > 0) {
    const seibuShare = countSeibu === 1 ? new Fraction(1, 6) : new Fraction(1, 3);
    const perPerson = seibuShare.divInt(countSeibu);
    living.filter(m => m.relId === 'saudara_seibu_lk' || m.relId === 'saudara_seibu_pr')
      .forEach(m => {
        if (!results[m.id].isMahjub) {
          results[m.id].f = perPerson;
          results[m.id].type = 'furud';
        }
      });
    totalFurud = totalFurud.add(seibuShare);
  }

  // 3. 'Aul (Pecahan > 1)
  if (totalFurud.valueOf() > 1) {
    // Cari penyebut yang sama untuk semua
    let kpk = 1;
    living.forEach(m => {
      if (!results[m.id].isMahjub && results[m.id].f.num > 0) {
        kpk = (kpk * results[m.id].f.den) / new Fraction(kpk, results[m.id].f.den).gcd(kpk, results[m.id].f.den);
      }
    });

    let newTotalNum = 0;
    living.forEach(m => {
      if (!results[m.id].isMahjub && results[m.id].f.num > 0) {
        const numMultiplier = kpk / results[m.id].f.den;
        const newNum = results[m.id].f.num * numMultiplier;
        results[m.id].f = new Fraction(newNum, 1); // Simpan nilai atas sementara
        newTotalNum += newNum;
      }
    });

    // Apply 'Aul (penyebut menjadi newTotalNum)
    living.forEach(m => {
      if (!results[m.id].isMahjub && results[m.id].f.num > 0) {
        results[m.id].f = new Fraction(results[m.id].f.num, newTotalNum);
      }
    });
    totalFurud = new Fraction(1, 1); // Sudah full 100%
  }

  // 4. Asabah (Sisa Harta)
  let sisa = new Fraction(1, 1).sub(totalFurud);
  if (sisa.valueOf() > 0) {
    let asabahSet: { ids: number[], type: string, portions: number[] } | null = null;

    if (activeCount.anak_lk > 0) {
      const ids: number[] = [];
      const portions: number[] = [];
      living.filter(m => m.relId === 'anak_lk' || m.relId === 'anak_pr').forEach(m => {
        ids.push(m.id);
        portions.push(m.relId === 'anak_lk' ? 2 : 1);
      });
      asabahSet = { ids, type: "Asabah", portions };
    } 
    else if (ayahIsAsabah) {
      const ayah = living.find(m => m.relId === 'ayah');
      if (ayah) {
        asabahSet = { ids: [ayah.id], type: "Asabah", portions: [1] };
      }
    }
    else if (activeCount.saudara_kandung_lk > 0 || sdrKandungPrIsAsabah) {
      const ids: number[] = [];
      const portions: number[] = [];
      living.filter(m => m.relId === 'saudara_kandung_lk' || m.relId === 'saudara_kandung_pr').forEach(m => {
        if (!results[m.id].isMahjub) {
          ids.push(m.id);
          portions.push(m.relId === 'saudara_kandung_lk' ? 2 : 1);
        }
      });
      asabahSet = { ids, type: "Asabah", portions };
    }
    else if (activeCount.saudara_seayah_lk > 0 || sdrSeayahPrIsAsabah) {
      const ids: number[] = [];
      const portions: number[] = [];
      living.filter(m => m.relId === 'saudara_seayah_lk' || m.relId === 'saudara_seayah_pr').forEach(m => {
        if (!results[m.id].isMahjub) {
          ids.push(m.id);
          portions.push(m.relId === 'saudara_seayah_lk' ? 2 : 1);
        }
      });
      asabahSet = { ids, type: "Asabah", portions };
    }

    if (asabahSet) {
      const totalPortions = asabahSet.portions.reduce((a, b) => a + b, 0);
      const valPerPortion = sisa.divInt(totalPortions);
      asabahSet.ids.forEach((id, idx) => {
        const asabahShare = valPerPortion.mulInt(asabahSet!.portions[idx]);
        results[id].f = results[id].f.add(asabahShare);
        if (results[id].type === 'furud') {
          results[id].type = 'asabah'; // Menandakan mendapat Furud + Asabah
        } else {
          results[id].type = 'asabah';
        }
      });
      sisa = new Fraction(0, 1);
    }
  }

  // 5. Radd (Jika masih ada sisa dan tidak ada Asabah)
  if (sisa.valueOf() > 0) {
    let raddTargetIds: number[] = [];
    
    // KHI vs Jumhur Radd Logic for spouses
    // Jumhur: Suami/Istri tidak dapat Radd
    // KHI: Seringkali mengembalikan ke Suami/Istri jika tidak ada ahli waris lain
    const spousesOnly = living.every(m => m.relId === 'suami' || m.relId === 'istri');
    
    if (hukumType === 'khi' && spousesOnly) {
       raddTargetIds = living.map(m => m.id);
    } else {
       raddTargetIds = living
        .filter(m => !results[m.id].isMahjub && m.relId !== 'suami' && m.relId !== 'istri')
        .map(m => m.id);
    }

    if (raddTargetIds.length > 0) {
      // Normalisasi porsi Radd (naikkan porsi sebanding dengan porsi awal mereka)
      let totalEligibleShare = new Fraction(0, 1);
      raddTargetIds.forEach(id => {
        totalEligibleShare = totalEligibleShare.add(results[id].f);
      });

      raddTargetIds.forEach(id => {
        // Porsi baru = porsi awal / totalEligibleShare
        const newShare = results[id].f.mul(new Fraction(totalEligibleShare.den, totalEligibleShare.num));
        results[id].f = newShare;
      });
    } else if (spousesOnly && hukumType === 'jumhur') {
      // Baitul Mal (Sisa Harta dikembalikan ke negara/Baitul Mal), porsi tetap
    }
  }

  // Format the output
  const output: FaraidResult[] = living.map(m => {
    const res = results[m.id];
    return {
      member: m,
      shareFraction: res.isMahjub ? "0" : res.type === 'asabah' && res.f.num === res.f.den ? "Semua Sisa" : res.f.toString(),
      shareDecimal: res.f.valueOf(),
      shareAmount: res.f.valueOf() * totalHartaNetto,
      isMahjub: res.isMahjub,
      mahjubReason: res.reason,
      type: res.type
    };
  });

  return output.sort((a, b) => b.shareDecimal - a.shareDecimal);
};
