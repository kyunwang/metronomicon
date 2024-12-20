'use client';
import s from './page.module.css';

// import { Button } from '@/components/ui/button';
import BPMBar from './(components)/bpm-bar';
import ControlsBoard from './(components)/controls-board';
import Footer from './(components)/footer';
import Header from './(components)/header';

const TypeGMetronome = () => {
	return (
		<div className={s.page}>
			<Header />

			<div className={s.title}>
				<p>TYPE. G METRONOME</p>
			</div>

			<div className={s.beats}>beats</div>

			<main className={s.main}>
				<BPMBar />
				<ControlsBoard />
			</main>
			<Footer />
		</div>
	);
};
export default TypeGMetronome;
