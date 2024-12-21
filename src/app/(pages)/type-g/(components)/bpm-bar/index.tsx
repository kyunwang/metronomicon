import { useContext } from 'react';
import Bracket from '../bracket';
import { TypeGContext } from '../TypeGProvider';
import s from './bpm-bar.module.css';

const BPMBar = () => {
	const { bpm, setBPM } = useContext(TypeGContext);

	const handleInputBPMChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newBPM = Number.parseInt(event.target.value);
		setBPM(newBPM);
	};

	return (
		<div className={s.bpmBar}>
			<input type="number" value={bpm} onChange={handleInputBPMChange} />

			<p>BPM - {bpm}</p>

			<Bracket />
		</div>
	);
};

export default BPMBar;
