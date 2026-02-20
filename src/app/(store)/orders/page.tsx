'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RequireAuth } from '@/shared/auth/RequireAuth'
import { useOrdersList } from '@/features/orders/hooks/useOrders'

const statusColors: Record<string, string> = {
	pending: '#ffc107',
	confirmed: '#17a2b8',
	shipped: '#007bff',
	cancelled: '#dc3545',
	completed: '#28a745',
}

function OrdersContent() {
	const { items, page, totalPages, total, isLoading, error, fetchOrders } =
		useOrdersList()
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(() => {
		fetchOrders({ page: currentPage, limit: 10 })
	}, [fetchOrders, currentPage])

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
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
					<Link href="/account">Account</Link>
				</div>
			</nav>

			<h1
				style={{
					fontSize: '1.75rem',
					fontWeight: 600,
					marginBottom: '0.5rem',
					color: '#333',
				}}
			>
				My Orders
			</h1>
			<p
				style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.875rem' }}
			>
				{total} order(s) total
			</p>

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

			{isLoading ? (
				<p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
					Loading orders...
				</p>
			) : items.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '3rem 0', color: '#666' }}>
					<p style={{ marginBottom: '1rem' }}>No orders yet.</p>
					<Link href="/" style={{ color: '#007bff', fontWeight: 500 }}>
						Browse articles
					</Link>
				</div>
			) : (
				<>
					<div
						style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
					>
						{items.map((order) => (
							<Link
								key={order._id}
								href={`/orders/${order._id}`}
								style={{
									display: 'block',
									border: '1px solid #ddd',
									borderRadius: '8px',
									padding: '1rem 1.25rem',
									background: 'white',
									textDecoration: 'none',
									color: 'inherit',
								}}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: '0.5rem',
									}}
								>
									<span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
										Order #{order._id.slice(-8)}
									</span>
									<span
										style={{
											padding: '0.25rem 0.625rem',
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
								</div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										fontSize: '0.875rem',
										color: '#666',
									}}
								>
									<span>{order.items.length} item(s)</span>
									<span style={{ fontWeight: 600, color: '#333' }}>
										${order.total.toFixed(2)}
									</span>
								</div>
								<div
									style={{
										fontSize: '0.75rem',
										color: '#999',
										marginTop: '0.25rem',
									}}
								>
									{new Date(order.created_at).toLocaleDateString()} &middot;{' '}
									{order.payment_method}
								</div>
							</Link>
						))}
					</div>

					{totalPages > 1 && (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: '1rem',
								marginTop: '1.5rem',
							}}
						>
							<button
								onClick={() => handlePageChange(page - 1)}
								disabled={page <= 1}
								style={{
									padding: '0.5rem 1rem',
									border: '1px solid #ddd',
									borderRadius: '4px',
									background: '#f8f9fa',
									cursor: page <= 1 ? 'not-allowed' : 'pointer',
									opacity: page <= 1 ? 0.5 : 1,
								}}
							>
								Previous
							</button>
							<span style={{ fontSize: '0.875rem', color: '#666' }}>
								Page {page} of {totalPages}
							</span>
							<button
								onClick={() => handlePageChange(page + 1)}
								disabled={page >= totalPages}
								style={{
									padding: '0.5rem 1rem',
									border: '1px solid #ddd',
									borderRadius: '4px',
									background: '#f8f9fa',
									cursor: page >= totalPages ? 'not-allowed' : 'pointer',
									opacity: page >= totalPages ? 0.5 : 1,
								}}
							>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default function OrdersPage() {
	return (
		<RequireAuth>
			<div
				style={{ padding: '1rem 2rem', maxWidth: '900px', margin: '0 auto' }}
			>
				<OrdersContent />
			</div>
		</RequireAuth>
	)
}
