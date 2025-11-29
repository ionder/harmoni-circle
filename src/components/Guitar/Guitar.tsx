import type { FC } from 'react';

// 6 tel – standart akort: EADGBE
// Burada en üst satır 1. tel (ince E), en alttaki satır 6. tel (kalın E)
const STRING_TUNING = ['E', 'B', 'G', 'D', 'A', 'E']; // 1 → 6

const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getPitchClass(openString: string, fret: number): string {
  const idx = NOTE_ORDER.indexOf(openString);
  if (idx === -1) return openString;
  const pc = NOTE_ORDER[(idx + fret) % NOTE_ORDER.length];
  return pc;
}

interface GuitarProps {
  activeNotes: string[]; // ['C','E','G','Bb'] gibi pitch class listesi
}

export const Guitar: FC<GuitarProps> = ({ activeNotes }) => {
  const frets = Array.from({ length: 13 }, (_, i) => i); // 0–12

  return (
    <div className="guitar-container">
      <div className="guitar-label-row">
        <span className="guitar-label">Guitar view (0–12 frets)</span>
      </div>
      <div className="guitar-fretboard">
        {STRING_TUNING.map((open, stringIndex) => (
          <div key={stringIndex} className="guitar-string-row">
            {frets.map((fret) => {
              const pitch = getPitchClass(open, fret);
              const isActive = activeNotes.includes(pitch);
              return (
                <div
                  key={fret}
                  className={
                    'guitar-fret' +
                    (fret === 0 ? ' nut' : '') +
                    (isActive ? ' active' : '')
                  }
                >
                  {fret === 0 ? open : ''}
                </div>
              );
            })}
          </div>
        ))}
        {/* Fret numaraları en altta */}
        <div className="guitar-fret-numbers">
          {frets.map((fret) => (
            <span key={fret} className="guitar-fret-number">
              {fret}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};