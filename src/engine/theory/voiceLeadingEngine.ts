// src/engine/theory/voiceLeadingEngine.ts
import { normalizeNoteName } from './modeEngine';
import type { VoicingStyle } from './voicingTypes';

const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function pcToMidi(pc: string, octave: number): number {
  const normalized = normalizeNoteName(pc);
  const idx = NOTE_ORDER.indexOf(normalized);
  if (idx === -1) return 60; // C4 fallback
  return octave * 12 + idx;
}

function noteToMidi(note: string): number {
  const match = note.match(/^([A-G](?:#|b)?)(\d)$/);
  if (!match) return 60;
  const [, pc, octStr] = match;
  const octave = Number(octStr);
  return pcToMidi(pc, octave);
}

function midiToNote(midi: number): string {
  const octave = Math.floor(midi / 12);
  const idx = midi % 12;
  const pc = NOTE_ORDER[idx];
  return `${pc}${octave}`;
}

/**
 * Shell voicing için: root, third, seventh seçer (varsa).
 * pcs: pitch-class dizisi (triad / seventh / extended farketmez)
 */
function reduceToShell(pcs: string[]): string[] {
  if (pcs.length <= 3) return pcs;

  // Bizim chordUtils extended dizilişimiz:
  // triad: [1,3,5]
  // seventh: [1,3,5,7]
  // extended: [1,3,7,9,11,13]  (root=0, third=1, seventh=2)
  const root = pcs[0];
  const third = pcs[1] ?? pcs[0];
  const seventh = pcs[2] ?? pcs[pcs.length - 1];

  return [root, third, seventh];
}

/**
 * Basit otomatik voice leading:
 * - style='smooth' → mevcut close voice leading (3–5. oktav)
 * - style='shell' → 1–3–7'e indirip close leading
 * - style='wide' → close hesaplayıp, spread çok darsa en üst sesi 1 oktav yukarı alır
 * Hem triad (3 ses), hem seventh (4 ses), hem extended (6 ses) ile çalışır.
 */
export function getVoiceLedVoicing(
  prevVoicing: string[] | null,
  chordPitchClasses: string[],
  style: VoicingStyle,
): string[] {
  let pcs = chordPitchClasses.map((pc) => normalizeNoteName(pc));

  if (style === 'shell') {
    pcs = reduceToShell(pcs);
  }

  const n = pcs.length;

  // İlk akor: temel voicing
  if (!prevVoicing || prevVoicing.length !== n) {
    if (style === 'wide') {
      // Hafif yayılmış ilk voicing: root 3. oktav, diğerleri 4–5
      return pcs.map((pc, i) => {
        const oct = Math.min(3 + i, 5);
        return `${pc}${oct}`;
      });
    }

    // smooth / shell: hepsi 4. oktav
    return pcs.map((pc) => `${pc}4`);
  }

  const prevMidis = prevVoicing.map(noteToMidi);
  const candidateOctaves = [3, 4, 5];

  let bestCombo: number[] = [];
  let bestScore = Infinity;

  // n ses için 3^n kombinasyon brute-force
  const recurse = (index: number, current: number[]) => {
    if (index === n) {
      const comboMidis = current.map((oct, i) => pcToMidi(pcs[i], oct));
      const baseScore = comboMidis.reduce(
        (acc, midi, i) => acc + Math.abs(midi - prevMidis[i]),
        0,
      );

      let score = baseScore;

      // wide için: spread'i artırmaya hafif teşvik
      if (style === 'wide') {
        const max = Math.max(...comboMidis);
        const min = Math.min(...comboMidis);
        const spread = max - min; // semitone cinsinden
        // Spread küçükse azıcık ceza veriyoruz (yani geniş spread'i tercih ediyor)
        score -= spread * 0.3;
      }

      if (score < bestScore) {
        bestScore = score;
        bestCombo = comboMidis;
      }
      return;
    }

    for (const oct of candidateOctaves) {
      current[index] = oct;
      recurse(index + 1, current);
    }
  };

  recurse(0, new Array(n).fill(4));

  if (bestCombo.length === 0) {
    return pcs.map((pc) => `${pc}4`);
  }

  // wide için son bir dokunuş: spread çok küçükse en üst sesi 1 oktav yukarı taşı
  if (style === 'wide') {
    const max = Math.max(...bestCombo);
    const min = Math.min(...bestCombo);
    const spread = max - min;
    if (spread < 7) {
      const maxIndex = bestCombo.indexOf(max);
      bestCombo[maxIndex] = max + 12;
    }
  }

  return bestCombo.map(midiToNote);
}