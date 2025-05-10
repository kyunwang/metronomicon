import '@/styles/globals.css';
import type { Metadata } from 'next';

import { fonts } from '../fonts';

import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
	title: 'Metronomicon',
	description: 'A collection of metronome UIs.',
};

// suppressHydrationWarning: This property only applies one level deep, so it won't block hydration warnings on other elements.
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			dir="ltr"
			className={fonts?.className}
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
