import * as Tone from 'tone';
import type { Inversion } from '../theory/inversionTypes';
import type { SoundPreset } from './soundTypes';

let initialized = false;

// Ortak reverb (hafif, atmosferik)
const reverb = new Tone.Reverb({
  decay: 4,
  preDelay: 0.05,
  wet: 0.25,
}).toDestination();

// Her preset için ayrı channel → volume / renk kontrolü
const pianoChannel = new Tone.Channel({ volume: -4 }).connect(reverb);
const padChannel = new Tone.Channel({ volume: -8 }).connect(reverb);
const stringsChannel = new Tone.Channel({ volume: -10 }).connect(reverb);

// Piano: daha sıcak, kısa release
const pianoSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'triangle' },
  envelope: {
    attack: 0.005,
    decay: 0.2,
    sustain: 0.8,
    release: 0.7,
  },
}).connect(pianoChannel);

// Pad: sine tabanlı, yavaş attack, uzun release
const padSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'sine' },
  envelope: {
    attack: 0.6,
    decay: 0.4,
    sustain: 0.9,
    release: 3.5,
  },
}).connect(padChannel);

// Strings: yumuşak triangle, nispeten hızlı attack ama uzun release
const stringsSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'triangle' },
  envelope: {
    attack: 0.25,
    decay: 0.5,
    sustain: 0.85,
    release: 4.0,
  },
}).connect(stringsChannel);

export const SoundEngine = {
  async init() {
    if (initialized) return;
    await Tone.start();
    initialized = true;
    console.log('SoundEngine initialized');
  },

  getSynth(preset: SoundPreset) {
    switch (preset) {
      case 'pad':
        return padSynth;
      case 'strings':
        return stringsSynth;
      case 'piano':
      default:
        return pianoSynth;
    }
  },

  // Circle'a tıklayınca tek akor çalmak için
  async playChord(
    notes: string[],
    inversion: Inversion = 'root',
    durationMs: number = 1000,
    preset: SoundPreset = 'piano',
  ) {
    await this.init();

    let voiced: string[];

    const n = notes.length;

    switch (inversion) {
      case 'first':
        if (n >= 3) {
          voiced = [`${notes[1]}4`, `${notes[2]}4`, `${notes[0]}5`];
        } else {
          voiced = notes.map((n) => `${n}4`);
        }
        break;
      case 'second':
        if (n >= 3) {
          voiced = [`${notes[2]}3`, `${notes[0]}4`, `${notes[1]}4`];
        } else {
          voiced = notes.map((n) => `${n}4`);
        }
        break;
      case 'root':
      default:
        voiced = notes.map((n) => `${n}4`);
        break;
    }

    const synth = this.getSynth(preset);
    console.log('Playing chord:', voiced, 'inversion:', inversion, 'preset:', preset);
    synth.triggerAttackRelease(voiced, '2n');
    await new Promise((resolve) => setTimeout(resolve, durationMs));
  },

  // Progression & voice leading için hazır voicing
  async playVoiced(
    notesWithOctaves: string[],
    durationMs: number = 1000,
    preset: SoundPreset = 'piano',
  ) {
    await this.init();
    const synth = this.getSynth(preset);
    console.log('Playing voiced chord:', notesWithOctaves, 'preset:', preset);
    synth.triggerAttackRelease(notesWithOctaves, '2n');
    await new Promise((resolve) => setTimeout(resolve, durationMs));
  },
};