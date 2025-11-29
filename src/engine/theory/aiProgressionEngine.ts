// src/engine/theory/aiProgressionEngine.ts
import { buildModeScale, type ModeName } from './modeEngine';

export type AIVibe = 'pop' | 'cinematic' | 'jazz';

// Degree (0-based) → akor kökü
function degreeToRoot(keyRoot: string, mode: ModeName, degree: number): string {
  const scale = buildModeScale(keyRoot, mode);
  if (scale.length === 0) return keyRoot;
  const idx = ((degree % scale.length) + scale.length) % scale.length;
  return scale[idx];
}

// Major scale referanslı degree pattern'leri:
// 0=I, 1=ii, 2=iii, 3=IV, 4=V, 5=vi, 6=vii°
const POP_PATTERNS: number[][] = [
  [0, 4, 5, 3], // I – V – vi – IV
  [5, 3, 0, 4], // vi – IV – I – V
  [0, 5, 3, 4], // I – vi – IV – V
];

const CINEMATIC_PATTERNS: number[][] = [
  [0, 3, 4, 0], // I – IV – V – I
  [0, 2, 5, 4], // I – ii – vi – V
  [0, 5, 2, 3], // I – vi – ii – IV
];

const JAZZ_PATTERNS: number[][] = [
  [1, 4, 0, 5], // ii – V – I – vi
  [1, 4, 0, 0], // ii – V – I – I
  [5, 1, 4, 0], // vi – ii – V – I
];

function pickPattern(vibe: AIVibe): number[] {
  const pool =
    vibe === 'pop'
      ? POP_PATTERNS
      : vibe === 'cinematic'
      ? CINEMATIC_PATTERNS
      : JAZZ_PATTERNS;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

/**
 * Seçilen vibe'a göre, key + mode/makam içinde akor kökleri üretir.
 * Sonuç: ['C','G','Am','F'] yerine kök isimleri: ['C','G','A','F']
 * Bizim sistem akor kalitesini mode'dan türetiyor.
 */
export function generateAIProgression(
  keyRoot: string,
  mode: ModeName,
  vibe: AIVibe,
  length: number = 4,
): string[] {
  const pattern = pickPattern(vibe);
  const chords: string[] = [];

  for (let i = 0; i < length; i += 1) {
    const degree = pattern[i % pattern.length];
    const root = degreeToRoot(keyRoot, mode, degree);
    chords.push(root);
  }

  return chords;
}