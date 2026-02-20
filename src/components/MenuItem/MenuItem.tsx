import styles from './MenuItem.module.scss'
import { ReactNode } from 'react'

interface MenuItemProps {
	text: string
	rightIcon?: ReactNode
	onClick?: () => void
	isActive?: boolean
}

export const MenuItem = ({
	text,
	rightIcon,
	onClick,
	isActive = false,
}: MenuItemProps) => {
	return (
		<div
			className={`${styles.menu_item} ${isActive ? styles.active : ''}`.trim()}
			onClick={onClick}
		>
			<span className={styles.menu_item__text}>{text}</span>
			{rightIcon && rightIcon}
		</div>
	)
}
