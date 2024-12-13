'use client';
import styles from './page.module.css';

import { Metronome } from '@/libs/metronome';
import { useEffect, useMemo, useState } from 'react';

const subdivisions: Array<{ name: string; value: number }> = [
	{
		name: 'Quarter Note',
		value: 1,
	},
	{
		name: 'Eight Note',
		value: 2,
	},
	{
		name: 'Sixteenth Note',
		value: 4,
	},
	{
		name: 'Triplets',
		value: 3,
	},
];

export default function MetronomePage() {
	const [bpm, setBPM] = useState<number>();
	const [subdivision, setSubdivision] = useState<number>();
	const [shouldAccentSubdivision, setShouldAccentSubdivision] =
		useState<boolean>(false);

	const metronome = useMemo(() => {
		return new Metronome(new AudioContext());
	}, []);

	useEffect(() => {
		setBPM(metronome.bpm);
		setSubdivision(metronome.subdivision);
		setShouldAccentSubdivision(metronome.shouldAccentSubdivision);

		return () => {
			metronome.close();
		};
	}, [metronome]);

	const handleBPMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newBPM = Number.parseInt(event.target.value);
		setBPM(newBPM);
		metronome.bpm = newBPM;
	};

	const handleSubdivisionChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newSubdivision = Number.parseInt(event.target.value);
		setSubdivision(newSubdivision);
		metronome.subdivision = newSubdivision;
	};

	const handleSubdivisionAccentChange = () => {
		metronome.shouldAccentSubdivision = !shouldAccentSubdivision;
		setShouldAccentSubdivision(!shouldAccentSubdivision);
	};

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<div>
					<p>Metronome</p>
					<button type="button" onClick={metronome.start}>
						Start
					</button>
					<button type="button" onClick={metronome.stop}>
						Stop
					</button>

					<input
						type="number"
						value={bpm || 0}
						onChange={handleBPMChange}
					/>

					<br />

					<label>
						Accents Subdivision
						<input
							type="checkbox"
							checked={shouldAccentSubdivision}
							onChange={handleSubdivisionAccentChange}
						/>
					</label>

					<div>
						{subdivisions.map(({ name, value }) => (
							<label key={name}>
								<span>{name} </span>
								<input
									name="subdivisions"
									type="radio"
									value={value}
									checked={value === subdivision}
									onChange={handleSubdivisionChange}
								/>
								<br />
							</label>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
