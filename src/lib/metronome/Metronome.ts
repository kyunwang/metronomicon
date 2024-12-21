const CLICK_DURATION = 0.03;

interface TimeSignature {
	beats: number;
	division: number;
}

export interface MetronomeSettings {
	bpm: number;
	subdivisions: number;
	timeSignature: TimeSignature;
	sound: 'oscillator' | 'sample';
	shouldAccentSubdivision: boolean;
	accentPattern: number[];
}

interface Sound {
	play(time: number, frequency: number, volume: number): void;
}

class OscillatorSound implements Sound {
	private audioContext: AudioContext;

	constructor(audioContext: AudioContext) {
		this.audioContext = audioContext;
	}

	play(time: number, frequency: number, volume: number): void {
		const osc = this.audioContext.createOscillator();
		const envelope = this.audioContext.createGain();

		envelope.gain.value = volume;
		envelope.gain.exponentialRampToValueAtTime(volume, time + 0.001);
		envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

		osc.connect(envelope);
		envelope.connect(this.audioContext.destination);

		osc.frequency.value = frequency;
		osc.start(time);
		osc.stop(time + CLICK_DURATION);
	}
}

class SampleSound implements Sound {}

type PlayModeFunction = (
	beatInMeasure: number,
	time: number,
	metronome: Metronome
) => void;

// Create Play Mode functions
const createSubdivisionMode =
	(metronome: Metronome): PlayModeFunction =>
	(beatInMeasure: number, time: number) => {
		const shouldAccent =
			metronome.settings.shouldAccentSubdivision &&
			beatInMeasure % metronome.settings.subdivisions === 0;
		const frequency = shouldAccent ? 1000 : 800;
		const volume =
			metronome.settings.accentPattern[
				Math.floor(beatInMeasure / metronome.settings.subdivisions) %
					metronome.settings.accentPattern.length
			] / 3;
		metronome.sound.play(time, frequency, volume);
	};

const createSimpleMode =
	(metronome: Metronome): PlayModeFunction =>
	(beatInMeasure: number, time: number) => {
		const frequency = beatInMeasure === 0 ? 1000 : 800;
		const volume =
			metronome.settings.accentPattern[
				beatInMeasure % metronome.settings.accentPattern.length
			] / 3;
		metronome.sound.play(time, frequency, volume);
	};

class Metronome {
	public audioContext: AudioContext;
	public settings: MetronomeSettings;
	private intervalWorker: Worker | null = null;
	public sound: Sound;
	public playMode: PlayModeFunction;

	public shouldAccentSubdivision = false;

	private intervalLookAhead = 25; // Scheduling call frequency (ms) interval timer. Theoretically enabling 2400bpm
	private scheduleAheadTime = 0.1; // How far ahead to schedule (seconds)

	private nextNoteTime = 0.0;
	private currentBeatInMeasure = 0; // Current beat in the current bar

	private isRunning = false;

	constructor(
		audioContext: AudioContext,
		initialSettings: Partial<MetronomeSettings>
	) {
		if (audioContext === undefined) {
			throw new Error('Audio context not provided');
		}

		this.audioContext = audioContext;
		this.settings = {
			bpm: 90,
			subdivisions: 1,
			shouldAccentSubdivision: false,
			timeSignature: {
				beats: 4,
				division: 4,
			},
			sound: 'oscillator',
			accentPattern: [3, 1, 1, 1],
			...initialSettings,
		};
		this.sound = new OscillatorSound(this.audioContext);
		this.playMode = createSimpleMode(this);

		this.init();
	}

	public set bpm(bpm: number) {
		if (bpm <= 0) {
			throw new Error('BPM cannot be negative or 0');
		}
		// this.stop();
		// this.nextNoteTime = this.audioContext?.currentTime + 0.05;
		// this.currentBeatInMeasure = 0;
		this.settings.bpm = bpm;
	}

	public get bpm(): number {
		return this.settings.bpm;
	}

	public set soundType(soundType: 'oscillator' | 'sample') {
		this.settings.sound = soundType;
		if (soundType === 'oscillator') {
			this.sound = new OscillatorSound(this.audioContext);
		}
	}

	public get soundType() {
		return this.settings.sound;
	}

	public updateSettings(newSettings: Partial<MetronomeSettings>) {
		// Object.assign(this.settings, newSettings);
		this.settings = { ...this.settings, ...newSettings };

		if (newSettings.sound) {
			if (newSettings.sound === 'oscillator') {
				this.sound = new OscillatorSound(this.audioContext);
			}
			// TODO: Sample
		}

		if (newSettings.subdivisions) {
			this.currentBeatInMeasure = 0;
		}
	}

	private setNextBeatTime = () => {
		this.nextNoteTime +=
			(1 / this.settings.subdivisions) * (60.0 / this.settings.bpm);
		this.currentBeatInMeasure++;

		if (
			this.currentBeatInMeasure ===
			this.settings.timeSignature.beats * this.settings.subdivisions
		) {
			this.currentBeatInMeasure = 0;
		}
	};

	public setMode(mode: 'simple' | 'subdivision') {
		if (mode === 'simple') {
			this.playMode = createSimpleMode(this);
		} else {
			this.playMode = createSubdivisionMode(this);
		}
	}

	// Schedule a note to be played at a specific time in the future
	// Based on audiocontext current time
	private scheduleBeat = (beatInMeasure: number, time: number) => {
		this.playMode(beatInMeasure, time, this);
	};

	private scheduler = () => {
		while (
			this.nextNoteTime <
			this.audioContext.currentTime + this.scheduleAheadTime
		) {
			this.scheduleBeat(this.currentBeatInMeasure, this.nextNoteTime);
			this.setNextBeatTime();
		}
	};

	private init = () => {
		this.intervalWorker = new Worker(
			new URL('./workers/intervalWorker.ts', import.meta.url)
		);

		this.intervalWorker.onmessage = (e) => {
			if (e.data === 'tick') {
				this.scheduler();
			} else {
				console.log(e.data);
			}
		};

		this.intervalWorker?.postMessage({
			command: 'setInterval',
			interval: this.intervalLookAhead,
		});
	};

	public start = () => {
		if (this.isRunning) return;

		this.isRunning = true;
		this.nextNoteTime = this.audioContext?.currentTime + 0.05;

		this.intervalWorker?.postMessage({ command: 'start' });
	};

	public stop = () => {
		this.isRunning = false;
		this.currentBeatInMeasure = 0;
		this.intervalWorker?.postMessage({ command: 'stop' });
	};

	public close = () => {
		this.stop();
		this.audioContext?.close();
		this.intervalWorker?.terminate();
	};
}

export default Metronome;

// Warp in a singleton for a shared SharedWorker
