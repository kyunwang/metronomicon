'use client';
import { Button } from '@/components/ui/button';
import styles from './page.module.css';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Metronome } from '@/lib/metronome';
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
		setBPM(metronome.settings.bpm);
		setSubdivision(metronome.settings.subdivisions);
		setShouldAccentSubdivision(metronome.shouldAccentSubdivision);

		return () => {
			metronome.close();
		};
	}, [metronome]);

	const handleBPMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newBPM = Number.parseInt(event.target.value);
		metronome.bpm = newBPM;
		setBPM(newBPM);
	};

	const handleSubdivisionChange = (
		event: React.ChangeEvent<HTMLButtonElement>
	) => {
		const newSubdivision = Number.parseInt(event.target.value);
		setSubdivision(newSubdivision);
		metronome.settings.subdivisions = newSubdivision;
	};

	const handleSubdivisionAccentChange = () => {
		metronome.shouldAccentSubdivision = !shouldAccentSubdivision;
		metronome.setMode(!shouldAccentSubdivision ? 'simple' : 'subdivision');
		setShouldAccentSubdivision(!shouldAccentSubdivision);
	};

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<div>
					<p>Metronome</p>

					<Button onClick={metronome.start}>Start</Button>
					<Button onClick={metronome.stop}>Stop</Button>

					<Input
						type="number"
						value={bpm || 0}
						onChange={handleBPMChange}
					/>

					<br />

					<Label htmlFor="subdivision">
						Accents Subdivision
						<Checkbox
							id="subdivision"
							checked={shouldAccentSubdivision}
							onCheckedChange={handleSubdivisionAccentChange}
						/>
					</Label>

					<RadioGroup
						// onChange={handleSubdivisionChange}
						defaultValue={subdivision}
					>
						{subdivisions.map(({ name, value }) => (
							<Label key={name} htmlFor={name}>
								<span>{name}</span>
								<RadioGroupItem
									id={name}
									value={value}
									checked={value === subdivision}
									onClick={handleSubdivisionChange}
								/>
								<br />
							</Label>
						))}
					</RadioGroup>
				</div>
			</main>
		</div>
	);
}
