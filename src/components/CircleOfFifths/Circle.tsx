import type { FC } from 'react';
import { Slice } from './Slice';
import { CIRCLE_MAP } from '../../data/chords/chordDefinitions';

export interface CircleProps {
  selectedChord: string;
  onChordSelect: (chord: string) => void;
  diatonicChords: string[];
  powerNotes: string[]; // root / 3 / 5 (veya mode triadı)
}

export const Circle: FC<CircleProps> = ({
  selectedChord,
  onChordSelect,
  diatonicChords,
  powerNotes,
}) => {
  return (
    <svg viewBox="0 0 400 400" width={400} height={400}>
      {/* Dilimler */}
      {CIRCLE_MAP.map((slice, i) => (
        <Slice
          key={i}
          data={slice}
          index={i}
          isSelected={selectedChord === slice.chord}
          isDiatonic={diatonicChords.includes(slice.chord)}
          onClick={() => onChordSelect(slice.chord)}
        />
      ))}

      {/* Power Notes iç dairesi */}
      <circle
        cx={200}
        cy={200}
        r={80}
        fill="#050505"
        stroke="#303030"
        strokeWidth={1.5}
      />

      <text
        x={200}
        y={185}
        textAnchor="middle"
        fill="#888888"
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}
      >
        Power Notes
      </text>

      <text
        x={200}
        y={205}
        textAnchor="middle"
        fill="#ffffff"
        style={{ fontSize: '18px', fontWeight: 600 }}
      >
        {powerNotes.join('  ')}
      </text>

      <text
        x={200}
        y={225}
        textAnchor="middle"
        fill="#aaaaaa"
        style={{ fontSize: '11px', opacity: 0.85 }}
      >
        {selectedChord}
      </text>
    </svg>
  );
};