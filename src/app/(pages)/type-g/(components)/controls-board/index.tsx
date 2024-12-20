import { useContext } from 'react';
import Button from '../button';
import { TypeGContext } from '../button/TypeGProvider';
import s from './controls-board.module.css';

const ControlsBoard = () => {
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
		<div className={s.controlBoard}>
			<div className={s.tbd}>TBD</div>

			<div className={s.ctas}>
				<Button
					variant="outline"
					size="sm_wd"
					onClick={() => handleClickBPMChange('add')}
				>
					ADD
					<br />+
				</Button>
				<Button
					variant="outline"
					size="sm_wd"
					onClick={() => handleClickBPMChange('subtract')}
				>
					SUBTRACT
					<br />-
				</Button>

				<Button
					// variant={isPlaying ? 'default' : 'outline'}
					size="lg"
					onClick={handleChangePlayState}
				>
					<span>{isPlaying ? 'Stop' : 'Start'}</span>
				</Button>
			</div>
		</div>
	);
};

ControlsBoard.displayName = 'ControlsBoard';

export default ControlsBoard;
