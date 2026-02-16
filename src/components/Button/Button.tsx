import styles from './Button.module.scss'
import { ReactNode } from 'react'

interface ButtonProps {
	leftIcon?: ReactNode
	text: string
	variant?: 'primary' | 'secondary' | 'accent'
	filled?: boolean
}

export const Button = ({
	text,
	leftIcon,
	variant = 'primary',
	filled = true,
}: ButtonProps) => {
	const classes = [styles.btn, styles[variant], !filled ? styles.outlined : '']
		.filter(Boolean)
		.join(' ')

	return (
		<button className={classes}>
			{leftIcon && leftIcon}
			{text}
		</button>
	)
}
