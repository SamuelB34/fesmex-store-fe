'use client'

import Image from 'next/image'
import styles from './Counter.module.scss'

interface CounterProps {
	value: number
	onChange: (value: number) => void
}

export const Counter = ({ value, onChange }: CounterProps) => {
	return (
		<div className={styles.counter}>
			{/*Minus*/}
			<button
				className={styles.btn}
				onClick={() => onChange(value - 1)}
				disabled={value === 1}
			>
				<Image
					src={'/icons/minus.svg'}
					alt={'minus'}
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
				onChange={(e) => onChange(Number(e.target.value))}
			/>
			{/*Plus*/}
			<button className={styles.btn} onClick={() => onChange(value + 1)}>
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
