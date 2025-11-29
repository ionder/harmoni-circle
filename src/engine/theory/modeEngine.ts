// src/engine/theory/modeEngine.ts

// Western modlar + 12-TET makam approximations
export type ModeName =
  | 'ionian'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian'
  | 'makam_hicaz'
  | 'makam_kurdi'
  | 'makam_huseyni'
  | 'makam_ussak';

// Klavyede kullandığımız temel nota dizisi (diyez ağırlıklı)
const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Bemolleri diyez eşdeğerine çeviriyoruz
export const ENHARMONIC_MAP: Record<string, string> = {
  Bb: 'A#',
  Eb: 'D#',
  Ab: 'G#',
  Db: 'C#',
  Gb: 'F#',
};

export function normalizeNoteName(note: string): string {
  return ENHARMONIC_MAP[note] ?? note;
}

// Her mod / makam için interval yapısı (majör gam referanslı)
// Makamlar 12-TET approx, gerçek koma sisteminin sadeleştirilmiş halidir.
export const MODE_INTERVALS: Record<ModeName, number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],

  // Makam approximations (12-TET)
  // Hicaz: 1,3,1,2,1,3,1 → 0,1,4,5,7,8,11
  makam_hicaz: [0, 1, 4, 5, 7, 8, 11],
  // Kürdi: Phrygian'a yakın
  makam_kurdi: [0, 1, 3, 5, 7, 8, 10],
  // Hüseyni: Dorian / minor karışımı, burada Dorian approx
  makam_huseyni: [0, 2, 3, 5, 7, 9, 10],
  // Uşşak: burada 12-TET'te kabaca 0,1,3,5,7,9,10
  makam_ussak: [0, 1, 3, 5, 7, 9, 10],
};

export function buildModeScale(root: string, mode: ModeName): string[] {
  const normalized = normalizeNoteName(root);
  const rootIndex = NOTE_ORDER.indexOf(normalized);
  if (rootIndex === -1) return [normalized];

  const intervals = MODE_INTERVALS[mode];
  return intervals.map(
    (semi) => NOTE_ORDER[(rootIndex + semi) % NOTE_ORDER.length],
  );
}

// 1–3–5 triad
export function buildTriadFromMode(root: string, mode: ModeName): string[] {
  const scale = buildModeScale(root, mode);
  if (scale.length < 5) return scale;
  return [scale[0], scale[2], scale[4]];
}

// 1–3–5–7 (seventh chords)
export function buildSeventhFromMode(root: string, mode: ModeName): string[] {
  const scale = buildModeScale(root, mode);
  if (scale.length < 7) return scale.slice(0, 4);
  return [scale[0], scale[2], scale[4], scale[6]];
}

// 1–3–7–9–11–13 (extended): 0,2,6,1,3,5 indexleri
export function buildExtendedFromMode(root: string, mode: ModeName): string[] {
  const scale = buildModeScale(root, mode);
  if (scale.length < 7) return scale; // güvenlik
  const order = [0, 2, 6, 1, 3, 5]; // 1,3,7,9,11,13
  return order.map((i) => scale[i]);
}

// Daire üzerinde highlight edeceğimiz diatonik akor kökleri
export function getDiatonicChordRoots(tonic: string, mode: ModeName): string[] {
  const scale = buildModeScale(tonic, mode);
  return scale.map(normalizeNoteName);
}

// ---- Makam yardımcıları ----

export function isMakamMode(mode: ModeName): boolean {
  return (
    mode === 'makam_hicaz' ||
    mode === 'makam_kurdi' ||
    mode === 'makam_huseyni' ||
    mode === 'makam_ussak'
  );
}

type MakamId = Extract<
  ModeName,
  'makam_hicaz' | 'makam_kurdi' | 'makam_huseyni' | 'makam_ussak'
>;

interface MakamMeta {
  id: MakamId;
  label: string;
  // scale index (0–6)
  kararDegree: number;
  gucluDegree: number;
  yedenDegree?: number;
}

// Dereceler kabaca:
// Hicaz: Karar 1, Güçlü 5, Yeden 7
// Kürdi: Karar 1, Güçlü 4, Yeden 7
// Hüseyni: Karar 1, Güçlü 5, Yeden 7
// Uşşak: Karar 1, Güçlü 4, Yeden 7
const MAKAM_META: Record<MakamId, MakamMeta> = {
  makam_hicaz: {
    id: 'makam_hicaz',
    label: 'Hicaz',
    kararDegree: 0,
    gucluDegree: 4,
    yedenDegree: 6,
  },
  makam_kurdi: {
    id: 'makam_kurdi',
    label: 'Kürdi',
    kararDegree: 0,
    gucluDegree: 3,
    yedenDegree: 6,
  },
  makam_huseyni: {
    id: 'makam_huseyni',
    label: 'Hüseynî',
    kararDegree: 0,
    gucluDegree: 4,
    yedenDegree: 6,
  },
  makam_ussak: {
    id: 'makam_ussak',
    label: 'Uşşak',
    kararDegree: 0,
    gucluDegree: 3,
    yedenDegree: 6,
  },
};

export function getMakamPowerNotes(root: string, mode: ModeName): string[] {
  if (!isMakamMode(mode)) return [];
  const meta = MAKAM_META[mode as MakamId];
  const scale = buildModeScale(root, mode);
  const notes: string[] = [];

  const karar = scale[meta.kararDegree] ?? scale[0];
  const guclu = scale[meta.gucluDegree] ?? scale[4] ?? scale[0];

  notes.push(karar, guclu);

  if (meta.yedenDegree != null) {
    const yeden = scale[meta.yedenDegree] ?? scale[scale.length - 1];
    notes.push(yeden);
  }

  return notes;
}