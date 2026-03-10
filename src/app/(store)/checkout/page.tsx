'use client'

import { useMemo, useState, FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './Checkout.module.scss'
import { RequireAuth } from '@/shared/auth/RequireAuth'
import { useCreateOrder } from '@/features/orders/hooks/useOrders'
import {
	PaymentMethod,
	ShippingAddress,
} from '@/features/orders/services/orders.api'
import { useCart } from '@/features/cart/context/CartContext'
import { formatCurrency } from '@/shared/utils/format'
import { Button } from '@/components/Button/Button'

type ShippingOption = {
	id: 'express' | 'standard'
	label: string
	description: string
	cost: number
}

const SHIPPING_OPTIONS: ShippingOption[] = [
	{
		id: 'express',
		label: '1 a 3 días hábiles',
		description: 'Envío prioritario a toda la república mexicana',
		cost: 1200,
	},
	{
		id: 'standard',
		label: '4 a 10 días hábiles',
		description: 'Cobertura nacional con seguimiento en línea',
		cost: 900,
	},
]

function CheckoutForm() {
	const router = useRouter()
	const { items, total } = useCart()
	const { isSubmitting, error, createOrder } = useCreateOrder()

	const [fullName, setFullName] = useState('')
	const [phone, setPhone] = useState('')
	const [line1, setLine1] = useState('')
	const [line2, setLine2] = useState('')
	const [city, setCity] = useState('')
	const [state, setState] = useState('')
	const [postalCode, setPostalCode] = useState('')
	const [country, setCountry] = useState('MX')
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')
	const [notes, setNotes] = useState('')
	const [shipping, setShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0])

	const isCartEmpty = items.length === 0
	const grandTotal = useMemo(
		() => total + (shipping?.cost ?? 0),
		[shipping, total],
	)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isCartEmpty) return

		const shippingAddress: ShippingAddress = {
			full_name: fullName,
			phone,
			line1,
			line2: line2 || undefined,
			city,
			state,
			postal_code: postalCode,
			country: country || undefined,
		}

		const order = await createOrder({
			payment_method: paymentMethod,
			notes: notes || undefined,
			shipping_address: shippingAddress,
		})

		if (order) {
			router.push(`/orders/${order._id}`)
		}
	}

	if (isCartEmpty) {
		return (
			<div className={styles.emptyState}>
				<h2>Tu carrito está vacío</h2>
				<p>Agrega productos para poder completar tu checkout.</p>
				<Link href="/productos" className={styles.payButton}>
					Ver productos
				</Link>
			</div>
		)
	}

	return (
		<div className={styles.checkoutWrapper}>
			<div className={styles.checkoutGrid}>
				<section className={styles.formColumn}>
					<article className={styles.sectionCard}>
						<header className={styles.sectionHeader}>
							<div>
								<p className={styles.sectionSubtitle}>Entrega</p>
							</div>
						</header>

						<form onSubmit={handleSubmit} className={styles.form}>
							<div className={styles.fieldGrid}>
								<div className={styles.field}>
									<label className={styles.label}>Nombre completo *</label>
									<input
										className={styles.input}
										value={fullName}
										onChange={(e) => setFullName(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>
								<div className={styles.field}>
									<label className={styles.label}>Teléfono *</label>
									<input
										className={styles.input}
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>
								<div className={styles.field}>
									<label className={styles.label}>Código Postal *</label>
									<input
										className={styles.input}
										value={postalCode}
										onChange={(e) => setPostalCode(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>
								<div className={styles.field}>
									<label className={styles.label}>Estado *</label>
									<input
										className={styles.input}
										value={state}
										onChange={(e) => setState(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>
								<div className={styles.field}>
									<label className={styles.label}>Ciudad *</label>
									<input
										className={styles.input}
										value={city}
										onChange={(e) => setCity(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>
								<div className={styles.field}>
									<label className={styles.label}>Colonia</label>
									<input
										className={styles.input}
										value={line2}
										onChange={(e) => setLine2(e.target.value)}
										disabled={isSubmitting}
									/>
								</div>
								<div className={styles.field}>
									<label className={styles.label}>Calle *</label>
									<input
										className={styles.input}
										value={line1}
										onChange={(e) => setLine1(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>
								<div className={styles.field}>
									<label className={styles.label}>Número exterior</label>
									<input className={styles.input} disabled={isSubmitting} />
								</div>
								<div className={styles.field}>
									<label className={styles.label}>País</label>
									<input
										className={styles.input}
										value={country}
										onChange={(e) => setCountry(e.target.value)}
										disabled={isSubmitting}
									/>
								</div>
							</div>

							<div className={styles.delivery}>
								<div className={styles.sectionHeader}>
									<div className={styles.top}>
										<p className={styles.sectionSubtitle}>Método de envío</p>
										<span className={styles.sectionTitle}>
											<Image
												src={'/icons/delivery.svg'}
												alt={'delivery'}
												width={24}
												height={24}
											/>
											Envíos a toda la república Mexicana
										</span>
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
											<div className={styles.radioMain}>
												<div className={styles.radioBtn}>
													<div className={styles.radioBtn__inner}></div>
												</div>
												<span>{option.label}</span>
											</div>
											<strong>{formatCurrency(option.cost)}</strong>
										</button>
									))}
								</div>
							</div>

							<div className={styles.sectionHeader}>
								<div className={styles.top}>
									<p className={styles.sectionSubtitle}>Pago</p>
									<span className={styles.sectionTitle}>
										<Image
											src={'/icons/credit-card.svg'}
											alt={'credit-card'}
											width={24}
											height={24}
											className={styles.card_icon}
										/>
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
									<div className={styles.radioMain}>
										<div className={styles.radioBtn}>
											<div className={styles.radioBtn__inner}></div>
										</div>
										<span>Tarjeta de crédito</span>
									</div>
								</button>

								<button
									type="button"
									className={`${styles.radioOption} ${
										paymentMethod === 'TRANSFER' ? styles.active : ''
									}`}
									onClick={() => setPaymentMethod('TRANSFER')}
								>
									<div className={styles.radioMain}>
										<div className={styles.radioBtn}>
											<div className={styles.radioBtn__inner}></div>
										</div>
										<span>Transferencia Bancaria</span>
									</div>
								</button>
							</div>

							<div className={styles.field}>
								<label className={styles.label}>Notas (opcional)</label>
								<textarea
									className={styles.input}
									style={{ minHeight: '120px', resize: 'vertical' }}
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									disabled={isSubmitting}
								/>
							</div>

							{error && (
								<p style={{ color: '#b91c1c', marginTop: '0.5rem' }}>{error}</p>
							)}

							<button
								type="submit"
								className={styles.payButton}
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Generando orden…' : 'Realizar pago'}
							</button>
						</form>
					</article>
				</section>

				<aside className={styles.summaryColumn}>
					<section className={styles.summaryCard}>
						<div className={styles.summaryItems}>
							{items.map((item, index) => (
								<div key={`${item.id}_${index}`} className={styles.summaryItem}>
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
						</div>

						{/*Summary*/}
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
										{formatCurrency(shipping.cost)}
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
							/>
						</div>
					</section>
				</aside>
			</div>
		</div>
	)
}

export default function CheckoutPage() {
	return (
		<RequireAuth>
			<div className={styles.checkoutPage}>
				<CheckoutForm />
			</div>
		</RequireAuth>
	)
}
