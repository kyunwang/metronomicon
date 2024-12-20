import cn from 'clsx';
import localFont from 'next/font/local';

const mono = localFont({
	src: [
		{
			path: './fonts/PPFraktionMono/PPFraktionMono-Regular.otf',
			weight: '400',
			style: 'normal',
		},
		{
			path: './fonts/PPFraktionMono/PPFraktionMono-Bold.otf',
			weight: '700',
			style: 'bold',
		},
	],
	display: 'swap',
	variable: '--font-mono',
	preload: true,
});

export const fonts = { className: cn(mono.variable) };
