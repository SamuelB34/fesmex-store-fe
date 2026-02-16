import styles from './Input.module.scss'

interface InputProps {
	disabled?: boolean
	placeholder?: string
}

export const Input = ({ disabled, placeholder }: InputProps) => {
	return (
		<label className={disabled ? styles.input__inactive : styles.input__active}>
			<input
				type="text"
				className={styles.input__field}
				placeholder={placeholder}
			/>
		</label>
	)
}
