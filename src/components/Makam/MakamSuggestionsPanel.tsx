import type { FC } from 'react';
import { useState } from 'react';
import type { ModeName } from '../../engine/theory/modeEngine';
import { isMakamMode } from '../../engine/theory/modeEngine';
import {
  getMakamTemplatesForMode,
  getMakamModulationsForMode,
  realizeMakamPattern,
  type MakamTemplate,
  type MakamModulation,
} from '../../engine/theory/makamProgressionEngine';
import { getDegreeForChord } from '../../engine/theory/degreeEngine';

interface MakamSuggestionsPanelProps {
  keyRoot: string;
  mode: ModeName;
  currentProgression: string[];
  onReplaceProgression: (chords: string[]) => void;
  onAppendProgression: (chords: string[]) => void;
}

type MakamView = 'seyir' | 'gecki';

const MAKAM_LABELS: Partial<Record<ModeName, string>> = {
  makam_hicaz: 'Hicaz',
  makam_kurdi: 'Kürdi',
  makam_huseyni: 'Hüseynî',
  makam_ussak: 'Uşşak',
};

export const MakamSuggestionsPanel: FC<MakamSuggestionsPanelProps> = ({
  keyRoot,
  mode,
  currentProgression,
  onReplaceProgression,
  onAppendProgression,
}) => {
  const [view, setView] = useState<MakamView>('seyir');

  if (!isMakamMode(mode)) {
    return (
      <div className="ai-panel">
        <h3>Makam Progressions</h3>
        <p className="ai-empty">
          Makam önerilerini kullanmak için önce <strong>Mode / Makam</strong> menüsünden Hicaz,
          Kürdi, Hüseynî veya Uşşak gibi bir makam seç.
        </p>
      </div>
    );
  }

  const makamLabel = MAKAM_LABELS[mode] ?? mode;
  const templates = getMakamTemplatesForMode(mode);
  const modulations = getMakamModulationsForMode(mode);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates[0]?.id ?? '',
  );
  const [selectedModId, setSelectedModId] = useState<string>(
    modulations[0]?.id ?? '',
  );

  const activeTemplate: MakamTemplate | undefined = templates.find(
    (t) => t.id === selectedTemplateId,
  );
  const activeMod: MakamModulation | undefined = modulations.find(
    (m) => m.id === selectedModId,
  );

  const seyirChords =
    view === 'seyir' && activeTemplate
      ? realizeMakamPattern(keyRoot, mode, activeTemplate.degrees)
      : [];
  const gecekiChords =
    view === 'gecki' && activeMod
      ? realizeMakamPattern(keyRoot, mode, activeMod.degrees)
      : [];

  const chords = view === 'seyir' ? seyirChords : gecekiChords;

  const handleReplace = () => {
    if (chords.length === 0) return;
    onReplaceProgression(chords);
  };

  const handleAppend = () => {
    if (chords.length === 0) return;
    onAppendProgression(chords);
  };

  return (
    <div className="ai-panel">
      <h3>Makam Progressions</h3>
      <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
        Key: <strong>{keyRoot}</strong> • Makam: <strong>{makamLabel}</strong>
      </p>

      <div className="ai-controls" style={{ marginBottom: 8 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          Görünüm
          <select
            value={view}
            onChange={(e) => setView(e.target.value as MakamView)}
          >
            <option value="seyir">Seyir Template&apos;leri</option>
            <option value="gecki">Geçki (Modulation) Önerileri</option>
          </select>
        </label>

        {view === 'seyir' ? (
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            Seyir
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            Geçki
            <select
              value={selectedModId}
              onChange={(e) => setSelectedModId(e.target.value)}
            >
              {modulations.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {view === 'seyir' && activeTemplate && (
        <p className="ai-note" style={{ marginBottom: 8 }}>
          {activeTemplate.description}
        </p>
      )}

      {view === 'gecki' && activeMod && (
        <p className="ai-note" style={{ marginBottom: 8 }}>
          {activeMod.description}{' '}
          <br />
          <span style={{ fontSize: 11, opacity: 0.7 }}>
            Hedef makam: <strong>{MAKAM_LABELS[activeMod.to] ?? activeMod.to}</strong>{' '}
            — geçkiyi kullandıktan sonra Mode / Makam menüsünden bu makama manuel geçebilirsin.
          </span>
        </p>
      )}

      {chords.length > 0 ? (
        <>
          <div className="ai-preview">
            <h4>Önerilen yürüyüş</h4>
            <ol className="ai-chord-list">
              {chords.map((chord, index) => (
                <li key={`${chord}-${index}`} className="ai-chord-item">
                  <span className="ai-chord-root">{chord}</span>
                  <span className="ai-chord-degree">
                    ({getDegreeForChord(keyRoot, mode, chord)})
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="ai-actions">
            <button type="button" onClick={handleReplace}>
              Replace current progression
            </button>
            <button type="button" onClick={handleAppend}>
              Append to current progression
            </button>
          </div>
        </>
      ) : (
        <p className="ai-empty">
          Bu makam için tanımlı {view === 'seyir' ? 'seyir' : 'geçki'} template’i
          bulunamadı.
        </p>
      )}

      {currentProgression.length > 0 && (
        <p className="ai-note">
          Not: Şu anki progression&apos;da {currentProgression.length} akor var. Replace ile
          tamamen değiştirebilir veya Append ile sonuna ekleyebilirsin.
        </p>
      )}
    </div>
  );
};