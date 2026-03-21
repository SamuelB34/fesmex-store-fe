import styles from './Input.module.scss'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = ({ disabled, ...rest }: InputProps) => {
	return (
		<label className={disabled ? styles.input__inactive : styles.input__active}>
			<input className={styles.input__field} disabled={disabled} {...rest} />
		</label>
	)
}
