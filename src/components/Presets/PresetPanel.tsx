import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { ModeName } from '../../engine/theory/modeEngine';
import type { ChordTexture } from '../../engine/theory/chordUtils';
import type { VoicingStyle } from '../../engine/theory/voicingTypes';
import type { SoundPreset } from '../../engine/sound/soundTypes';
import {
  loadPresets,
  savePresets,
  createPreset,
  deletePreset,
  type HarmoniPreset,
  type HarmoniPresetData,
} from '../../engine/presets/presetStorage';

type InstrumentType = 'piano' | 'guitar';

interface PresetPanelProps {
  keyRoot: string;
  mode: ModeName;
  chordTexture: ChordTexture;
  voicingStyle: VoicingStyle;
  soundPreset: SoundPreset;
  instrument: InstrumentType;
  progression: string[];
  onApplyPreset: (data: HarmoniPresetData) => void;
}

export const PresetPanel: FC<PresetPanelProps> = ({
  keyRoot,
  mode,
  chordTexture,
  voicingStyle,
  soundPreset,
  instrument,
  progression,
  onApplyPreset,
}) => {
  const [presets, setPresets] = useState<HarmoniPreset[]>([]);
  const [presetName, setPresetName] = useState<string>('');

  useEffect(() => {
    const stored = loadPresets();
    setPresets(stored);
  }, []);

  const handleSave = () => {
    const name =
      presetName.trim() ||
      `Preset ${presets.length + 1} – ${keyRoot} ${mode}`;

    const data: HarmoniPresetData = {
      keyRoot,
      mode,
      chordTexture,
      voicingStyle,
      soundPreset,
      instrument,
      progression,
    };

    const nextPreset = createPreset(name, data);
    const nextPresets = [...presets, nextPreset];
    setPresets(nextPresets);
    savePresets(nextPresets);
    setPresetName('');
  };

  const handleDelete = (id: string) => {
    const next = deletePreset(id);
    setPresets(next);
  };

  const handleLoad = (preset: HarmoniPreset) => {
    onApplyPreset(preset.data);
  };

  return (
    <div className="preset-panel">
      <div className="preset-header">
        <h3>Presets</h3>
        <span className="preset-count">
          {presets.length} saved
        </span>
      </div>

      <div className="preset-save-row">
        <input
          type="text"
          placeholder="Preset name (optional)"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSave}
        >
          Save current
        </button>
      </div>

      {presets.length === 0 ? (
        <p className="preset-empty">
          Henüz preset yok. Key, mode/makam, voicing, sound ve progression&apos;ı ayarlayıp
          &quot;Save current&quot; ile kaydedebilirsin.
        </p>
      ) : (
        <ul className="preset-list">
          {presets
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((preset) => (
              <li key={preset.id} className="preset-item">
                <div className="preset-main">
                  <div className="preset-name">{preset.name}</div>
                  <div className="preset-meta">
                    {preset.data.keyRoot} • {preset.data.mode} •{' '}
                    {preset.data.chordTexture} • {preset.data.voicingStyle} •{' '}
                    {preset.data.soundPreset} • {preset.data.instrument}{' '}
                    ({preset.data.progression.length} chords)
                  </div>
                </div>
                <div className="preset-actions">
                  <button
                    type="button"
                    onClick={() => handleLoad(preset)}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(preset.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};