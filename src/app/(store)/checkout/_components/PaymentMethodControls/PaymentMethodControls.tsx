'use client'

import Image from 'next/image'
import { PaymentMethod } from '@/features/orders/services/orders.api'
import styles from './PaymentMethodControls.module.scss'
import { SavedPaymentMethods } from '@/app/(store)/checkout/_components/SavedPaymentMethods/SavedPaymentMethods'

interface PaymentMethodControlsProps {
	paymentMethod: PaymentMethod
	onPaymentMethodChange: (method: PaymentMethod) => void
	selectedPaymentMethodId: string | null
	onSelectPaymentMethod: (methodId: string | null) => void
}

export const PaymentMethodControls = ({
	paymentMethod,
	onPaymentMethodChange,
	selectedPaymentMethodId,
	onSelectPaymentMethod,
}: PaymentMethodControlsProps) => {
	return (
		<div className={styles.section}>
			<div className={styles.sectionHeader}>
				<p className={styles.sectionSubtitle}>Pago</p>

				<div className={styles.sectionTitle}>
					<Image
						src={'/icons/credit-card.svg'}
						alt={'credit-card'}
						width={24}
						height={24}
						className={styles.card_icon}
					/>
					<span>
						Aceptamos tarjetas de crédito y transferencias electrónicas
					</span>
				</div>
			</div>

			<div className={styles.radioGroup}>
				<button
					type="button"
					className={`${styles.radioOption} ${
						paymentMethod === 'CARD' ? styles.active : ''
					}`}
					onClick={() => onPaymentMethodChange('CARD')}
				>
					<div className={styles.left}>
						<div className={styles.radioBtn}>
							<div className={styles.radioBtn__inner}></div>
						</div>
						Tarjeta de Crédito
					</div>
				</button>

				{/* PAGO */}
				{paymentMethod === 'CARD' && (
					<SavedPaymentMethods
						selectedMethodId={selectedPaymentMethodId}
						onSelectMethod={onSelectPaymentMethod}
					/>
				)}

				<button
					type="button"
					className={`${styles.radioOption} ${
						paymentMethod === 'TRANSFER' ? styles.active : ''
					}`}
					onClick={() => onPaymentMethodChange('TRANSFER')}
				>
					<div className={styles.left}>
						<div className={styles.radioBtn}>
							<div className={styles.radioBtn__inner}></div>
						</div>
						Transferencia Bancaria
					</div>
				</button>
			</div>

			{paymentMethod === 'TRANSFER' && (
				<div className={styles.transferInfo}>
					Al seleccionar transferencia bancaria, el pedido será generado y
					enviado a nuestro equipo para confirmar datos bancarios.
					<span>
						Posteriormente en breve nos pondremos en contacto contigo para
						proporcionarte los datos bancarios y dar seguimiento al pago al
						correo que designaste de <b>contacto</b>.
					</span>
				</div>
			)}
		</div>
	)
}
