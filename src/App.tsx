import { useState, type FC } from 'react';
import { Circle } from './components/CircleOfFifths/Circle';
import { Piano } from './components/Piano/Piano';
import { Guitar } from './components/Guitar/Guitar';
import { SoundEngine } from './engine/sound/SoundEngine';
import { getChordNotes, type ChordTexture } from './engine/theory/chordUtils';
import { ControlsPanel } from './components/Controls/ControlsPanel';
import {
  getDiatonicChordRoots,
  getMakamPowerNotes,
  isMakamMode,
  type ModeName,
} from './engine/theory/modeEngine';
import type { Inversion } from './engine/theory/inversionTypes';
import { ProgressionBuilder } from './components/Progression/ProgressionBuilder';
import { SecondaryDominantsPanel } from './components/Secondary/SecondaryDominantsPanel';
import { BorrowedChordsPanel } from './components/Secondary/BorrowedChordsPanel';
import { AISuggestionsPanel } from './components/AI/AISuggestionsPanel';
import { MakamSuggestionsPanel } from './components/Makam/MakamSuggestionsPanel';
import { PresetPanel } from './components/Presets/PresetPanel';
import type { VoicingStyle } from './engine/theory/voicingTypes';
import type { SoundPreset } from './engine/sound/soundTypes';
import type { HarmoniPresetData } from './engine/presets/presetStorage';

type SuggestionsTab = 'secondary' | 'borrowed' | 'ai' | 'makam';
type InstrumentType = 'piano' | 'guitar';

const App: FC = () => {
  const [selectedChord, setSelectedChord] = useState<string>('C');

  // Tonalite & mode / makam
  const [keyRoot, setKeyRoot] = useState<string>('C');
  const [mode, setMode] = useState<ModeName>('ionian');

  // Inversion (tek tek akor çalarken)
  const [inversion, setInversion] = useState<Inversion>('root');

  // Chord texture: triad / seventh / extended
  const [texture, setTexture] = useState<ChordTexture>('triad');

  // Instrument: Piano / Guitar view
  const [instrument, setInstrument] = useState<InstrumentType>('piano');

  // Voicing style (progression playback & MIDI export)
  const [voicingStyle, setVoicingStyle] = useState<VoicingStyle>('smooth');

  // Sound preset
  const [soundPreset, setSoundPreset] = useState<SoundPreset>('piano');

  // Progression
  const [progression, setProgression] = useState<string[]>([]);

  // Öneri sekmesi (Secondary / Borrowed / AI / Makam)
  const [suggestionsTab, setSuggestionsTab] = useState<SuggestionsTab>('secondary');

  // Seçili akorun notaları (harmoni tarafı için)
  const fullChordNotes = getChordNotes(selectedChord, mode, texture);

  // Power Notes:
  // - Eğer makam seçiliyse: Karar / Güçlü / Yeden (keyRoot üzerinden)
  // - Değilse: akorun ilk 3–4 sesi
  let powerNotes: string[];
  if (isMakamMode(mode)) {
    powerNotes = getMakamPowerNotes(keyRoot, mode);
  } else {
    powerNotes =
      fullChordNotes.length > 4 ? fullChordNotes.slice(0, 4) : fullChordNotes;
  }

  // Tonalite + mode'a göre diatonik akor kökleri
  const diatonicChords = getDiatonicChordRoots(keyRoot, mode);

  const handleApplyPreset = (data: HarmoniPresetData) => {
    setKeyRoot(data.keyRoot);
    setMode(data.mode);
    setTexture(data.chordTexture);
    setVoicingStyle(data.voicingStyle);
    setSoundPreset(data.soundPreset);
    setInstrument(data.instrument);
    setProgression(data.progression);

    // Seçili akoru progression'in ilk akoruna ayarlayabiliriz (varsa)
    if (data.progression.length > 0) {
      setSelectedChord(data.progression[0]);
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>Harmoni Circle</h1>
          <p className="app-subtitle">
            Circle of Fifths • Modes & Makam • 7th & Extended • MIDI Export • Voicing Styles • AI • Presets
          </p>
        </div>
      </header>

      <main className="main-layout">
        {/* Sol taraf: Circle + Instrument view */}
        <section className="main-panel">
          <div className="circle-card">
            <Circle
              selectedChord={selectedChord}
              diatonicChords={diatonicChords}
              powerNotes={powerNotes}
              onChordSelect={(chord: string) => {
                setSelectedChord(chord);
                const chordNotes = getChordNotes(chord, mode, texture);
                SoundEngine.playChord(chordNotes, inversion, 1000, soundPreset);
              }}
            />
          </div>

          <div className="selected-chord-row">
            <span className="selected-label">Selected chord</span>
            <span className="selected-value">{selectedChord}</span>
          </div>

          {instrument === 'piano' ? (
            <Piano activeNotes={fullChordNotes} />
          ) : (
            <Guitar activeNotes={fullChordNotes} />
          )}
        </section>

        {/* Sağ taraf: Kontroller + Progression + Presets + Öneriler */}
        <aside className="side-panel">
          <ControlsPanel
            mode={mode}
            onModeChange={setMode}
            keyRoot={keyRoot}
            onKeyRootChange={setKeyRoot}
            inversion={inversion}
            onInversionChange={setInversion}
            chordTexture={texture}
            onChordTextureChange={setTexture}
            instrument={instrument}
            onInstrumentChange={setInstrument}
            voicingStyle={voicingStyle}
            onVoicingStyleChange={setVoicingStyle}
            soundPreset={soundPreset}
            onSoundPresetChange={setSoundPreset}
          />

          <ProgressionBuilder
            progression={progression}
            onChange={setProgression}
            selectedChord={selectedChord}
            mode={mode}
            inversion={inversion}
            keyRoot={keyRoot}
            texture={texture}
            voicingStyle={voicingStyle}
            soundPreset={soundPreset}
          />

          <PresetPanel
            keyRoot={keyRoot}
            mode={mode}
            chordTexture={texture}
            voicingStyle={voicingStyle}
            soundPreset={soundPreset}
            instrument={instrument}
            progression={progression}
            onApplyPreset={handleApplyPreset}
          />

          <div className="suggestions-container">
            <div className="suggestions-tabs">
              <button
                type="button"
                className={
                  suggestionsTab === 'secondary'
                    ? 'suggestion-tab active'
                    : 'suggestion-tab'
                }
                onClick={() => setSuggestionsTab('secondary')}
              >
                Secondary dominants
              </button>
              <button
                type="button"
                className={
                  suggestionsTab === 'borrowed'
                    ? 'suggestion-tab active'
                    : 'suggestion-tab'
                }
                onClick={() => setSuggestionsTab('borrowed')}
              >
                Borrowed chords
              </button>
              <button
                type="button"
                className={
                  suggestionsTab === 'ai' ? 'suggestion-tab active' : 'suggestion-tab'
                }
                onClick={() => setSuggestionsTab('ai')}
              >
                AI progressions
              </button>
              <button
                type="button"
                className={
                  suggestionsTab === 'makam'
                    ? 'suggestion-tab active'
                    : 'suggestion-tab'
                }
                onClick={() => setSuggestionsTab('makam')}
              >
                Makam
              </button>
            </div>

            {suggestionsTab === 'secondary' ? (
              <SecondaryDominantsPanel
                keyRoot={keyRoot}
                mode={mode}
                onAddChord={(root) => setProgression((prev) => [...prev, root])}
              />
            ) : suggestionsTab === 'borrowed' ? (
              <BorrowedChordsPanel
                keyRoot={keyRoot}
                mode={mode}
                onAddChord={(root) => setProgression((prev) => [...prev, root])}
              />
            ) : suggestionsTab === 'ai' ? (
              <AISuggestionsPanel
                keyRoot={keyRoot}
                mode={mode}
                currentProgression={progression}
                onReplaceProgression={setProgression}
                onAppendProgression={(chords) =>
                  setProgression((prev) => [...prev, ...chords])
                }
              />
            ) : (
              <MakamSuggestionsPanel
                keyRoot={keyRoot}
                mode={mode}
                currentProgression={progression}
                onReplaceProgression={setProgression}
                onAppendProgression={(chords) =>
                  setProgression((prev) => [...prev, ...chords])
                }
              />
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;