import styles from './MenuItem.module.scss'
import { ReactNode } from 'react'

interface MenuItemProps {
	text: string
	rightIcon?: ReactNode
}

export const MenuItem = ({ text, rightIcon }: MenuItemProps) => {
	return (
		<div className={styles.menu_item}>
			<span className={styles.menu_item__text}>{text}</span>
			{rightIcon && rightIcon}
		</div>
	)
}
