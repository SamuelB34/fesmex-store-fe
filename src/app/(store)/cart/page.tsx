'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/features/cart/hooks/useCart'
import { RequireAuth } from '@/shared/auth/RequireAuth'
import { CartItem } from '@/features/services/cart.api'

function CartContent() {
	const router = useRouter()
	const { cart, isLoading, error, fetchCart, updateItem, removeItem } =
		useCart()
	const [updatingId, setUpdatingId] = useState<string | null>(null)

	useEffect(() => {
		fetchCart()
	}, [fetchCart])

	const handleQuantityChange = async (item: CartItem, newQty: number) => {
		setUpdatingId(item.article_id)
		if (newQty <= 0) {
			await removeItem(item.article_id)
		} else {
			await updateItem({ article_id: item.article_id, quantity: newQty })
		}
		setUpdatingId(null)
	}

	const handleRemove = async (articleId: string) => {
		setUpdatingId(articleId)
		await removeItem(articleId)
		setUpdatingId(null)
	}

	if (isLoading) {
		return (
			<p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
				Loading cart...
			</p>
		)
	}

	const items = cart?.items ?? []
	const subtotal = cart?.subtotal ?? items.reduce((sum, i) => sum + i.total, 0)

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
					<Link href="/orders">Orders</Link>
					<Link href="/account">Account</Link>
				</div>
			</nav>

			<h1
				style={{
					fontSize: '1.75rem',
					fontWeight: 600,
					marginBottom: '1.5rem',
					color: '#333',
				}}
			>
				Shopping Cart
			</h1>

			{error && (
				<div
					style={{
						padding: '0.75rem',
						marginBottom: '1rem',
						backgroundColor: '#fee',
						color: '#c33',
						borderRadius: '4px',
						fontSize: '0.875rem',
					}}
				>
					{error}
				</div>
			)}

			{items.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '3rem 0', color: '#666' }}>
					<p style={{ marginBottom: '1rem' }}>Your cart is empty.</p>
					<Link href="/" style={{ color: '#007bff', fontWeight: 500 }}>
						Browse articles
					</Link>
				</div>
			) : (
				<>
					<table
						style={{
							width: '100%',
							borderCollapse: 'collapse',
							marginBottom: '1.5rem',
						}}
					>
						<thead>
							<tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
								<th style={{ padding: '0.75rem', color: '#333' }}>Article</th>
								<th style={{ padding: '0.75rem', color: '#333' }}>
									Unit Price
								</th>
								<th style={{ padding: '0.75rem', color: '#333' }}>Quantity</th>
								<th style={{ padding: '0.75rem', color: '#333' }}>Total</th>
								<th style={{ padding: '0.75rem', color: '#333' }}></th>
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<tr
									key={item.article_id}
									style={{ borderBottom: '1px solid #eee' }}
								>
									<td style={{ padding: '0.75rem', color: '#333' }}>
										{item.name || item.article_id}
									</td>
									<td style={{ padding: '0.75rem', color: '#333' }}>
										${item.unit_price.toFixed(2)}
									</td>
									<td style={{ padding: '0.75rem', color: '#333' }}>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '0.5rem',
											}}
										>
											<button
												onClick={() =>
													handleQuantityChange(item, item.quantity - 1)
												}
												disabled={updatingId === item.article_id}
												style={{
													width: '32px',
													height: '32px',
													border: '1px solid #ddd',
													borderRadius: '4px',
													cursor: 'pointer',
													background: 'white',
												}}
											>
												-
											</button>
											<span style={{ minWidth: '2rem', textAlign: 'center' }}>
												{item.quantity}
											</span>
											<button
												onClick={() =>
													handleQuantityChange(item, item.quantity + 1)
												}
												disabled={updatingId === item.article_id}
												style={{
													width: '32px',
													height: '32px',
													border: '1px solid #ddd',
													borderRadius: '4px',
													cursor: 'pointer',
													background: 'white',
												}}
											>
												+
											</button>
										</div>
									</td>
									<td style={{ padding: '0.75rem', fontWeight: 600 }}>
										${Number(item.total ?? 0).toFixed(2)}
									</td>
									<td style={{ padding: '0.75rem' }}>
										<button
											onClick={() => handleRemove(item.article_id)}
											disabled={updatingId === item.article_id}
											style={{
												padding: '0.375rem 0.75rem',
												backgroundColor: '#dc3545',
												color: 'white',
												border: 'none',
												borderRadius: '4px',
												cursor: 'pointer',
												fontSize: '0.8125rem',
											}}
										>
											Remove
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
							gap: '2rem',
							padding: '1rem 0',
							borderTop: '2px solid #ddd',
						}}
					>
						<span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
							Subtotal: ${subtotal.toFixed(2)}
						</span>
						<button
							onClick={() => router.push('/checkout')}
							style={{
								padding: '0.75rem 2rem',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								fontSize: '1rem',
								fontWeight: 500,
								cursor: 'pointer',
							}}
						>
							Checkout
						</button>
					</div>
				</>
			)}
		</div>
	)
}

export default function CartPage() {
	return (
		<RequireAuth>
			<div
				style={{ padding: '1rem 2rem', maxWidth: '1200px', margin: '0 auto' }}
			>
				<CartContent />
			</div>
		</RequireAuth>
	)
}
