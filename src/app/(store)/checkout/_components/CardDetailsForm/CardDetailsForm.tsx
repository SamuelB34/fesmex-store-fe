'use client'

import styles from './CardDetailsForm.module.scss'

interface CardForm {
	number: string
	holder: string
	expiry: string
	cvv: string
}

interface CardDetailsFormProps {
	cardForm: CardForm
	onCardFormChange: (field: keyof CardForm, value: string) => void
}

export const CardDetailsForm = ({
	cardForm,
	onCardFormChange,
}: CardDetailsFormProps) => {
	return (
		<div className={styles.cardForm}>
			<div className={styles.fieldGrid__input}>
				<span>Número de la tarjeta</span>
				<input
					className={styles.input}
					placeholder="0000 0000 0000 0000"
					value={cardForm.number}
					onChange={(event) => onCardFormChange('number', event.target.value)}
				/>
			</div>

			<div className={styles.fieldGrid__input}>
				<span>Nombre del titular</span>
				<input
					className={styles.input}
					placeholder="Juan Pérez"
					value={cardForm.holder}
					onChange={(event) => onCardFormChange('holder', event.target.value)}
				/>
			</div>

			<div className={styles.fieldGrid}>
				<div className={styles.fieldGrid__input}>
					<span>Vigencia</span>
					<input
						className={styles.input}
						placeholder="MM/AA"
						value={cardForm.expiry}
						onChange={(event) => onCardFormChange('expiry', event.target.value)}
					/>
				</div>
				<div className={styles.fieldGrid__input}>
					<span>Código de Seguridad</span>
					<input
						className={styles.input}
						placeholder="CVV"
						value={cardForm.cvv}
						onChange={(event) => onCardFormChange('cvv', event.target.value)}
					/>
				</div>
			</div>
		</div>
	)
}
