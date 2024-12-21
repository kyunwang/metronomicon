'use client';

import { Metronome, type MetronomeSettings } from '@/lib/metronome';
import { createContext, useEffect, useState } from 'react';

interface TypeGContextType {
	bpm: number;
	setBPM: (bpm: number) => void;
	isPlaying: boolean;
	setIsPlaying: (isPlaying: boolean) => void;
	metronome: Metronome | undefined;
	setMetronome: (metronome: Metronome) => void;
}

export const TypeGContext = createContext({} as TypeGContextType);

const TypeGProvider = ({ children }: { children?: React.ReactNode }) => {
	const [bpm, setBPM] = useState(90);
	const [isPlaying, setIsPlaying] = useState(false);
	const [metronome, setMetronome] = useState<Metronome>();

	const context: TypeGContextType = {
		bpm,
		setBPM(newBPM: number) {
			if (!metronome) return;
			metronome.bpm = newBPM;
			setBPM(newBPM);
		},
		isPlaying,
		setIsPlaying(newState: boolean) {
			if (!metronome) return;
			newState ? metronome.start() : metronome.stop();
			setIsPlaying(newState);
		},
		metronome,
		setMetronome,
	};

	useEffect(() => {
		const audioContext = new AudioContext();

		// TODO: Set from localstorage if anything is saved there.
		const settings: Partial<MetronomeSettings> = {};
		const newMetronome = new Metronome(audioContext, settings);

		setBPM(newMetronome.bpm);
		setMetronome(newMetronome);
	}, []);

	return (
		<TypeGContext.Provider value={context}>{children}</TypeGContext.Provider>
	);
};

export default TypeGProvider;
