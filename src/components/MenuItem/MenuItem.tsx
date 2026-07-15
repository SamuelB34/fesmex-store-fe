import styles from './MenuItem.module.scss'
import { memo, ReactNode } from 'react'

interface MenuItemProps {
	text: string
	rightIcon?: ReactNode
	onClick?: () => void
	isActive?: boolean
}

export const MenuItem = memo(function MenuItem({
	text,
	rightIcon,
	onClick,
	isActive = false,
}: MenuItemProps) {
	return (
		<div
			className={`${styles.menu_item} ${isActive ? styles.active : ''}`.trim()}
			onClick={onClick}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : -1}
			onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick() } }}
		>
			<span className={styles.menu_item__text}>{text}</span>
			{rightIcon && rightIcon}
		</div>
	)
})
