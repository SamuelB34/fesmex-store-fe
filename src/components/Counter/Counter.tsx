'use client'

import Image from 'next/image'
import styles from './Counter.module.scss'

interface CounterProps {
	value: number
	onChange: (value: number) => void
	min?: number
	max?: number
	onMaxReached?: () => void
	onMinReached?: () => void
}

export const Counter = ({
	value,
	onChange,
	min,
	max,
	onMaxReached,
	onMinReached,
}: CounterProps) => {
	const safeMin = min ?? 1
	const safeMax = max ?? Number.MAX_SAFE_INTEGER
	const isAtMinimum = value <= safeMin

	const handleChange = (next: number) => {
		if (next > safeMax) {
			onMaxReached?.()
			return
		}
		if (next < safeMin) {
			onMinReached?.()
			return
		}
		onChange(next)
	}
	return (
		<div className={styles.counter}>
			{/*Minus*/}
			<button
				type="button"
				className={styles.btn}
				onClick={() => handleChange(value - 1)}
			>
				<Image
					src={isAtMinimum ? '/icons/delete.svg' : '/icons/minus.svg'}
					alt={isAtMinimum ? 'delete' : 'minus'}
					width={24}
					height={24}
					className={styles.counter__btn}
				/>
			</button>
			{/*Input*/}
			<input
				type="number"
				value={value}
				className={styles.counter__input}
				onChange={(e) => {
					const parsed = Number(e.target.value)
					if (Number.isNaN(parsed)) return
					handleChange(parsed)
				}}
			/>
			{/*Plus*/}
			<button
				type="button"
				className={styles.btn}
				onClick={() => handleChange(value + 1)}
			>
				<Image
					src={'/icons/plus.svg'}
					alt={'plus'}
					width={24}
					height={24}
					className={styles.counter__btn}
				/>
			</button>
		</div>
	)
}
