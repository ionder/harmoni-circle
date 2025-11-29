import type { FC } from 'react';
import { PianoKey } from './PianoKey';

interface PianoProps {
  activeNotes: string[]; // ['C','E','G'] gibi pitch class listesi
}

// İki oktavlık klavye: C–B, C–B
// pitch: aktif olup olmayacağını kontrol ettiğimiz isim
// label: tuş üzerinde yazacak isim
const PIANO_KEYS = [
  // 1. oktav (düşük)
  { id: 'C1', pitch: 'C', label: 'C' },
  { id: 'C#1', pitch: 'C#', label: 'C#' },
  { id: 'D1', pitch: 'D', label: 'D' },
  { id: 'D#1', pitch: 'D#', label: 'D#' },
  { id: 'E1', pitch: 'E', label: 'E' },
  { id: 'F1', pitch: 'F', label: 'F' },
  { id: 'F#1', pitch: 'F#', label: 'F#' },
  { id: 'G1', pitch: 'G', label: 'G' },
  { id: 'G#1', pitch: 'G#', label: 'G#' },
  { id: 'A1', pitch: 'A', label: 'A' },
  { id: 'A#1', pitch: 'A#', label: 'A#' },
  { id: 'B1', pitch: 'B', label: 'B' },

  // 2. oktav (yüksek)
  { id: 'C2', pitch: 'C', label: 'C' },
  { id: 'C#2', pitch: 'C#', label: 'C#' },
  { id: 'D2', pitch: 'D', label: 'D' },
  { id: 'D#2', pitch: 'D#', label: 'D#' },
  { id: 'E2', pitch: 'E', label: 'E' },
  { id: 'F2', pitch: 'F', label: 'F' },
  { id: 'F#2', pitch: 'F#', label: 'F#' },
  { id: 'G2', pitch: 'G', label: 'G' },
  { id: 'G#2', pitch: 'G#', label: 'G#' },
  { id: 'A2', pitch: 'A', label: 'A' },
  { id: 'A#2', pitch: 'A#', label: 'A#' },
  { id: 'B2', pitch: 'B', label: 'B' },
];

export const Piano: FC<PianoProps> = ({ activeNotes }) => (
  <div className="piano">
    {PIANO_KEYS.map((key) => (
      <PianoKey
        key={key.id}
        label={key.label}
        isBlack={key.pitch.includes('#')}
        isActive={activeNotes.includes(key.pitch)}
      />
    ))}
  </div>
);