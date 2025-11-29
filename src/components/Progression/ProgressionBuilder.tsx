import type { FC } from 'react';
import { useState } from 'react';
import { getChordNotes, type ChordTexture } from '../../engine/theory/chordUtils';
import { SoundEngine } from '../../engine/sound/SoundEngine';
import type { ModeName } from '../../engine/theory/modeEngine';
import type { Inversion } from '../../engine/theory/inversionTypes';
import { getDegreeForChord } from '../../engine/theory/degreeEngine';
import { getVoiceLedVoicing } from '../../engine/theory/voiceLeadingEngine';
import type { VoicingStyle } from '../../engine/theory/voicingTypes';
import type { SoundPreset } from '../../engine/sound/soundTypes';
// @ts-ignore
import * as MidiWriter from 'midi-writer-js';

interface ProgressionBuilderProps {
  progression: string[];
  onChange: (chords: string[]) => void;
  selectedChord: string;
  mode: ModeName;
  inversion: Inversion;
  keyRoot: string;
  texture: ChordTexture;
  voicingStyle: VoicingStyle;
  soundPreset: SoundPreset;
}

export const ProgressionBuilder: FC<ProgressionBuilderProps> = ({
  progression,
  onChange,
  selectedChord,
  mode,
  inversion,
  keyRoot,
  texture,
  voicingStyle,
  soundPreset,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddSelected = () => {
    if (!selectedChord) return;
    onChange([...progression, selectedChord]);
  };

  const handleRemoveIndex = (index: number) => {
    const next = progression.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleClear = () => {
    onChange([]);
  };

  const handlePlay = async () => {
    if (progression.length === 0) return;
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      let prevVoicing: string[] | null = null;

      for (const root of progression) {
        const chordPitchClasses = getChordNotes(root, mode, texture);
        const voiced = getVoiceLedVoicing(prevVoicing, chordPitchClasses, voicingStyle);
        await SoundEngine.playVoiced(voiced, 900, soundPreset);
        prevVoicing = voiced;
      }
    } finally {
      setIsPlaying(false);
    }
  };

  const handleExportMidi = () => {
    if (progression.length === 0) return;

    let prevVoicing: string[] | null = null;
    const chordVoicings: string[][] = [];

    for (const root of progression) {
      const chordPitchClasses = getChordNotes(root, mode, texture);
      const voiced = getVoiceLedVoicing(prevVoicing, chordPitchClasses, voicingStyle);
      chordVoicings.push(voiced);
      prevVoicing = voiced;
    }

    const track = new (MidiWriter as any).Track();
    track.setTempo(90);

    const events: any[] = [];

    chordVoicings.forEach((voicing) => {
      events.push(
        new (MidiWriter as any).NoteEvent({
          pitch: voicing,
          duration: '2',
        }),
      );
    });

    track.addEvent(events);

    const write = new (MidiWriter as any).Writer(track);
    const bytes = write.buildFile();

    const blob = new Blob([bytes], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'harmoni-progression.mid';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="progression-panel">
      <h3>Chord Progression Builder</h3>

      <div className="progression-controls">
        <button type="button" onClick={handleAddSelected}>
          Add Selected Chord ({selectedChord})
        </button>
        <button
          type="button"
          onClick={handlePlay}
          disabled={isPlaying || progression.length === 0}
        >
          {isPlaying ? 'Playing…' : 'Play Progression'}
        </button>
        <button
          type="button"
          onClick={handleExportMidi}
          disabled={progression.length === 0}
        >
          Export MIDI
        </button>
        <button type="button" onClick={handleClear} disabled={progression.length === 0}>
          Clear
        </button>
      </div>

      {progression.length === 0 ? (
        <p className="progression-empty">
          Henüz progression yok. Daireden bir akor seç ve &quot;Add Selected Chord&quot; ile ekle.
        </p>
      ) : (
        <ol className="progression-list">
          {progression.map((chord, index) => (
            <li key={`${chord}-${index}`} className="progression-item">
              <span className="progression-index">{index + 1}.</span>
              <span className="progression-chord">
                {chord} ({getDegreeForChord(keyRoot, mode, chord)})
              </span>
              <button
                type="button"
                className="progression-remove"
                onClick={() => handleRemoveIndex(index)}
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};