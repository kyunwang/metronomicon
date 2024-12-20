import { cva, type VariantProps } from 'class-variance-authority';
import cn from 'clsx';
import type { RefObject } from 'react';
import s from './button.module.css';

const buttonVariants = cva([s.button], {
	variants: {
		variant: {
			default: [s.primary],
			outline: [s.outline],
		},
		size: {
			default: [s.md],
			lg: [s.lg],
			sm: [s.sm],
			sm_wd: [s.sm_wd],
			custom: [],
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	ref?: RefObject<HTMLButtonElement>;
}

const Button = ({ className, variant, size, ref, ...props }: ButtonProps) => {
	return (
		<button
			type="button"
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
};

Button.displayName = 'Button';

export default Button;
