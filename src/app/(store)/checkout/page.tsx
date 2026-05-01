'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { sileo } from 'sileo'
import { Elements } from '@stripe/react-stripe-js'
import styles from './Checkout.module.scss'
import { Counter } from '@/components/Counter/Counter'
import {
	useCreateOrder,
	useShippingAddresses,
} from '@/features/orders/hooks/useOrders'
import { PaymentMethod, ordersApi } from '@/features/orders/services/orders.api'
import { useCart } from '@/features/cart/context/CartContext'
import { formatCurrency } from '@/shared/utils/format'
import { useForm } from 'react-hook-form'
import { ShippingAddressSelector } from './_components/ShippingAddressSelector/ShippingAddressSelector'
import { NewAddressForm } from './_components/NewAddressForm/NewAddressForm'
import { PaymentMethodControls } from './_components/PaymentMethodControls/PaymentMethodControls'
import { SummaryActions } from './_components/SummaryActions/SummaryActions'
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal'
import { useAuth } from '@/shared/auth/AuthProvider'
import { stripePromise } from '@/lib/stripe'
import {
	StripePaymentSection,
	type StripePaymentSectionRef,
	type PaymentErrorType,
} from './_components/StripePaymentSection/StripePaymentSection'
import { PaymentLoader } from '@/components/PaymentLoader/PaymentLoader'
import { useShippingStates } from '@/features/shipping'

type DeliveryType = 'shipping' | 'pickup'

const PICKUP_LOCATIONS = [
	{
		id: 'mxli',
		name: 'Almacén Mexicali',
		address:
			'Blvd. Adolfo López Mateos 2292-4, Zona Industrial, 21389 Mexicali, B.C.',
		delivery: 'ENTREGA INMEDIATA',
	},
]

type CheckoutFormValues = {
	fullName: string
	phone: string
	line1: string
	line2: string
	city: string
	state: string
	postalCode: string
	notes: string
}

export default function CheckoutForm() {
	const router = useRouter()
	const { user, accessToken, isBootstrapping } = useAuth()
	const { items, total, clearCart, updateQuantity, removeItem } = useCart()
	const { createOrder, isSubmitting } = useCreateOrder()
	const {
		addresses,
		isLoading: isLoadingAddresses,
		fetchAddresses,
	} = useShippingAddresses()
	const {
		stateOptions,
		isLoading: isLoadingStates,
		getStateByName,
		calculateShipping,
	} = useShippingStates()

	const [deliveryType, setDeliveryType] = useState<DeliveryType>('shipping')
	const [selectedAddressIndex, setSelectedAddressIndex] = useState<
		number | 'new'
	>('new')

	const [pickupLocation, setPickupLocation] = useState<string>('mxli')
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')
	const [estimatedShipping, setEstimatedShipping] = useState<number>(0)
	const [selectedStateId, setSelectedStateId] = useState<string>('')
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [isProcessingPayment, setIsProcessingPayment] = useState(false)
	const [paymentLoaderMessage, setPaymentLoaderMessage] = useState('')
	const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
		string | null
	>(null)
	const confirmOrderLockRef = useRef(false)

	// Stripe Elements ref
	const stripePaymentRef = useRef<StripePaymentSectionRef>(null)

	// Redirect if not logged in or account not verified
	useEffect(() => {
		if (isBootstrapping) return

		if (!accessToken) {
			sileo.error({
				title: 'Inicia sesión',
				description: 'Debes iniciar sesión para continuar con tu compra.',
			})
			router.push('/')
			return
		}

		if (user?.status !== 'active') {
			sileo.error({
				title: 'Cuenta no verificada',
				description:
					'Debes verificar tu correo electrónico para poder realizar compras.',
			})
			router.push('/account')
			return
		}
	}, [accessToken, user, isBootstrapping, router])

	useEffect(() => {
		fetchAddresses()
	}, [fetchAddresses])

	// Reset selected payment method when payment method changes
	useEffect(() => {
		setSelectedPaymentMethodId(null)
	}, [paymentMethod])

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<CheckoutFormValues>({
		mode: 'onChange',
		defaultValues: {
			fullName: '',
			phone: '',
			line1: '',
			line2: '',
			city: '',
			state: '',
			postalCode: '',
			notes: '',
		},
	})

	const grandTotal = useMemo(
		() => total + (deliveryType === 'shipping' ? estimatedShipping : 0),
		[total, estimatedShipping, deliveryType],
	)

	const grandTotalInCents = useMemo(
		() => Math.max(Math.round(grandTotal * 100), 0),
		[grandTotal],
	)

	const stripeElementsOptions = useMemo(
		() => ({
			mode: 'payment' as const,
			amount: grandTotalInCents,
			currency: 'mxn' as const,
			paymentMethodCreation: 'manual' as const,
			appearance: {
				theme: 'stripe' as const,
				variables: {
					colorPrimary: '#0066cc',
				},
			},
		}),
		[grandTotalInCents],
	)

	const isFormReady = useMemo(() => {
		// Card validation happens in modal, so form is ready based on address only
		let isAddressValid = false
		if (deliveryType === 'pickup') {
			isAddressValid = true
		} else if (selectedAddressIndex !== 'new') {
			// For existing address, check if we have a valid state
			const addr = addresses[selectedAddressIndex]
			isAddressValid = Boolean(addr)
		} else {
			// For new address, form must be valid AND state must be selected
			isAddressValid = isValid && Boolean(selectedStateId)
		}
		return isAddressValid
	}, [deliveryType, selectedAddressIndex, isValid, selectedStateId, addresses])

	// Handle state change from NewAddressForm
	const handleNewAddressStateChange = (stateId: string) => {
		setSelectedStateId(stateId)
		const newShipping = calculateShipping(stateId, total)
		setEstimatedShipping(newShipping)
	}

	useEffect(() => {
		if (deliveryType !== 'shipping' || !selectedStateId) return

		const newShipping = calculateShipping(selectedStateId, total)
		setEstimatedShipping(newShipping)
	}, [deliveryType, selectedStateId, total, calculateShipping])

	// Handle existing address selection - recalculate shipping based on address state
	useEffect(() => {
		if (selectedAddressIndex !== 'new' && addresses[selectedAddressIndex]) {
			const addr = addresses[selectedAddressIndex]
			const state = getStateByName(addr.state)
			if (state) {
				setSelectedStateId(state._id)
				const newShipping = calculateShipping(state._id, total)
				setEstimatedShipping(newShipping)
			} else {
				console.warn(`State not found for address: ${addr.state}`)
				setSelectedStateId('')
				setEstimatedShipping(0)
			}
		} else if (selectedAddressIndex === 'new') {
			// Reset when switching to new address
			setSelectedStateId('')
			setEstimatedShipping(0)
		}
	}, [
		selectedAddressIndex,
		addresses,
		getStateByName,
		calculateShipping,
		total,
	])

	const [pendingFormValues, setPendingFormValues] =
		useState<CheckoutFormValues | null>(null)

	// Step 1: User submits form -> open confirmation modal.
	// The order is created only when the user confirms payment.
	const onSubmit = handleSubmit(async (values) => {
		if (paymentMethod === 'CARD') {
			setPendingFormValues(values)
			setShowConfirmModal(true)
		} else {
			// For TRANSFER, show confirm modal directly
			setPendingFormValues(values)
			setShowConfirmModal(true)
		}
	})

	// Build order payload from form values
	const buildOrderPayload = (values: CheckoutFormValues) => {
		const payload: Parameters<typeof createOrder>[0] = {
			payment_method: paymentMethod,
			notes: values.notes,
			delivery_type: deliveryType,
			...(paymentMethod === 'CARD' ? { save_payment_method: true } : {}),
			...(selectedPaymentMethodId
				? { provider_payment_method_id: selectedPaymentMethodId }
				: {}),
		}
		console.log('📦 Order payload:', payload)

		if (deliveryType === 'shipping') {
			if (selectedAddressIndex !== 'new' && addresses[selectedAddressIndex]) {
				payload.shipping_address = addresses[selectedAddressIndex]
			} else {
				payload.shipping_address = {
					full_name: values.fullName,
					phone: values.phone,
					line1: values.line1,
					line2: values.line2,
					city: values.city,
					state: values.state,
					postal_code: values.postalCode,
					country: 'MX',
				}
			}
		}

		return payload
	}

	// Step 2: User confirms -> create order and then confirm payment for CARD,
	// or create order directly for TRANSFER.
	const handleConfirmOrder = async () => {
		if (!pendingFormValues) return
		if (confirmOrderLockRef.current) return
		const values = pendingFormValues
		confirmOrderLockRef.current = true

		try {
			setIsProcessingPayment(true)
			setPaymentLoaderMessage(
				paymentMethod === 'CARD' ? 'Procesando pago...' : 'Procesando pedido...',
			)

			if (paymentMethod === 'CARD') {
				const paymentMethodId = selectedPaymentMethodId
				const paymentRef = stripePaymentRef.current

				if (!paymentMethodId && !paymentRef) {
					sileo.error({
						title: 'Error de pago',
						description: 'Stripe no está disponible. Recarga la página.',
					})
					return
				}

				if (!paymentMethodId) {
					const validation = await paymentRef!.validatePaymentDetails()
					if (!validation.success) {
						handlePaymentError(validation.errorType, validation.error)
						return
					}
				}

				const payload = buildOrderPayload(values)
				const result = await createOrder(payload)

				if (!result) {
					sileo.error({
						title: 'Error al crear el pedido',
						description: 'No se pudo crear el pedido. Intenta nuevamente.',
					})
					return
				}

				const { order, paymentIntent } = result

				if (paymentMethodId) {
					console.log('💳 Using saved payment method - backend already confirmed it')
				} else {
					if (!paymentIntent?.client_secret) {
						sileo.error({
							title: 'Error de pago',
							description: 'No se pudo inicializar el pago.',
						})
						return
					}

					const { success, errorType, error, intentStatus } =
						await paymentRef!.confirmPayment(
							paymentIntent.client_secret,
						)

					if (!success) {
						handlePaymentError(errorType, error)
						return
					}

					if (intentStatus) {
						console.log(`Payment intent status: ${intentStatus}`)
					}
				}

				// Poll backend until payment_status = PAID (webhook processed)
				setPaymentLoaderMessage('Verificando pago...')

				const maxAttempts = 10
				let attempts = 0
				let isPaid = false

				while (attempts < maxAttempts && !isPaid) {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					try {
						const { order: updatedOrder } = await ordersApi.getOrderById(
							order._id,
						)
						if (updatedOrder.payment_status === 'PAID') {
							isPaid = true
						}
					} catch {
						// Continue polling
					}
					attempts++
				}

				if (!isPaid) {
					console.warn('Payment confirmed but webhook not yet processed')
				}
			} else {
				// TRANSFER: create order now
				const payload = buildOrderPayload(values)
				const result = await createOrder(payload)

				if (!result) {
					sileo.error({
						title: 'Error al crear el pedido',
						description: 'No se pudo crear el pedido. Intenta nuevamente.',
					})
					return
				}
			}

			// Clear cart only after payment confirmed
			clearCart()

			sileo.success({
				title: '¡Pedido creado exitosamente!',
				description: 'Se te enviará un correo de confirmación',
			})
			setShowConfirmModal(false)
			setPendingFormValues(null)
			setTimeout(() => {
				router.push('/account?tab=orders')
			}, 500)
		} catch (error) {
			console.error('Error creating order:', error)
			sileo.error({
				title: 'Error al procesar tu pedido',
				description: 'Ocurrió un error inesperado. Intenta nuevamente.',
			})
		} finally {
			confirmOrderLockRef.current = false
			setIsProcessingPayment(false)
			setPaymentLoaderMessage('')
		}
	}

	// Handle payment errors with appropriate sileo notifications
	const handlePaymentError = (
		errorType?: PaymentErrorType,
		errorMessage?: string,
	) => {
		if (errorType === 'declined') {
			sileo.error({
				title: 'Pago rechazado',
				description: 'Tu banco rechazó la operación. Intenta nuevamente.',
			})
		} else if (errorType === 'canceled') {
			sileo.warning({
				title: 'Autenticación cancelada',
				description: 'No se completó la verificación bancaria.',
			})
		} else {
			sileo.error({
				title: 'Error en el pago',
				description: errorMessage || 'No se pudo procesar el pago.',
			})
		}
	}

	return (
		<div className={styles.checkoutWrapper}>
			<form onSubmit={onSubmit} className={styles.checkoutGrid}>
				<section className={styles.formColumn}>
					<div className={styles.form}>
						{/* ENTREGA */}
						<div className={styles.section}>
							<div className={styles.sectionHeader}>
								<h2>Entrega</h2>

								<div className={styles.deliveryToggle}>
									<button
										type="button"
										className={deliveryType === 'shipping' ? styles.active : ''}
										onClick={() => setDeliveryType('shipping')}
									>
										Envío por flete
									</button>

									<button
										type="button"
										className={deliveryType === 'pickup' ? styles.active : ''}
										onClick={() => setDeliveryType('pickup')}
									>
										Recoger en almacén
									</button>
								</div>
							</div>

							{/* DIRECCIÓN */}
							{deliveryType === 'shipping' && (
								<div className={styles.radioGroup}>
									<ShippingAddressSelector
										addresses={addresses}
										isLoading={isLoadingAddresses}
										selectedIndex={selectedAddressIndex}
										onSelectAddress={setSelectedAddressIndex}
									/>

									{selectedAddressIndex === 'new' && (
										<NewAddressForm
											register={register}
											errors={errors}
											isRequired={selectedAddressIndex === 'new'}
											stateOptions={stateOptions}
											isLoadingStates={isLoadingStates}
											onStateChange={handleNewAddressStateChange}
										/>
									)}
								</div>
							)}

							{/* PICKUP */}

							{deliveryType === 'pickup' && (
								<div className={styles.pickupList}>
									{PICKUP_LOCATIONS.map((loc) => (
										<button
											key={loc.id}
											type="button"
											className={`${styles.pickupOption} ${
												pickupLocation === loc.id ? styles.active : ''
											}`}
											onClick={() => setPickupLocation(loc.id)}
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
						{deliveryType === 'shipping' && (
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
									{estimatedShipping > 0 ? (
										<>
											<p className={styles.shippingCost}>
												Envío estimado:{' '}
												<strong>{formatCurrency(estimatedShipping)}</strong>
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
							paymentMethod={paymentMethod}
							onPaymentMethodChange={setPaymentMethod}
							selectedPaymentMethodId={selectedPaymentMethodId}
							onSelectPaymentMethod={setSelectedPaymentMethodId}
						/>

						{/* NOTAS */}
						<div className={styles.field}>
							<label className={styles.label}>Notas (opcional)</label>
							<textarea
								className={styles.input}
								style={{ minHeight: '120px', resize: 'none' }}
								{...register('notes')}
								disabled={isSubmitting}
								placeholder="Entregar en recepción"
							/>
						</div>
					</div>
				</section>

				{/* RESUMEN */}
				<aside className={styles.summaryColumn}>
					<div className={styles.summaryCard}>
						{items.map((item, index) => (
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
												updateQuantity(item.id, value, {
													maxStock: item.stock,
												})
											}}
											onMinReached={() => removeItem(item.id)}
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
							subtotal={total}
							shippingCost={estimatedShipping}
							shippingLabel={
								estimatedShipping > 0 ? 'Envío estimado' : 'Selecciona estado'
							}
							grandTotal={grandTotal}
							showShipping={deliveryType === 'shipping'}
							paymentMethod={paymentMethod}
							isFormReady={isFormReady}
							isSubmitting={isSubmitting}
						/>
					</div>
				</aside>
			</form>

			<ConfirmModal
				isOpen={showConfirmModal}
				onClose={() => {
					setShowConfirmModal(false)
					setPendingFormValues(null)
				}}
				onConfirm={handleConfirmOrder}
				title={paymentMethod === 'CARD' ? 'Completar pago' : 'Confirmar pedido'}
				message={
					paymentMethod === 'CARD' && !selectedPaymentMethodId ? (
						<div>
							<p style={{ marginBottom: '16px' }}>
								Ingresa los datos de tu tarjeta para completar el pago.
							</p>
							{/* Deferred Stripe Elements: the PaymentIntent is created on confirm */}
							<Elements
								stripe={stripePromise}
								options={stripeElementsOptions}
							>
								<StripePaymentSection ref={stripePaymentRef} />
							</Elements>
						</div>
					) : (
						'¿Estás seguro de que deseas enviar este pedido? Se te enviará un correo de confirmación.'
					)
				}
				confirmText={paymentMethod === 'CARD' ? 'Pagar ahora' : 'Enviar pedido'}
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
