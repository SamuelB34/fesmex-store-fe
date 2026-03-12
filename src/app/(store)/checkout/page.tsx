'use client'

import { useMemo, useState, FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './Checkout.module.scss'
import { useCreateOrder } from '@/features/orders/hooks/useOrders'
import {
	PaymentMethod,
	ShippingAddress,
} from '@/features/orders/services/orders.api'
import { useCart } from '@/features/cart/context/CartContext'
import { formatCurrency } from '@/shared/utils/format'
import { Button } from '@/components/Button/Button'

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
		address: 'Av. Lázaro Cárdenas #1234',
		delivery: 'ENTREGA INMEDIATA',
	},
	{
		id: 'qro',
		name: 'Almacén Querétaro',
		address: 'Av. Lázaro Cárdenas #1234',
		delivery: 'ENTREGA EN 1 DÍA HÁBIL',
	},
	{
		id: 'puebla',
		name: 'Almacén Puebla',
		address: 'Av. Lázaro Cárdenas #1234',
		delivery: 'ENTREGA EN 2 DÍAS HÁBILES',
	},
]

export default function CheckoutForm() {
	const router = useRouter()
	const { items, total } = useCart()
	const { createOrder, isSubmitting } = useCreateOrder()

	const [deliveryType, setDeliveryType] = useState<DeliveryType>('shipping')

	const [pickupLocation, setPickupLocation] = useState<string>('mxli')

	const [fullName, setFullName] = useState('')
	const [phone, setPhone] = useState('')
	const [line1, setLine1] = useState('')
	const [line2, setLine2] = useState('')
	const [city, setCity] = useState('')
	const [state, setState] = useState('')
	const [postalCode, setPostalCode] = useState('')

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')

	const [notes, setNotes] = useState('')

	const [shipping, setShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0])

	const grandTotal = useMemo(
		() => total + (deliveryType === 'shipping' ? shipping.cost : 0),
		[total, shipping, deliveryType],
	)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const shippingAddress: ShippingAddress = {
			full_name: fullName,
			phone,
			line1,
			line2,
			city,
			state,
			postal_code: postalCode,
			country: 'MX',
		}

		const order = await createOrder({
			payment_method: paymentMethod,
			notes,
			shipping_address:
				deliveryType === 'shipping' ? shippingAddress : undefined,
		})

		if (order) router.push(`/orders/${order._id}`)
	}

	return (
		<div className={styles.checkoutWrapper}>
			<form onSubmit={handleSubmit} className={styles.checkoutGrid}>
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
								<div className={styles.fieldGrid}>
									<input
										className={styles.input}
										placeholder="Código Postal"
										value={postalCode}
										onChange={(e) => setPostalCode(e.target.value)}
									/>

									<input
										className={styles.input}
										placeholder="Calle"
										value={line1}
										onChange={(e) => setLine1(e.target.value)}
									/>

									<input
										className={styles.input}
										placeholder="Número exterior"
									/>

									<input
										className={styles.input}
										placeholder="Colonia"
										value={line2}
										onChange={(e) => setLine2(e.target.value)}
									/>

									<input
										className={styles.input}
										placeholder="Ciudad"
										value={city}
										onChange={(e) => setCity(e.target.value)}
									/>

									<input
										className={styles.input}
										placeholder="Estado"
										value={state}
										onChange={(e) => setState(e.target.value)}
									/>
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
									onClick={() => setPaymentMethod('CARD')}
								>
									<div className={styles.left}>
										<div className={styles.radioBtn}>
											<div className={styles.radioBtn__inner}></div>
										</div>
										Tarjeta de Crédito
									</div>
								</button>

								{paymentMethod === 'CARD' && (
									<div className={styles.cardForm}>
										<div className={styles.fieldGrid__input}>
											<span>Número de la tarjeta</span>
											<input
												className={styles.input}
												placeholder="Nombre del titular"
											/>
										</div>

										<div className={styles.fieldGrid__input}>
											<span>Nombre del titular</span>
											<input
												className={styles.input}
												placeholder="Número de tarjeta"
											/>
										</div>

										<div className={styles.fieldGrid}>
											<div className={styles.fieldGrid__input}>
												<span>Vigencia</span>
												<input className={styles.input} placeholder="MM/AA" />
											</div>
											<div className={styles.fieldGrid__input}>
												<span>Código de Seguridad</span>
												<input className={styles.input} placeholder="CVV" />
											</div>
										</div>
									</div>
								)}

								<button
									type="button"
									className={`${styles.radioOption} ${
										paymentMethod === 'TRANSFER' ? styles.active : ''
									}`}
									onClick={() => setPaymentMethod('TRANSFER')}
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
									Al seleccionar transferencia bancaria, el pedido será generado
									y enviado a nuestro equipo para confirmar datos bancarios.
									<span>
										Posteriormente en breve nos pondremos en contacto contigo
										para proporcionarte los datos bancarios y dar seguimiento al
										pago al correo que designaste de <b>contacto</b>.
									</span>
								</div>
							)}
						</div>

						{/* NOTAS */}

						<div className={styles.section}>
							<h2>Instrucciones especiales</h2>

							<textarea
								className={styles.input}
								rows={5}
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
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
						<div className={styles.summaryTotals}>
							<div className={styles.top_price}>
								<div className={styles.totalRow}>
									<span className={styles.label}>Subtotal</span>
									<span className={styles.price}>
										{formatCurrency(total)}{' '}
										<span className={styles.label}>MXN</span>
									</span>
								</div>

								<div className={styles.totalRow}>
									<span className={styles.label}>Envío</span>
									<span className={styles.price}>
										<span className={styles.label}>{shipping.label}</span>{' '}
										{formatCurrency(shipping.cost)}{' '}
										<span className={styles.label}>MXN</span>
									</span>
								</div>
							</div>

							<div className={styles.totalRow}>
								<strong>Total</strong>
								<strong>
									{formatCurrency(grandTotal)}{' '}
									<span className={styles.label}>MXN</span>
								</strong>
							</div>

							<Button
								leftIcon={
									<Image
										src={'/icons/credit-card.svg'}
										alt={'credit-card'}
										width={24}
										height={24}
										className={styles.icon}
									/>
								}
								filled={false}
								text={'Realizar Pago'}
								type={'submit'}
							/>
						</div>
					</div>
				</aside>
			</form>
		</div>
	)
}
