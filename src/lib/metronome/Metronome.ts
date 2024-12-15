const BEAT_COUNT = 4; // Number of beats per measure
const MEASURES = 4; // from time signature e.g. 3/4
const CLICK_DURATION = 0.03;

class Metronome {
	_audioContext: AudioContext | null = null;
	_bpm = 60; // Beats per minute
	_beatSpacing = 60.0 / this.bpm;
	_intervalWorker: Worker | null = null;
	subdivision = 1;
	shouldAccentSubdivision = false;

	_intervalLookAhead = 25; // Scheduling call frequency (ms) interval timer
	_scheduleAheadTime = 0.1; // How far ahead to schedule (seconds)

	nextNoteTime = 0.0;
	currentBeatInMeasure: number | null = 0; // Current beat in the current bar

	_isRunning = false;

	constructor(audioContext: AudioContext, bpm = this.bpm) {
		if (audioContext === undefined) {
			throw new Error('Audio context not provided');
		}

		this._audioContext = audioContext;
		this.bpm = bpm;

		this._init();
	}

	set bpm(bpm: number) {
		this._bpm = bpm;
		this._beatSpacing = 60.0 / bpm;
	}

	get bpm() {
		return this._bpm;
	}

	_setNextBeatTime = () => {
		this.nextNoteTime += (1 / this.subdivision) * this._beatSpacing;

		this.currentBeatInMeasure++;
		if (this.currentBeatInMeasure === BEAT_COUNT * this.subdivision) {
			this.currentBeatInMeasure = 0;
		}
	};

	// Schedule a note to be played at a specific time in the future
	// Based on audiocontext current time
	_scheduleBeat = (beatInMeasure: number, time: number) => {
		const osc = this._audioContext.createOscillator();
		const envelope = this._audioContext.createGain();

		envelope.gain.value = 1;
		envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
		envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

		osc.connect(envelope);
		envelope.connect(this._audioContext.destination);

		// if (beatInMeasure % (BEAT_COUNT * SUBDIVISIONS) === 0) {
		if (this.shouldAccentSubdivision && this.subdivision > 1) {
			const shouldAccent = beatInMeasure % this.subdivision === 0;
			osc.frequency.value = shouldAccent ? 1000 : 800;
		} else {
			osc.frequency.value = beatInMeasure === 0 ? 1000 : 800;
		}

		osc.start(time);
		osc.stop(time + CLICK_DURATION);
	};

	_scheduler = () => {
		while (
			this.nextNoteTime <
			this._audioContext.currentTime + this._scheduleAheadTime
		) {
			this._scheduleBeat(this.currentBeatInMeasure, this.nextNoteTime);
			this._setNextBeatTime();
		}
	};

	_init = () => {
		this._intervalWorker = new Worker(
			new URL('./workers/intervalWorker.ts', import.meta.url)
		);

		this._intervalWorker.onmessage = (e) => {
			if (e.data === 'tick') {
				this._scheduler();
			} else {
				console.log(e.data);
			}
		};

		this._intervalWorker?.postMessage({
			command: 'setInterval',
			interval: this._intervalLookAhead,
		});
	};

	start = () => {
		if (this._isRunning) return;

		this._isRunning = true;
		this.nextNoteTime = this._audioContext?.currentTime + 0.05;

		this._intervalWorker?.postMessage({ command: 'start' });
	};

	stop = () => {
		this._isRunning = false;
		this._intervalWorker?.postMessage({ command: 'stop' });
	};

	close = () => {
		this.stop();
		this._audioContext?.close();
		this._intervalWorker?.terminate();
	};
}

export default Metronome;
