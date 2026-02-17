import styles from './Brand.module.scss'

interface BrandProps {
	text: string
	number: number
	type: 'category' | 'subcategory' | 'disabled'
	active?: boolean
}

export const Brand = ({ text, number, type, active }: BrandProps) => {
	const state =
		type === 'disabled'
			? 'disabled'
			: `${type}__${active ? 'active' : 'inactive'}`

	return (
		<div className={`${styles.brand} ${styles[state]}`}>
			<span className={styles[`${state}__text`]}>{text}</span>

			<span className={styles[`${state}__number`]}>({number})</span>
		</div>
	)
}
