// src/components/Secondary/BorrowedChordsPanel.tsx
import type { FC } from 'react';
import type { ModeName } from '../../engine/theory/modeEngine';
import { getBorrowedChords } from '../../engine/theory/borrowedChords';

interface BorrowedChordsPanelProps {
  keyRoot: string;
  mode: ModeName;
  onAddChord: (chordRoot: string) => void;
}

export const BorrowedChordsPanel: FC<BorrowedChordsPanelProps> = ({
  keyRoot,
  mode,
  onAddChord,
}) => {
  const suggestions = getBorrowedChords(keyRoot, mode);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="progression-panel" style={{ marginTop: 16 }}>
      <h3>Borrowed Chords (Modal Interchange)</h3>
      <p style={{ fontSize: 12, opacity: 0.8 }}>
        Paralel minörden ödünç alınmış tipik akorlar. Tıklayınca progression&apos;a eklenir.
      </p>

      <div className="progression-controls">
        {suggestions.map((bc) => (
          <button
            key={bc.label}
            type="button"
            onClick={() => onAddChord(bc.chordRoot)}
          >
            {bc.label} → {bc.chordRoot}
          </button>
        ))}
      </div>
    </div>
  );
};