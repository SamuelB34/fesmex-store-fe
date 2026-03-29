'use client'

import Image from 'next/image'
import { sileo } from 'sileo'
import styles from './PaymentMethodsPanel.module.scss'
import { usePaymentMethods } from '@/features/orders/hooks/usePaymentMethods'

const CARD_LOGOS: Record<string, string> = {
	visa: '/icons/visa.svg',
	mastercard: '/icons/mastercard.svg',
	amex: '/icons/amex.svg',
	discover: '/icons/discover.svg',
}

export function PaymentMethodsPanel() {
	const {
		paymentMethods,
		isLoading,
		error,
		deletePaymentMethod,
		setDefaultPaymentMethod,
	} = usePaymentMethods()

	const handleDelete = async (paymentMethodId: string) => {
		if (confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
			try {
				await deletePaymentMethod(paymentMethodId)
				sileo.success({
					title: 'Eliminado',
					description: 'Método de pago eliminado correctamente',
				})
			} catch {
				sileo.error({
					title: 'Error',
					description: 'No se pudo eliminar el método de pago',
				})
			}
		}
	}

	const handleSetDefault = async (paymentMethodId: string) => {
		try {
			await setDefaultPaymentMethod(paymentMethodId)
			sileo.success({
				title: 'Actualizado',
				description: 'Método de pago establecido como predeterminado',
			})
		} catch {
			sileo.error({
				title: 'Error',
				description: 'No se pudo establecer el método de pago por defecto',
			})
		}
	}

	if (isLoading) {
		return (
			<div className={styles.container}>
				<h2>Mis Métodos de Pago</h2>
				<p className={styles.loading}>Cargando métodos de pago...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.container}>
				<h2>Mis Métodos de Pago</h2>
				<p className={styles.error}>{error}</p>
			</div>
		)
	}

	if (paymentMethods.length === 0) {
		return (
			<div className={styles.container}>
				<h2>Mis Métodos de Pago</h2>
				<p className={styles.empty}>
					No tienes métodos de pago guardados. Puedes guardar una tarjeta durante el proceso de compra.
				</p>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<h2>Mis Métodos de Pago</h2>
			<div className={styles.methodsList}>
				{paymentMethods.map((method) => (
					<div key={method._id} className={styles.methodCard}>
						<div className={styles.cardContent}>
							<div className={styles.cardLogo}>
								{CARD_LOGOS[method.brand.toLowerCase()] ? (
									<Image
										src={CARD_LOGOS[method.brand.toLowerCase()]}
										alt={method.brand}
										width={40}
										height={24}
										style={{ objectFit: 'contain' }}
									/>
								) : (
									<div className={styles.brandText}>{method.brand}</div>
								)}
							</div>

							<div className={styles.cardInfo}>
								<p className={styles.cardNumber}>
									<span style={{ textTransform: 'capitalize' }}>{method.brand}</span> •••• {method.last4}
								</p>
								<p className={styles.cardExpiry}>
									Vence: {String(method.exp_month).padStart(2, '0')}/{method.exp_year}
								</p>
								{method.wallet && (
									<p className={styles.wallet}>
										{method.wallet === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
									</p>
								)}
							</div>

							{method.is_default && (
								<div className={styles.defaultBadge}>Predeterminado</div>
							)}
						</div>

						<div className={styles.actions}>
							{!method.is_default && (
								<button
									className={styles.actionBtn}
									onClick={() => handleSetDefault(method._id)}
									title="Establecer como predeterminado"
								>
									Usar por defecto
								</button>
							)}
							<button
								className={`${styles.actionBtn} ${styles.delete}`}
								onClick={() => handleDelete(method._id)}
								title="Eliminar método de pago"
							>
								Eliminar
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
