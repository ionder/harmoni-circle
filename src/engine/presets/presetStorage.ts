// src/engine/presets/presetStorage.ts
import type { ModeName } from '../theory/modeEngine';
import type { ChordTexture } from '../theory/chordUtils';
import type { VoicingStyle } from '../theory/voicingTypes';
import type { SoundPreset } from '../sound/soundTypes';

const STORAGE_KEY = 'harmoni-presets-v1';

export interface HarmoniPresetData {
  keyRoot: string;
  mode: ModeName;
  chordTexture: ChordTexture;
  voicingStyle: VoicingStyle;
  soundPreset: SoundPreset;
  instrument: 'piano' | 'guitar';
  progression: string[];
}

export interface HarmoniPreset {
  id: string;
  name: string;
  createdAt: string;
  data: HarmoniPresetData;
}

function safeParse(json: string | null): HarmoniPreset[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function loadPresets(): HarmoniPreset[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw);
}

export function savePresets(presets: HarmoniPreset[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function createPreset(
  name: string,
  data: HarmoniPresetData,
): HarmoniPreset {
  const id = `preset_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const createdAt = new Date().toISOString();
  return { id, name, createdAt, data };
}

export function deletePreset(id: string): HarmoniPreset[] {
  const presets = loadPresets();
  const next = presets.filter((p) => p.id !== id);
  savePresets(next);
  return next;
}