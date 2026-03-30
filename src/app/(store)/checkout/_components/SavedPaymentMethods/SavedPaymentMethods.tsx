'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './SavedPaymentMethods.module.scss'
import {
	paymentMethodsApi,
	type PaymentMethod,
} from '@/features/orders/services/paymentMethods.api'
import Image from 'next/image'

interface SavedPaymentMethodsProps {
	selectedMethodId: string | null
	onSelectMethod: (methodId: string | null) => void
}

export const SavedPaymentMethods = ({
	selectedMethodId,
	onSelectMethod,
}: SavedPaymentMethodsProps) => {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const hasAutoSelectedRef = useRef(false)

	useEffect(() => {
		const fetchMethods = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const methods = await paymentMethodsApi.getPaymentMethods()
				setPaymentMethods(methods)

				// Auto-select default method only once on first load
				if (!hasAutoSelectedRef.current && methods.length > 0) {
					const defaultMethod = methods.find((m) => m.is_default)
					if (defaultMethod) {
						onSelectMethod(defaultMethod.provider_payment_method_id)
						hasAutoSelectedRef.current = true
					}
				}
			} catch (err) {
				const message =
					err instanceof Error ? err.message : 'Error al cargar métodos de pago'
				setError(message)
				console.error('Error fetching payment methods:', err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchMethods()
	}, [onSelectMethod])

	if (isLoading) {
		return <div className={styles.loading}>Cargando métodos de pago...</div>
	}

	if (paymentMethods.length === 0) {
		return null
	}

	const getBrandIcon = (brand: string) => {
		const brandLower = brand.toLowerCase()
		const iconPath = `/icons/${brandLower}.svg`
		return iconPath
	}

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>Métodos de pago guardados</h3>

			<div className={styles.methodsList}>
				{paymentMethods.map((method) => (
					<label key={method._id} className={styles.methodItem}>
						<input
							type="radio"
							name="paymentMethod"
							value={method.provider_payment_method_id}
							checked={selectedMethodId === method.provider_payment_method_id}
							onChange={() => onSelectMethod(method.provider_payment_method_id)}
							className={styles.radio}
						/>

						<div className={styles.cardContent}>
							<div className={styles.cardInfo}>
								<div className={styles.brandAndNumber}>
									<div className={styles.brandIcon}>
										<Image
											src={getBrandIcon(method.brand)}
											alt={method.brand}
											width={24}
											height={16}
											onError={(e) => {
												// Fallback si el icono no existe
												e.currentTarget.style.display = 'none'
											}}
										/>
									</div>
									<span className={styles.cardNumber}>•••• {method.last4}</span>
								</div>

								<span className={styles.expiry}>
									Vence: {String(method.exp_month).padStart(2, '0')}/
									{method.exp_year}
								</span>
							</div>

							{method.is_default && (
								<span className={styles.defaultBadge}>Por defecto</span>
							)}
						</div>
					</label>
				))}
			</div>

			{error && <p className={styles.error}>{error}</p>}

			<button
				type="button"
				onClick={(e) => {
					e.preventDefault()
					e.stopPropagation()
					console.log(
						' Usar una tarjeta nueva - resetting selectedPaymentMethodId',
					)
					onSelectMethod(null)
				}}
				className={styles.useNewCard}
			>
				Usar una tarjeta nueva
			</button>
		</div>
	)
}
