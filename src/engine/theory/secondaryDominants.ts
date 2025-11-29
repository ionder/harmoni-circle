// src/engine/theory/secondaryDominants.ts
import { buildModeScale, normalizeNoteName, type ModeName } from './modeEngine';

const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transpose(note: string, semitones: number): string {
  const normalized = normalizeNoteName(note);
  const idx = NOTE_ORDER.indexOf(normalized);
  if (idx === -1) return normalized;
  return NOTE_ORDER[(idx + semitones + NOTE_ORDER.length) % NOTE_ORDER.length];
}

export interface SecondaryDominant {
  label: string;     // örn: "V/ii"
  chordRoot: string; // örn: "D"
}

/**
 * Tonaliteye göre ikincil dominant akor köklerini döner.
 * Şimdilik klasik major (Ionian) ölçeği baz alıyoruz.
 * Mode ne olursa olsun, referans gam Ionian.
 */
export function getSecondaryDominants(
  keyRoot: string,
  _mode: ModeName,
): SecondaryDominant[] {
  // Her zaman Ionian temelini kullanıyoruz (C maj, G maj vs.)
  const scale = buildModeScale(keyRoot, 'ionian').map(normalizeNoteName);

  // ii, iii, IV, V, vi dereceleri
  const degreeIndices = [1, 2, 3, 4, 5];
  const degreeLabels = ['ii', 'iii', 'IV', 'V', 'vi'];

  const result: SecondaryDominant[] = [];

  degreeIndices.forEach((degIndex, i) => {
    const degreeRoot = scale[degIndex];
    if (!degreeRoot) return;

    // Bir akorun dominantı = kökten 7 yarım ses yukarısı
    const domRoot = transpose(degreeRoot, 7);

    result.push({
      label: `V/${degreeLabels[i]}`,
      chordRoot: domRoot,
    });
  });

  return result;
}