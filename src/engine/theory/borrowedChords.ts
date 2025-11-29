// src/engine/theory/borrowedChords.ts
import { buildModeScale, normalizeNoteName, type ModeName } from './modeEngine';

export interface BorrowedChord {
  label: string;     // Örn: "♭III"
  chordRoot: string; // Örn: "Eb"
}

/**
 * Major tonaliteden (Ionian) paralel minöre (Aeolian) ödünç akor kökleri.
 *
 * C maj → C aeolian:
 *   ♭III = Eb
 *   ♭VI  = Ab
 *   ♭VII = Bb
 *   iv   = F min kökü (F)
 */
export function getBorrowedChords(
  keyRoot: string,
  _mode: ModeName,
): BorrowedChord[] {
  // Ionian ve Aeolian gamlarını al
  const majorScale = buildModeScale(keyRoot, 'ionian').map(normalizeNoteName);
  const minorScale = buildModeScale(keyRoot, 'aeolian').map(normalizeNoteName);

  // Güvenlik
  if (majorScale.length < 7 || minorScale.length < 7) return [];

  // Paralel minörden tipik modal interchange kökleri:
  const bIII = minorScale[2]; // ♭3. derece
  const iv = minorScale[3];   // 4. derece (minör akor kökü)
  const bVI = minorScale[5];  // ♭6
  const bVII = minorScale[6]; // ♭7

  const result: BorrowedChord[] = [];

  if (bIII) {
    result.push({
      label: '♭III',
      chordRoot: bIII,
    });
  }

  if (iv) {
    result.push({
      label: 'iv',
      chordRoot: iv,
    });
  }

  if (bVI) {
    result.push({
      label: '♭VI',
      chordRoot: bVI,
    });
  }

  if (bVII) {
    result.push({
      label: '♭VII',
      chordRoot: bVII,
    });
  }

  return result;
}