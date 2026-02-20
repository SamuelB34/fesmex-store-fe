'use client'

import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { RequireAuth } from '@/shared/auth/RequireAuth'
import { useOrderDetail } from '@/features/orders/hooks/useOrders'

const statusColors: Record<string, string> = {
	pending: '#ffc107',
	confirmed: '#17a2b8',
	shipped: '#007bff',
	cancelled: '#dc3545',
	completed: '#28a745',
}

const paymentStatusColors: Record<string, string> = {
	UNPAID: '#dc3545',
	PENDING_TRANSFER: '#ffc107',
	PAID: '#28a745',
	REFUNDED: '#6c757d',
}

const sectionStyle: React.CSSProperties = {
	border: '1px solid #ddd',
	borderRadius: '8px',
	padding: '1.25rem',
	background: 'white',
	marginBottom: '1rem',
}

const labelStyle: React.CSSProperties = {
	fontSize: '0.75rem',
	color: '#888',
	textTransform: 'uppercase',
	letterSpacing: '0.05em',
	marginBottom: '0.25rem',
}

function OrderDetailContent() {
	const params = useParams()
	const orderId = params.id as string
	const { order, isLoading, error, fetchOrder, updateShippingFee } =
		useOrderDetail()

	const [shippingFeeInput, setShippingFeeInput] = useState('')
	const [isUpdatingFee, setIsUpdatingFee] = useState(false)
	const [lastOrderId, setLastOrderId] = useState<string | null>(null)

	useEffect(() => {
		if (orderId) {
			fetchOrder(orderId)
		}
	}, [orderId, fetchOrder])

	if (order && order._id !== lastOrderId) {
		setShippingFeeInput(String(order.shipping_fee))
		setLastOrderId(order._id)
	}

	const handleUpdateShippingFee = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const fee = parseFloat(shippingFeeInput)
		if (isNaN(fee) || fee < 0) return
		setIsUpdatingFee(true)
		await updateShippingFee(orderId, { shipping_fee: fee })
		setIsUpdatingFee(false)
	}

	if (isLoading) {
		return (
			<p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
				Loading order...
			</p>
		)
	}

	if (error) {
		return (
			<div
				style={{
					padding: '0.75rem',
					backgroundColor: '#fee',
					color: '#c33',
					borderRadius: '4px',
					fontSize: '0.875rem',
				}}
			>
				{error}
			</div>
		)
	}

	if (!order) {
		return (
			<p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
				Order not found.
			</p>
		)
	}

	return (
		<div>
			<nav
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '1rem 0',
					borderBottom: '1px solid #ddd',
					marginBottom: '1.5rem',
				}}
			>
				<Link
					href="/"
					style={{ fontSize: '1.25rem', fontWeight: 700, color: '#007bff' }}
				>
					FESMEX Store
				</Link>
				<div style={{ display: 'flex', gap: '1.5rem' }}>
					<Link href="/">Articles</Link>
					<Link href="/cart">Cart</Link>
					<Link href="/orders">Orders</Link>
					<Link href="/account">Account</Link>
				</div>
			</nav>

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '1.5rem',
				}}
			>
				<div>
					<h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#333' }}>
						Order #{order._id.slice(-8)}
					</h1>
					<p style={{ fontSize: '0.8125rem', color: '#999' }}>
						Created {new Date(order.created_at).toLocaleString()}
					</p>
				</div>
				<div style={{ display: 'flex', gap: '0.5rem' }}>
					<span
						style={{
							padding: '0.375rem 0.75rem',
							borderRadius: '12px',
							fontSize: '0.75rem',
							fontWeight: 600,
							color: 'white',
							backgroundColor: statusColors[order.status] ?? '#6c757d',
							textTransform: 'uppercase',
						}}
					>
						{order.status}
					</span>
					<span
						style={{
							padding: '0.375rem 0.75rem',
							borderRadius: '12px',
							fontSize: '0.75rem',
							fontWeight: 600,
							color: 'white',
							backgroundColor:
								paymentStatusColors[order.payment_status] ?? '#6c757d',
						}}
					>
						{order.payment_status}
					</span>
				</div>
			</div>

			<div style={sectionStyle}>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: '#333',
					}}
				>
					Items
				</h2>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
							<th style={{ padding: '0.5rem', color: '#333' }}>Article</th>
							<th style={{ padding: '0.5rem', color: '#333' }}>Qty</th>
							<th style={{ padding: '0.5rem', color: '#333' }}>Unit Price</th>
							<th
								style={{ padding: '0.5rem', textAlign: 'right', color: '#333' }}
							>
								Total
							</th>
						</tr>
					</thead>
					<tbody>
						{order.items.map((item, idx) => (
							<tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
								<td
									style={{
										padding: '0.5rem',
										fontSize: '0.875rem',
										color: '#333',
									}}
								>
									{item.article_id}
								</td>
								<td
									style={{
										padding: '0.5rem',
										fontSize: '0.875rem',
										color: '#333',
									}}
								>
									{item.quantity}
								</td>
								<td
									style={{
										padding: '0.5rem',
										fontSize: '0.875rem',
										color: '#333',
									}}
								>
									${item.unit_price.toFixed(2)}
								</td>
								<td
									style={{
										padding: '0.5rem',
										fontSize: '0.875rem',
										textAlign: 'right',
										fontWeight: 600,
										color: '#333',
									}}
								>
									${item.total.toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div
				style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
			>
				<div style={sectionStyle}>
					<h2
						style={{
							fontSize: '1.125rem',
							fontWeight: 600,
							marginBottom: '1rem',
							color: '#333',
						}}
					>
						Totals
					</h2>
					<div
						style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span style={{ color: '#666' }}>Subtotal</span>
							<span style={{ color: '#333' }}>
								${order.subtotal.toFixed(2)}
							</span>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span style={{ color: '#666' }}>Shipping Fee</span>
							<span style={{ color: '#333' }}>
								${order.shipping_fee.toFixed(2)}
							</span>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								borderTop: '2px solid #ddd',
								paddingTop: '0.5rem',
								fontWeight: 700,
								fontSize: '1.125rem',
							}}
						>
							<span style={{ color: '#333' }}>Total</span>
							<span style={{ color: '#333' }}>${order.total.toFixed(2)}</span>
						</div>
					</div>
				</div>

				<div style={sectionStyle}>
					<h2
						style={{
							fontSize: '1.125rem',
							fontWeight: 600,
							marginBottom: '1rem',
							color: '#333',
						}}
					>
						Details
					</h2>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '0.5rem',
							fontSize: '0.875rem',
						}}
					>
						<div>
							<div style={labelStyle}>Payment Method</div>
							<div style={{ color: '#333' }}>{order.payment_method}</div>
						</div>
						{order.expires_at && (
							<div>
								<div style={labelStyle}>Expires At</div>
								<div style={{ color: '#333' }}>
									{new Date(order.expires_at).toLocaleString()}
								</div>
							</div>
						)}
						{order.tracking_number && (
							<div>
								<div style={labelStyle}>Tracking Number</div>
								<div style={{ color: '#333' }}>{order.tracking_number}</div>
							</div>
						)}
						{order.notes && (
							<div>
								<div style={labelStyle}>Notes</div>
								<div style={{ color: '#333' }}>{order.notes}</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div style={sectionStyle}>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: '#333',
					}}
				>
					Shipping Address
				</h2>
				<div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
					<div style={{ fontWeight: 600, color: '#333' }}>
						{order.shipping_address.full_name}
					</div>
					<div style={{ color: '#333' }}>{order.shipping_address.line1}</div>
					{order.shipping_address.line2 && (
						<div style={{ color: '#333' }}>{order.shipping_address.line2}</div>
					)}
					<div style={{ color: '#333' }}>
						{order.shipping_address.city}, {order.shipping_address.state}{' '}
						{order.shipping_address.postal_code}
					</div>
					{order.shipping_address.country && (
						<div style={{ color: '#333' }}>
							{order.shipping_address.country}
						</div>
					)}
					<div style={{ color: '#666' }}>
						Phone: {order.shipping_address.phone}
					</div>
				</div>
			</div>

			<div style={sectionStyle}>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: '#333',
					}}
				>
					Update Shipping Fee
				</h2>
				<form
					onSubmit={handleUpdateShippingFee}
					style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}
				>
					<div style={{ flex: 1 }}>
						<label
							style={{
								fontSize: '0.875rem',
								fontWeight: 500,
								color: '#555',
								display: 'block',
								marginBottom: '0.25rem',
							}}
						>
							Shipping Fee ($)
						</label>
						<input
							type="number"
							min="0"
							step="0.01"
							value={shippingFeeInput}
							onChange={(e) => setShippingFeeInput(e.target.value)}
							disabled={isUpdatingFee}
							style={{
								padding: '0.625rem 0.75rem',
								border: '1px solid #ddd',
								borderRadius: '4px',
								fontSize: '0.9375rem',
								width: '100%',
							}}
						/>
					</div>
					<button
						type="submit"
						disabled={isUpdatingFee}
						style={{
							padding: '0.625rem 1.5rem',
							backgroundColor: isUpdatingFee ? '#6c757d' : '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							fontSize: '0.9375rem',
							fontWeight: 500,
							cursor: isUpdatingFee ? 'not-allowed' : 'pointer',
							whiteSpace: 'nowrap',
						}}
					>
						{isUpdatingFee ? 'Updating...' : 'Update Fee'}
					</button>
				</form>
			</div>
		</div>
	)
}

export default function OrderDetailPage() {
	return (
		<RequireAuth>
			<div
				style={{ padding: '1rem 2rem', maxWidth: '900px', margin: '0 auto' }}
			>
				<OrderDetailContent />
			</div>
		</RequireAuth>
	)
}
