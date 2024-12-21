import { useContext } from 'react';
import Bracket from '../bracket';
import Button from '../button';
import Radial from '../radial';
import { TypeGContext } from '../TypeGProvider';
import s from './controls-panel.module.css';

const ControlsPanel = () => {
	const { metronome, setBPM, isPlaying, setIsPlaying } =
		useContext(TypeGContext);

	const handleClickBPMChange = (type: 'add' | 'subtract') => {
		if (!metronome) return;
		const newBPM = type === 'add' ? metronome.bpm + 1 : metronome.bpm - 1;
		setBPM(newBPM);
	};

	const handleChangePlayState = () => {
		setIsPlaying(!isPlaying);
	};

	return (
		<div className={s.controlPanel}>
			<div className={s.bracket}>
				<Bracket />
			</div>
			<div className={s.tbd}>
				<Button className={s.slot} variant="outline" size="sm">
					TBD
				</Button>
				<Button className={s.slot} variant="outline" size="sm">
					TBD
				</Button>
				<Button className={s.slot} variant="outline" size="sm">
					TBD
				</Button>
			</div>

			<div className={s.ctas}>
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleClickBPMChange('add')}
				>
					ADD
					<br />+
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleClickBPMChange('subtract')}
				>
					SUBTRACT
					<br />-
				</Button>

				<Radial />

				<Button onClick={handleChangePlayState}>
					<span>{isPlaying ? 'Stop' : 'Start'}</span>
				</Button>
			</div>
		</div>
	);
};

export default ControlsPanel;
