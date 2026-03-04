import styles from './Input.module.scss'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = ({ disabled, placeholder, value, onChange, onKeyDown, ...rest }: InputProps) => {
	return (
		<label className={disabled ? styles.input__inactive : styles.input__active}>
			<input
				type="text"
				className={styles.input__field}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				disabled={disabled}
				{...rest}
			/>
		</label>
	)
}
