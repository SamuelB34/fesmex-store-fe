import styles from './Button.module.scss'
import { type MouseEventHandler, type ReactNode } from 'react'

interface ButtonProps {
	leftIcon?: ReactNode
	text?: string
	variant?: 'primary' | 'secondary' | 'accent'
	filled?: boolean
	disabled?: boolean
	onClick?: MouseEventHandler<HTMLButtonElement>
}

export const Button = ({
	text,
	leftIcon,
	variant = 'primary',
	filled = true,
	disabled = false,
	onClick,
}: ButtonProps) => {
	const classes = [styles.btn, styles[variant], !filled ? styles.outlined : '']
		.filter(Boolean)
		.join(' ')

	return (
		<button className={classes} onClick={onClick} disabled={disabled}>
			{leftIcon && leftIcon}
			{text && text}
		</button>
	)
}
