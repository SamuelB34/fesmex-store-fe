'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { sileo } from 'sileo'
import { Elements } from '@stripe/react-stripe-js'
import styles from './Checkout.module.scss'
import { Counter } from '@/components/Counter/Counter'
import { formatCurrency } from '@/shared/utils/format'
import { ShippingAddressSelector } from './_components/ShippingAddressSelector/ShippingAddressSelector'
import { NewAddressForm } from './_components/NewAddressForm/NewAddressForm'
import { PaymentMethodControls } from './_components/PaymentMethodControls/PaymentMethodControls'
import { SummaryActions } from './_components/SummaryActions/SummaryActions'
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal'
import { stripePromise, isStripeConfigured } from '@/lib/stripe'
import type { StripePaymentSectionRef } from './_components/StripePaymentSection/StripePaymentSection'
import { PaymentLoader } from '@/components/PaymentLoader/PaymentLoader'
import {
	useCheckoutState,
	PICKUP_LOCATIONS,
} from './_hooks/useCheckoutState'
import { useCheckoutPayment } from './_hooks/useCheckoutPayment'

const StripePaymentSection = dynamic(
	() => import('./_components/StripePaymentSection/StripePaymentSection').then((m) => m.StripePaymentSection),
	{ ssr: false },
)

export default function CheckoutForm() {
	const checkout = useCheckoutState()
	const stripePaymentRef = useRef<StripePaymentSectionRef>(null)

	const {
		isSubmitting,
		isProcessingPayment,
		paymentLoaderMessage,
		handleConfirmOrder,
	} = useCheckoutPayment({
		paymentMethod: checkout.paymentMethod,
		selectedPaymentMethodId: checkout.selectedPaymentMethodId,
		grandTotal: checkout.grandTotal,
		stripePaymentRef,
		buildOrderPayload: checkout.buildOrderPayload,
		clearCart: checkout.clearCart,
		showStripeMinimumAmountError: checkout.showStripeMinimumAmountError,
	})

	return (
		<div className={styles.checkoutWrapper}>
			<form onSubmit={checkout.handleSubmit} className={styles.checkoutGrid}>
				<section className={styles.formColumn}>
					<div className={styles.form}>
						{/* ENTREGA */}
						<div className={styles.section}>
							<div className={styles.sectionHeader}>
								<h2>Entrega</h2>

								<div className={styles.deliveryToggle}>
									<button
										type="button"
										className={checkout.deliveryType === 'shipping' ? styles.active : ''}
										onClick={() => checkout.setDeliveryType('shipping')}
									>
										Envío por flete
									</button>

									<button
										type="button"
										className={checkout.deliveryType === 'pickup' ? styles.active : ''}
										onClick={() => checkout.setDeliveryType('pickup')}
									>
										Recoger en almacén
									</button>
								</div>
							</div>

							{/* DIRECCIÓN */}
							{checkout.deliveryType === 'shipping' && (
								<div className={styles.radioGroup}>
									<ShippingAddressSelector
										addresses={checkout.addresses}
										isLoading={checkout.isLoadingAddresses}
										selectedIndex={checkout.selectedAddressIndex}
										onSelectAddress={checkout.handleSelectAddress}
									/>

									{checkout.selectedAddressIndex === 'new' && (
										<NewAddressForm
											register={checkout.register}
											errors={checkout.errors}
											isRequired={checkout.selectedAddressIndex === 'new'}
											stateOptions={checkout.stateOptions}
											isLoadingStates={checkout.isLoadingStates}
											onStateChange={checkout.handleNewAddressStateChange}
										/>
									)}
								</div>
							)}

							{/* PICKUP */}

							{checkout.deliveryType === 'pickup' && (
								<div className={styles.pickupList}>
									{PICKUP_LOCATIONS.map((loc) => (
										<button
											key={loc.id}
											type="button"
											className={`${styles.pickupOption} ${
												checkout.pickupLocation === loc.id ? styles.active : ''
											}`}
											onClick={() => checkout.setPickupLocation(loc.id)}
										>
											<div className={styles.left}>
												<div className={styles.radioBtn}>
													<div className={styles.radioBtn__inner}></div>
												</div>
												<div className={styles.labels}>
													<strong>{loc.name}</strong>
													<p>{loc.address}</p>
												</div>
											</div>

											<span>{loc.delivery}</span>
										</button>
									))}
								</div>
							)}
						</div>

						{/* COSTO DE ENVÍO ESTIMADO */}
						{checkout.deliveryType === 'shipping' && (
							<div className={styles.section}>
								<div className={styles.sectionHeader}>
									<p className={styles.sectionSubtitle}>Costo de envío</p>

									<div className={styles.sectionTitle}>
										<Image
											src={'/icons/delivery.svg'}
											alt={'delivery'}
											width={24}
											height={24}
											className={styles.card_icon}
										/>
										<span>Envíos a toda la república Mexicana</span>
									</div>
								</div>

								<div className={styles.shippingEstimate}>
									{checkout.estimatedShipping > 0 ? (
										<>
											<p className={styles.shippingCost}>
												Envío estimado:{' '}
												<strong>{formatCurrency(checkout.estimatedShipping)}</strong>
											</p>
											<p className={styles.shippingNote}>
												*El costo final se calculará al confirmar la compra
											</p>
										</>
									) : (
										<p className={styles.shippingNote}>
											Selecciona un estado para calcular el envío
										</p>
									)}
								</div>
							</div>
						)}

						<PaymentMethodControls
							paymentMethod={checkout.paymentMethod}
							onPaymentMethodChange={checkout.handlePaymentMethodChange}
							selectedPaymentMethodId={checkout.selectedPaymentMethodId}
							onSelectPaymentMethod={checkout.setSelectedPaymentMethodId}
						/>

						{/* NOTAS */}
						<div className={styles.field}>
							<label className={styles.label}>Notas (opcional)</label>
							<textarea
								className={styles.input}
								style={{ minHeight: '120px', resize: 'none' }}
								{...checkout.register('notes')}
								disabled={isSubmitting}
								placeholder="Entregar en recepción"
							/>
						</div>
					</div>
				</section>

				{/* RESUMEN */}
				<aside className={styles.summaryColumn}>
					<div className={styles.summaryCard}>
						{checkout.items.map((item, index) => (
							<div className={styles.summaryItem} key={item.id + index}>
								<div className={styles.itemThumb}>
									<Image
										src={item.image || '/images/placeholder-product.png'}
										alt={item.name}
										width={133}
										height={133}
										className={styles.img}
									/>
								</div>

								<div className={styles.itemInfo}>
									<p className={styles.itemName} title={item.name}>
										{item.name}
									</p>

									<span className={styles.itemBrand}>{item.brand}</span>

									<div className={styles.itemCounter}>
										<span className={styles.quantityLabel}>Cantidad</span>
										<Counter
											value={item.quantity}
											max={item.stock}
											onChange={(value) => {
												checkout.updateQuantity(item.id, value, {
													maxStock: item.stock,
												})
											}}
											onMinReached={() => checkout.removeItem(item.id)}
											onMaxReached={() => {
												sileo.error({
													title: 'Stock máximo alcanzado',
													description: item.stock
														? `Solo hay ${item.stock} unidades disponibles`
														: 'No hay más unidades disponibles',
												})
											}}
										/>
									</div>
								</div>

								<span className={styles.itemPrice}>
									{formatCurrency(item.unitPrice * item.quantity)}
									<span>MXN</span>
								</span>
							</div>
						))}

						{/*Summary Totals*/}
						<SummaryActions
							subtotal={checkout.total}
							shippingCost={checkout.estimatedShipping}
							shippingLabel={
								checkout.estimatedShipping > 0 ? 'Envío estimado' : 'Selecciona estado'
							}
							grandTotal={checkout.grandTotal}
							showShipping={checkout.deliveryType === 'shipping'}
							paymentMethod={checkout.paymentMethod}
							isFormReady={checkout.isFormReady}
							isSubmitting={isSubmitting}
						/>
					</div>
				</aside>
			</form>

			<ConfirmModal
				isOpen={checkout.showConfirmModal}
				onClose={() => {
					checkout.setShowConfirmModal(false)
					checkout.setPendingFormValues(null)
				}}
				onConfirm={() => {
					if (checkout.pendingFormValues) {
						handleConfirmOrder(checkout.pendingFormValues, () => {
							checkout.setShowConfirmModal(false)
							checkout.setPendingFormValues(null)
						})
					}
				}}
				title={checkout.paymentMethod === 'CARD' ? 'Completar pago' : 'Confirmar pedido'}
				message={
					checkout.paymentMethod === 'CARD' && !checkout.selectedPaymentMethodId ? (
						<div>
							{!isStripeConfigured ? (
								<p style={{ color: 'var(--accent)', marginBottom: '16px' }}>
									Pago con tarjeta no disponible en este momento. Usa transferencia bancaria o contacta soporte.
								</p>
							) : (
								<>
									<p style={{ marginBottom: '16px' }}>
										Ingresa los datos de tu tarjeta para completar el pago.
									</p>

									<Elements stripe={stripePromise}>
										<StripePaymentSection ref={stripePaymentRef} />
									</Elements>
								</>
							)}
							<div className={styles.checkboxField} style={{ marginBottom: '16px' }}>
								<label className={styles.checkboxLabel}>
									<input
										type="checkbox"
										checked={checkout.savePaymentMethod}
										onChange={(event) => checkout.setSavePaymentMethod(event.target.checked)}
										className={styles.checkboxInput}
										disabled={isSubmitting}
									/>
									<span>Guardar este método de pago para futuras compras</span>
								</label>
								<p className={styles.checkboxHint}>
									Si lo marcas, Stripe guardará la tarjeta para usarla después.
								</p>
							</div>
						</div>
					) : (
						'¿Estás seguro de que deseas enviar este pedido? Se te enviará un correo de confirmación.'
					)
				}
				confirmText={checkout.paymentMethod === 'CARD' ? 'Pagar ahora' : 'Enviar pedido'}
				cancelText="Cancelar"
				isLoading={isSubmitting || isProcessingPayment}
			/>

			{/* Payment processing overlay */}
			{isProcessingPayment && paymentLoaderMessage && (
				<PaymentLoader message={paymentLoaderMessage} />
			)}
		</div>
	)
}
