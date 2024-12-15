let _timerID: string | number | NodeJS.Timeout | undefined;
let _interval = 100;

type IntervalWorkerType = {
	command: 'start' | 'stop' | 'setInterval' | 'tick';
	interval?: number;
};

self.onmessage = (e) => {
	const { command, interval } = e.data as IntervalWorkerType;

	switch (command) {
		case 'setInterval':
			if (!interval) throw new Error('interval must be provided');
			_interval = interval;

			if (!_timerID) return;
			clearInterval(_timerID);
			_timerID = setInterval(() => {
				postMessage('tick');
			}, interval);
			break;
		case 'start':
			_timerID = setInterval(() => {
				postMessage('tick');
			}, interval);
			break;
		case 'stop':
			if (!_timerID) return;
			clearInterval(_timerID);
			_timerID = undefined;
			break;
		default:
			break;
	}
};
