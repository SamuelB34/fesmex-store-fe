'use client'

import Image from 'next/image'
import { PaymentMethod } from '@/features/orders/services/orders.api'
import { Button } from '@/components/Button/Button'
import { formatCurrency } from '@/shared/utils/format'
import styles from './SummaryActions.module.scss'

interface SummaryActionsProps {
	subtotal: number
	shippingCost: number
	shippingLabel: string
	grandTotal: number
	showShipping: boolean
	paymentMethod: PaymentMethod
	isFormReady: boolean
	isSubmitting: boolean
}

export const SummaryActions = ({
	subtotal,
	shippingCost,
	shippingLabel,
	grandTotal,
	showShipping,
	paymentMethod,
	isFormReady,
	isSubmitting,
}: SummaryActionsProps) => {
	return (
		<div className={styles.summaryTotals}>
			<div className={styles.top_price}>
				<div className={styles.totalRow}>
					<span className={styles.label}>Subtotal</span>
					<span className={styles.price}>
						{formatCurrency(subtotal)} <span className={styles.label}>MXN</span>
					</span>
				</div>

				{showShipping && (
					<div className={styles.totalRow}>
						<span className={styles.label}>Envío</span>
						<span className={styles.price}>
							<span className={styles.label}>{shippingLabel}</span>{' '}
							{formatCurrency(shippingCost)}{' '}
							<span className={styles.label}>MXN</span>
						</span>
					</div>
				)}
			</div>

			<div className={styles.totalRow}>
				<strong>Total</strong>
				<strong>
					{formatCurrency(grandTotal)} <span className={styles.label}>MXN</span>
				</strong>
			</div>

			<Button
				leftIcon={
					<Image
						src={
							paymentMethod === 'TRANSFER'
								? '/icons/double-check.svg'
								: '/icons/credit-card.svg'
						}
						alt={paymentMethod === 'TRANSFER' ? 'double-check' : 'credit-card'}
						width={24}
						height={24}
						className={isFormReady ? styles.disabled_icon : styles.icon}
					/>
				}
				variant={isFormReady ? 'accent' : 'primary'}
				filled={isFormReady}
				text={paymentMethod === 'TRANSFER' ? 'Enviar pedido' : 'Realizar Pago'}
				type={'submit'}
				disabled={!isFormReady || isSubmitting}
			/>

			{paymentMethod === 'TRANSFER' && (
				<div className={styles.transferLegend}>
					<div className={styles.warning}>
						<Image
							src={'/icons/info.svg'}
							alt={'info'}
							width={24}
							height={24}
						/>
					</div>
					<span>
						Recuerda que tu pedido será enviado y un miembro de nuestro equipo
						en FESMEX te contactará para compartir los datos bancarios y
						continuar con la gestión de tu orden.
					</span>
				</div>
			)}
		</div>
	)
}
