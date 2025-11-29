import {
  buildTriadFromMode,
  buildSeventhFromMode,
  buildExtendedFromMode,
  type ModeName,
} from './modeEngine';

// Triad mı, 7'li mi, extended mı?
export type ChordTexture = 'triad' | 'seventh' | 'extended';

// Klavyeye göre normalleştirilmiş majör triadlar (sadece Ionian için)
const TRIADS: Record<string, string[]> = {
  C: ['C', 'E', 'G'],
  G: ['G', 'B', 'D'],
  D: ['D', 'F#', 'A'],
  A: ['A', 'C#', 'E'],
  E: ['E', 'G#', 'B'],
  B: ['B', 'D#', 'F#'],
  F: ['F', 'A', 'C'],
  'F#': ['F#', 'A#', 'C#'],
  'C#': ['C#', 'F', 'G#'],
  Ab: ['G#', 'C', 'D#'],
  Eb: ['D#', 'G', 'A#'],
  Bb: ['A#', 'D', 'F'],
};

/**
 * Verilen kök + mode + texture'a göre akor notalarını döner.
 * texture = 'triad'   → 1–3–5
 * texture = 'seventh' → 1–3–5–7
 * texture = 'extended'→ 1–3–7–9–11–13 (mode'a göre)
 */
export function getChordNotes(
  chord: string,
  mode: ModeName = 'ionian',
  texture: ChordTexture = 'triad',
): string[] {
  if (texture === 'extended') {
    return buildExtendedFromMode(chord, mode);
  }

  if (texture === 'seventh') {
    return buildSeventhFromMode(chord, mode);
  }

  // TRIAD
  if (mode !== 'ionian') {
    // Diğer modlarda modal triad
    return buildTriadFromMode(chord, mode);
  }

  // Ionian + Circle of Fifths ana majör triadları
  return TRIADS[chord] || ['C', 'E', 'G'];
}