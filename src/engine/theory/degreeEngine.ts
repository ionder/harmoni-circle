import { buildModeScale, normalizeNoteName } from './modeEngine';
import type { ModeName } from './modeEngine';

const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const DEGREE_SYMBOLS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export function getDegreeForChord(
  tonic: string,
  mode: ModeName,
  chordRoot: string,
): string {
  const scale = buildModeScale(tonic, mode).map(normalizeNoteName);
  const root = normalizeNoteName(chordRoot);

  const index = scale.indexOf(root);

  if (index === -1) {
    return getAlteredDegree(scale, root);
  }

  return DEGREE_SYMBOLS[index];
}

function getAlteredDegree(scale: string[], root: string): string {
  const rootIndex = NOTE_ORDER.indexOf(root);
  if (rootIndex === -1) return '?';

  const scaleSemis = scale.map((n) => NOTE_ORDER.indexOf(n));

  let bestDegree = 0;
  let smallestDiff = 999;

  scaleSemis.forEach((semi, i) => {
    const diff = rootIndex - semi;
    const abs = Math.abs(diff);

    if (abs < smallestDiff) {
      smallestDiff = abs;
      bestDegree = i;
    }
  });

  const baseDegree = DEGREE_SYMBOLS[bestDegree];
  const diff = rootIndex - scaleSemis[bestDegree];

  if (diff === -1) return 'b' + baseDegree;
  if (diff === 1) return '#' + baseDegree;

  return baseDegree;
}