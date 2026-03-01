import styles from './Brand.module.scss'

interface BrandProps {
	text: string
	number: number
	type: 'category' | 'subcategory' | 'disabled'
	active?: boolean
	onSelect?: () => void
}

export const Brand = ({ text, number, type, active, onSelect }: BrandProps) => {
	const state =
		type === 'disabled'
			? 'disabled'
			: `${type}__${active ? 'active' : 'inactive'}`

	return (
		<div
			className={`${styles.brand} ${styles[state]}`}
			role={onSelect ? 'button' : 'presentation'}
			aria-pressed={active ?? false}
			tabIndex={onSelect ? 0 : -1}
			onClick={onSelect}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()
					onSelect?.()
				}
			}}
		>
			<span className={styles[`${state}__text`]}>{text}</span>

			<span className={styles[`${state}__number`]}>({number})</span>
		</div>
	)
}
