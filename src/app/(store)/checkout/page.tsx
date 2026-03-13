'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { sileo } from 'sileo'
import styles from './Checkout.module.scss'
import {
	useCreateOrder,
	useShippingAddresses,
} from '@/features/orders/hooks/useOrders'
import { PaymentMethod } from '@/features/orders/services/orders.api'
import { useCart } from '@/features/cart/context/CartContext'
import { formatCurrency } from '@/shared/utils/format'
import { useForm } from 'react-hook-form'
import { ShippingAddressSelector } from './_components/ShippingAddressSelector/ShippingAddressSelector'
import { NewAddressForm } from './_components/NewAddressForm/NewAddressForm'
import { PaymentMethodControls } from './_components/PaymentMethodControls/PaymentMethodControls'
import { SummaryActions } from './_components/SummaryActions/SummaryActions'
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal'
import { useAuth } from '@/shared/auth/AuthProvider'

type DeliveryType = 'shipping' | 'pickup'

type ShippingOption = {
	id: 'express' | 'standard'
	label: string
	cost: number
}

const SHIPPING_OPTIONS: ShippingOption[] = [
	{
		id: 'express',
		label: '1 a 3 días hábiles',
		cost: 1200,
	},
	{
		id: 'standard',
		label: '4 a 10 días hábiles',
		cost: 900,
	},
]

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
	const { items, total, clearCart } = useCart()
	const { createOrder, isSubmitting } = useCreateOrder()
	const {
		addresses,
		isLoading: isLoadingAddresses,
		fetchAddresses,
	} = useShippingAddresses()

	const [deliveryType, setDeliveryType] = useState<DeliveryType>('shipping')
	const [selectedAddressIndex, setSelectedAddressIndex] = useState<
		number | 'new'
	>('new')

	const [pickupLocation, setPickupLocation] = useState<string>('mxli')
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')
	const [cardForm, setCardForm] = useState({
		number: '',
		holder: '',
		expiry: '',
		cvv: '',
	})

	const [shipping, setShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0])
	const [showConfirmModal, setShowConfirmModal] = useState(false)

	const handleCardFormChange = (
		field: keyof typeof cardForm,
		value: string,
	) => {
		setCardForm((prev) => ({ ...prev, [field]: value }))
	}

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
				description: 'Debes verificar tu correo electrónico para poder realizar compras.',
			})
			router.push('/account')
			return
		}
	}, [accessToken, user, isBootstrapping, router])

	useEffect(() => {
		fetchAddresses()
	}, [fetchAddresses])

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
		() => total + (deliveryType === 'shipping' ? shipping.cost : 0),
		[total, shipping, deliveryType],
	)

	const isFormReady = useMemo(() => {
		const { number, holder, expiry, cvv } = cardForm
		const isCardValid =
			paymentMethod !== 'CARD' || Boolean(number && holder && expiry && cvv)
		let isAddressValid = false
		if (deliveryType === 'pickup') {
			isAddressValid = true
		} else if (selectedAddressIndex !== 'new') {
			isAddressValid = true
		} else {
			isAddressValid = isValid
		}
		return isCardValid && isAddressValid
	}, [deliveryType, selectedAddressIndex, isValid, paymentMethod, cardForm])

	const [pendingFormValues, setPendingFormValues] = useState<CheckoutFormValues | null>(null)

	const onSubmit = handleSubmit(async (values) => {
		setPendingFormValues(values)
		setShowConfirmModal(true)
	})

	const handleConfirmOrder = async () => {
		if (!pendingFormValues) return
		const values = pendingFormValues

		try {
			const payload: Parameters<typeof createOrder>[0] = {
				payment_method: paymentMethod,
				notes: values.notes,
				delivery_type: deliveryType,
			}

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

			const order = await createOrder(payload)
			if (order) {
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
			} else {
				sileo.error({
					title: 'Error al crear el pedido',
					description: 'No se pudo crear el pedido. Intenta nuevamente.',
				})
			}
		} catch (error) {
			console.error('Error creating order:', error)
			sileo.error({
				title: 'Error al procesar tu pedido',
				description: 'Ocurrió un error inesperado. Intenta nuevamente.',
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

						{/* MÉTODO ENVÍO */}
						{deliveryType === 'shipping' && (
							<div className={styles.section}>
								<div className={styles.sectionHeader}>
									<p className={styles.sectionSubtitle}>Método de envío</p>

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

								<div className={styles.radioGroup}>
									{SHIPPING_OPTIONS.map((option) => (
										<button
											type="button"
											key={option.id}
											className={`${styles.radioOption} ${
												option.id === shipping.id ? styles.active : ''
											}`}
											onClick={() => setShipping(option)}
										>
											<div className={styles.left}>
												<div className={styles.radioBtn}>
													<div className={styles.radioBtn__inner}></div>
												</div>
												{option.label}
											</div>

											<strong>{formatCurrency(option.cost)}</strong>
										</button>
									))}
								</div>
							</div>
						)}

						{/* PAGO */}
						<PaymentMethodControls
							paymentMethod={paymentMethod}
							onPaymentMethodChange={setPaymentMethod}
							cardForm={cardForm}
							onCardFormChange={handleCardFormChange}
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

									<div className={styles.itemBadge}>{item.quantity}</div>
								</div>

								<div className={styles.itemInfo}>
									<p className={styles.itemName} title={item.name}>
										{item.name}
									</p>

									<span className={styles.itemBrand}>{item.brand}</span>
								</div>

								<span className={styles.itemPrice}>
									{formatCurrency(item.unitPrice)}
									<span>MXN</span>
								</span>
							</div>
						))}

						{/*Summary Totals*/}
						<SummaryActions
							subtotal={total}
							shippingCost={shipping.cost}
							shippingLabel={shipping.label}
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
				onClose={() => setShowConfirmModal(false)}
				onConfirm={handleConfirmOrder}
				title="Confirmar pedido"
				message="¿Estás seguro de que deseas enviar este pedido? Se te enviará un correo de confirmación."
				confirmText="Enviar pedido"
				cancelText="Cancelar"
				isLoading={isSubmitting}
			/>
		</div>
	)
}
