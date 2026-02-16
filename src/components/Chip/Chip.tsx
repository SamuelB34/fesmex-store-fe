import styles from './Chip.module.scss'
import { ReactNode } from 'react'

interface ChipProps {
	text: string
	type?: 'primary' | 'secondary'
	active?: boolean
	leftIcon?: ReactNode
	rightIcon?: ReactNode
}

export const Chip = ({
	text,
	type = 'primary',
	active,
	leftIcon,
	rightIcon,
}: ChipProps) => {
	return (
		<div
			className={
				active ? styles[type + '_active_chip'] : styles[type + '_inactive_chip']
			}
		>
			{leftIcon && leftIcon}
			<span className={styles.text}>{text}</span>
			{rightIcon && rightIcon}
		</div>
	)
}
