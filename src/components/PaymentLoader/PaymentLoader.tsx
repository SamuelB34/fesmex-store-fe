'use client'

import styles from './PaymentLoader.module.scss'

interface PaymentLoaderProps {
	message?: string
}

export const PaymentLoader = ({ message = 'Procesando pago...' }: PaymentLoaderProps) => {
	return (
		<div className={styles.overlay}>
			<div className={styles.content}>
				<div className={styles.loader} />
				<p className={styles.message}>{message}</p>
			</div>
		</div>
	)
}
