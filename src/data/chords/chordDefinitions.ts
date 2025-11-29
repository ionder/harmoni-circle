// src/data/chords/chordDefinitions.ts

// Hem majör, hem relative minör, renk ve key signature tutuyoruz.
export interface CircleSlice {
  chord: string;      // majör kök (seçim için)
  major: string;      // majör isim (outer)
  minor: string;      // relative minör (inner)
  color: string;      // o dilimin temel rengi
  keySignature: string; // kaç diyez / bemol
}

// Circle of Fifths sırasına göre: C – G – D – A – E – B – F# – C# – Ab – Eb – Bb – F
export const CIRCLE_MAP: CircleSlice[] = [
  { chord: 'C',  major: 'C',  minor: 'Am',  color: '#ff6b6b', keySignature: '0' },
  { chord: 'G',  major: 'G',  minor: 'Em',  color: '#ffb35b', keySignature: '1♯' },
  { chord: 'D',  major: 'D',  minor: 'Bm',  color: '#ffd66b', keySignature: '2♯' },
  { chord: 'A',  major: 'A',  minor: 'F#m', color: '#c7e76b', keySignature: '3♯' },
  { chord: 'E',  major: 'E',  minor: 'C#m', color: '#7dd87b', keySignature: '4♯' },
  { chord: 'B',  major: 'B',  minor: 'G#m', color: '#52c7a5', keySignature: '5♯' },
  { chord: 'F#', major: 'F#', minor: 'D#m', color: '#4aa8d8', keySignature: '6♯' },
  { chord: 'C#', major: 'C#', minor: 'A#m', color: '#6b7cff', keySignature: '7♯' },
  { chord: 'Ab', major: 'Ab', minor: 'Fm',  color: '#a56bff', keySignature: '4♭' },
  { chord: 'Eb', major: 'Eb', minor: 'Cm',  color: '#d66bff', keySignature: '3♭' },
  { chord: 'Bb', major: 'Bb', minor: 'Gm',  color: '#ff6bd0', keySignature: '2♭' },
  { chord: 'F',  major: 'F',  minor: 'Dm',  color: '#ff6b96', keySignature: '1♭' },
];