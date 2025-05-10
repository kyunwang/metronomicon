import s from './header.module.css';

import cn from 'clsx';
import Link from 'next/link';

const Header = ({ className }: { className?: string }) => {
	return (
		<header className={cn(s.header, className)}>
			<Link href="#info">INFO</Link>
			<Link href="#presets">PRESETS</Link>
		</header>
	);
};

export default Header;
