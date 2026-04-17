'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ordersApi, type Order } from '@/features/orders/services/orders.api'
import { sileo } from 'sileo'
import Image from 'next/image'
import styles from './OrderDetails.module.scss'
import { Counter } from '@/components/Counter/Counter'
import { useCart } from '@/features/cart/context/CartContext'
import {
	OrderStatusLabel,
	PaymentMethodLabel,
	PaymentStatusLabel,
} from '@/app/(account)/account/_components/OrdersPanel/order'
import { formatCurrency, formatDatePT } from '@/shared/utils/format'

export default function OrderDetailsPage() {
	const params = useParams()
	const router = useRouter()
	const orderId = params.orderId as string
	const { addItem, removeItem, updateQuantity, items: cartItems } = useCart()

	const [order, setOrder] = useState<Order | null>(null)
	const [editableItems, setEditableItems] = useState<Order['items']>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				setIsLoading(true)
				setError(null)
				const { order: fetchedOrder } = await ordersApi.getOrderById(orderId)
				setOrder(fetchedOrder)
				setEditableItems(
					fetchedOrder.items.map((item) => ({
						...item,
					})),
				)
			} catch (err) {
				const message =
					err instanceof Error ? err.message : 'Error al cargar la orden'
				setError(message)
				sileo.error({
					title: 'Error',
					description: message,
				})
			} finally {
				setIsLoading(false)
			}
		}

		if (orderId) {
			fetchOrder()
		}
	}, [orderId])

	useEffect(() => {
		if (order) {
			setEditableItems(
				order.items.map((item) => ({
					...item,
				})),
			)
		}
	}, [order])

	const totalItems = useMemo(
		() =>
			editableItems.reduce(
				(sum: number, item) => sum + (item?.quantity || 0),
				0,
			),
		[editableItems],
	)

	const subtotal = useMemo(
		() =>
			editableItems.reduce(
				(sum: number, item) =>
					sum + (item?.unit_price || 0) * (item?.quantity || 0),
				0,
			),
		[editableItems],
	)

	const shippingCost = (order as any)?.shipping_cost || 0 // eslint-disable-line @typescript-eslint/no-explicit-any
	const total = subtotal + shippingCost

	const handleQuantityChange = (articleId: string, quantity: number) => {
		setEditableItems((prev) =>
			prev.map((item) =>
				item.article_id === articleId ? { ...item, quantity } : item,
			),
		)

		const editableItem = editableItems.find((item) => item.article_id === articleId)
		if (!editableItem) return

		if (quantity <= 0) {
			removeItem(articleId)
			return
		}

		const cartItem = cartItems.find((item) => item.id === articleId)
		if (cartItem) {
			updateQuantity(articleId, quantity)
			return
		}

		addItem(
			{
				id: articleId,
				image: editableItem.article?.image ?? '',
				name: editableItem.article?.description ?? 'Producto',
				brand: editableItem.article?.brand ?? '',
				unitPrice: editableItem.unit_price,
				quantity,
			},
		)
	}

	const handleRemoveItem = (articleId: string) => {
		setEditableItems((prev) => prev.filter((item) => item.article_id !== articleId))
		removeItem(articleId)
	}

	if (isLoading) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>Cargando detalles de la orden...</div>
			</div>
		)
	}

	if (error || !order) {
		return (
			<div className={styles.container}>
				<button className={styles.backButton} onClick={() => router.back()}>
					← Volver
				</button>
				<div className={styles.error}>{error || 'Orden no encontrada'}</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<button className={styles.backButton} onClick={() => router.back()}>
				← Volver
			</button>

			<div className={styles.header}>
				<h1 className={styles.title}>Detalles de la Orden</h1>
				<p className={styles.orderId}>
					Orden #{order._id?.slice(-8).toUpperCase()}
				</p>
			</div>

			<div className={styles.statusSection}>
				<div className={styles.statusCard}>
					<span className={styles.label}>Estado de la Orden</span>
					<span className={styles.status}>
						{OrderStatusLabel[order.status]}
					</span>
				</div>
				<div className={styles.statusCard}>
					<span className={styles.label}>Estado de Pago</span>
					<span className={styles.status}>
						{PaymentStatusLabel[order.payment_status]}
					</span>
				</div>
				<div className={styles.statusCard}>
					<span className={styles.label}>Método de Pago</span>
					<span className={styles.status}>
						{PaymentMethodLabel[order.payment_method]}
					</span>
				</div>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>Información de la Orden</h2>
				<div className={styles.infoGrid}>
					<div className={styles.infoItem}>
						<span className={styles.label}>Fecha de Creación</span>
						<span className={styles.value}>
							{formatDatePT(order.created_at)}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>Última Actualización</span>
						<span className={styles.value}>
							{formatDatePT(order.updated_at)}
						</span>
					</div>
					{order.shipping_address && (
						<div className={styles.infoItem}>
							<span className={styles.label}>Dirección de Envío</span>
							<span className={styles.value}>
								{order.shipping_address.line1}
								{order.shipping_address.line2 &&
									`, ${order.shipping_address.line2}`}
								<br />
								{order.shipping_address.city}, {order.shipping_address.state}
								<br />
								{order.shipping_address.postal_code}
							</span>
						</div>
					)}
				</div>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>Productos ({totalItems})</h2>
				<div className={styles.itemsList}>
					{editableItems.length > 0 ? (
						editableItems.map((item) => {
							const article = item.article
							return (
								<div key={item.article_id} className={styles.itemCard}>
									{article?.image && (
										<div className={styles.itemImage}>
											<Image
												src={article.image}
												alt={article.description || 'Producto'}
												width={100}
												height={100}
												objectFit="cover"
											/>
										</div>
									)}
									<div className={styles.itemDetails}>
										<h3 className={styles.itemName}>
											{article?.description || 'Producto'}
										</h3>
										{article?.brand && (
											<p className={styles.itemBrand}>{article.brand}</p>
										)}
										<p className={styles.itemPrice}>
											{formatCurrency(item.unit_price)} x {item.quantity}
										</p>
										<div className={styles.itemCounter}>
											<span className={styles.quantityLabel}>Cantidad</span>
											<Counter
												value={item.quantity}
												onChange={(value) =>
													handleQuantityChange(item.article_id, value)
												}
												onMinReached={() => handleRemoveItem(item.article_id)}
											/>
										</div>
									</div>
									<div className={styles.itemTotal}>
										<span className={styles.totalPrice}>
											{formatCurrency(item.unit_price * item.quantity)}
										</span>
									</div>
								</div>
							)
						})
					) : (
						<p className={styles.empty}>No hay productos en esta orden</p>
					)}
				</div>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>Resumen de Pago</h2>
				<div className={styles.summaryGrid}>
					<div className={styles.summaryRow}>
						<span className={styles.label}>Subtotal</span>
						<span className={styles.value}>{formatCurrency(subtotal)}</span>
					</div>
					{shippingCost > 0 && (
						<div className={styles.summaryRow}>
							<span className={styles.label}>Envío</span>
							<span className={styles.value}>
								{formatCurrency(shippingCost)}
							</span>
						</div>
					)}
					<div className={`${styles.summaryRow} ${styles.total}`}>
						<span className={styles.label}>Total</span>
						<span className={styles.value}>{formatCurrency(total)}</span>
					</div>
				</div>
			</div>

			{order.notes && (
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>Notas</h2>
					<p className={styles.notes}>{order.notes}</p>
				</div>
			)}
		</div>
	)
}
