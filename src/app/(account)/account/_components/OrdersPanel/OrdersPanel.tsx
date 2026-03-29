'use client'

import type { useOrdersList } from '@/features/orders/hooks/useOrders'
import styles from './OrdersPanel.module.scss'
import {
	OrderStatusLabel,
	PaymentMethodLabel,
	PaymentStatusLabel,
} from '@/app/(account)/account/_components/OrdersPanel/order'
import { OrdersPanelCard } from '@/app/(account)/account/_components/OrdersPanel/OrdersPanelCard/OrdersPanelCard'
import { formatDatePT } from '@/shared/utils/format'

export interface OrdersPanelProps {
	ordersState: ReturnType<typeof useOrdersList>
}

export const OrdersPanel = ({ ordersState }: OrdersPanelProps) => {
	const { items, isLoading, error, fetchOrders } = ordersState

	const handleRefresh = () => {
		fetchOrders({ page: 1, limit: 5 })
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h4 className={styles.title}>Ultimas actualizaciones.</h4>
				<button
					className={styles.refreshButton}
					onClick={handleRefresh}
					disabled={isLoading}
				>
					{isLoading ? 'Actualizando...' : 'Actualizar'}
				</button>
			</div>

			{error && <div className={styles.error}>{error}</div>}

			{isLoading ? (
				<div className={styles.loading}>Cargando pedidos...</div>
			) : items.length === 0 ? (
				<div className={styles.empty}>Aún no tienes pedidos registrados.</div>
			) : (
				<ul className={styles.list}>
					{items.map((order) => (
						<div key={order._id}>
							<OrdersPanelCard
								title={OrderStatusLabel[order.status]}
								orderId={order._id}
								items={order.items}
								firstItem={{
									label: 'Estado de pago',
									value: PaymentStatusLabel[order.payment_status],
								}}
								secondItem={{
									label: 'Método de pago',
									value: PaymentMethodLabel[order.payment_method],
								}}
								thirdItem={{
									label: 'Última actualización',
									value: formatDatePT(order.updated_at),
								}}
							/>
						</div>
					))}
				</ul>
			)}
		</div>
	)
}
