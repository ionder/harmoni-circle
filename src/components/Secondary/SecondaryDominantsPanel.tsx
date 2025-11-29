// src/components/Secondary/SecondaryDominantsPanel.tsx
import type { FC } from 'react';
import type { ModeName } from '../../engine/theory/modeEngine';
import { getSecondaryDominants } from '../../engine/theory/secondaryDominants';

interface SecondaryDominantsPanelProps {
  keyRoot: string;
  mode: ModeName;
  onAddChord: (chordRoot: string) => void;
}

export const SecondaryDominantsPanel: FC<SecondaryDominantsPanelProps> = ({
  keyRoot,
  mode,
  onAddChord,
}) => {
  const suggestions = getSecondaryDominants(keyRoot, mode);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="progression-panel" style={{ marginTop: 16 }}>
      <h3>Secondary Dominants</h3>
      <p style={{ fontSize: 12, opacity: 0.8 }}>
        Tonaliteye göre önerilen ikincil dominantlar. Tıklayınca progression&apos;a eklenir.
      </p>

      <div className="progression-controls">
        {suggestions.map((sd) => (
          <button
            key={sd.label}
            type="button"
            onClick={() => onAddChord(sd.chordRoot)}
          >
            {sd.label} → {sd.chordRoot}
          </button>
        ))}
      </div>
    </div>
  );
};