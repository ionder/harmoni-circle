import type { FC } from 'react';
import { useState } from 'react';
import type { ModeName } from '../../engine/theory/modeEngine';
import { generateAIProgression, type AIVibe } from '../../engine/theory/aiProgressionEngine';
import { getDegreeForChord } from '../../engine/theory/degreeEngine';

interface AISuggestionsPanelProps {
  keyRoot: string;
  mode: ModeName;
  currentProgression: string[];
  onReplaceProgression: (chords: string[]) => void;
  onAppendProgression: (chords: string[]) => void;
}

export const AISuggestionsPanel: FC<AISuggestionsPanelProps> = ({
  keyRoot,
  mode,
  currentProgression,
  onReplaceProgression,
  onAppendProgression,
}) => {
  const [vibe, setVibe] = useState<AIVibe>('pop');
  const [length, setLength] = useState<number>(4);
  const [preview, setPreview] = useState<string[] | null>(null);

  const handleGenerate = () => {
    const chords = generateAIProgression(keyRoot, mode, vibe, length);
    setPreview(chords);
  };

  const handleReplace = () => {
    if (!preview) return;
    onReplaceProgression(preview);
  };

  const handleAppend = () => {
    if (!preview) return;
    onAppendProgression(preview);
  };

  return (
    <div className="ai-panel">
      <h3>AI Progression Assistant</h3>

      <div className="ai-controls">
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          Vibe
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value as AIVibe)}
          >
            <option value="pop">Pop / Modern</option>
            <option value="cinematic">Cinematic / Film</option>
            <option value="jazz">Jazz / ii–V–I</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          Length
          <select
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          >
            <option value={4}>4 chords</option>
            <option value={8}>8 chords</option>
          </select>
        </label>

        <button type="button" onClick={handleGenerate}>
          Generate Progression
        </button>
      </div>

      {preview ? (
        <>
          <div className="ai-preview">
            <h4>Suggested progression</h4>
            <ol className="ai-chord-list">
              {preview.map((chord, index) => (
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
          Key: <strong>{keyRoot}</strong>, Mode/Makam: <strong>{mode}</strong> için bir vibe seç
          ve &quot;Generate&quot; de. AI senin için bir progression önerisi üretsin.
        </p>
      )}

      {currentProgression.length > 0 && (
        <p className="ai-note">
          Not: Şu anki progression&apos;da {currentProgression.length} akor var. İstersen
          &quot;append&quot; ile sonuna ekleyebilir, &quot;replace&quot; ile tamamen
          değiştirebilirsin.
        </p>
      )}
    </div>
  );
};