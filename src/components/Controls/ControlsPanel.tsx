import type { FC } from 'react';
import type { ModeName, isMakamMode } from '../../engine/theory/modeEngine';
import type { Inversion } from '../../engine/theory/inversionTypes';
import type { ChordTexture } from '../../engine/theory/chordUtils';
import type { VoicingStyle } from '../../engine/theory/voicingTypes';
import type { SoundPreset } from '../../engine/sound/soundTypes';

type InstrumentType = 'piano' | 'guitar';

interface ControlsPanelProps {
  mode: ModeName;
  onModeChange: (mode: ModeName) => void;
  keyRoot: string;
  onKeyRootChange: (root: string) => void;
  inversion: Inversion;
  onInversionChange: (inv: Inversion) => void;
  chordTexture: ChordTexture;
  onChordTextureChange: (texture: ChordTexture) => void;
  instrument: InstrumentType;
  onInstrumentChange: (inst: InstrumentType) => void;
  voicingStyle: VoicingStyle;
  onVoicingStyleChange: (style: VoicingStyle) => void;
  soundPreset: SoundPreset;
  onSoundPresetChange: (preset: SoundPreset) => void;
}

const KEY_OPTIONS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'Ab', 'Eb', 'Bb', 'F'];

export const ControlsPanel: FC<ControlsPanelProps> = ({
  mode,
  onModeChange,
  keyRoot,
  onKeyRootChange,
  inversion,
  onInversionChange,
  chordTexture,
  onChordTextureChange,
  instrument,
  onInstrumentChange,
  voicingStyle,
  onVoicingStyleChange,
  soundPreset,
  onSoundPresetChange,
}) => {
  return (
    <div className="controls-panel">
      <h3>Controls</h3>

      {/* Instrument */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        Instrument
        <select
          value={instrument}
          onChange={(e) => onInstrumentChange(e.target.value as InstrumentType)}
        >
          <option value="piano">Piano</option>
          <option value="guitar">Guitar (view)</option>
        </select>
      </label>

      {/* Sound preset */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        Sound
        <select
          value={soundPreset}
          onChange={(e) => onSoundPresetChange(e.target.value as SoundPreset)}
        >
          <option value="piano">Piano</option>
          <option value="pad">Synth Pad</option>
          <option value="strings">Strings</option>
        </select>
      </label>

      {/* Key / Tonalite */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        Key / Tonalite
        <select
          value={keyRoot}
          onChange={(e) => onKeyRootChange(e.target.value)}
        >
          {KEY_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </label>

      {/* Mode + Makamlar */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        Mode / Makam
        <select
          value={mode}
          onChange={(e) => onModeChange(e.target.value as ModeName)}
        >
          <optgroup label="Western Modes">
            <option value="ionian">Ionian (Major)</option>
            <option value="dorian">Dorian</option>
            <option value="phrygian">Phrygian</option>
            <option value="lydian">Lydian</option>
            <option value="mixolydian">Mixolydian</option>
            <option value="aeolian">Aeolian (Natural Minor)</option>
            <option value="locrian">Locrian</option>
          </optgroup>
          <optgroup label="Türk Makamları (12-TET)">
            <option value="makam_hicaz">Hicaz (12-TET)</option>
            <option value="makam_kurdi">Kürdi (12-TET)</option>
            <option value="makam_huseyni">Hüseynî (12-TET)</option>
            <option value="makam_ussak">Uşşak (12-TET)</option>
          </optgroup>
        </select>
      </label>

      {/* Inversion */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        Inversion (single chord)
        <select
          value={inversion}
          onChange={(e) => onInversionChange(e.target.value as Inversion)}
        >
          <option value="root">Root Position</option>
          <option value="first">1st Inversion</option>
          <option value="second">2nd Inversion</option>
        </select>
      </label>

      {/* Chord texture */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        Chord Type
        <select
          value={chordTexture}
          onChange={(e) => onChordTextureChange(e.target.value as ChordTexture)}
        >
          <option value="triad">Triad (3-note)</option>
          <option value="seventh">7th Chord (4-note)</option>
          <option value="extended">Extended (9/11/13)</option>
        </select>
      </label>

      {/* Voicing style (sadece progression playback için) */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        Voicing Style (progression)
        <select
          value={voicingStyle}
          onChange={(e) => onVoicingStyleChange(e.target.value as VoicingStyle)}
        >
          <option value="smooth">Smooth (close)</option>
          <option value="wide">Wide</option>
          <option value="shell">Shell (1–3–7)</option>
        </select>
      </label>

      <p style={{ marginTop: 8, fontSize: 12 }}>
        Western modlarda klasik armoni akorları, makam modlarında ise 12-TET yaklaşım ile diziler ve
        onlara göre üretilmiş akorlar duyarsın. Power Notes alanında makam seçiliyse Karar / Güçlü /
        Yeden gösterilir.
      </p>
    </div>
  );
};