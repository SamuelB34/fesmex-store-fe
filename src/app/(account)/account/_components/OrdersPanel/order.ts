import {
	OrderStatus,
	PaymentMethod,
	PaymentStatus,
} from '@/features/orders/services/orders.api'

export const OrderStatusLabel: Record<OrderStatus, string> = {
	pending: 'Tu orden esta siendo procesada',
	confirmed: 'Tu orden fue confirmada',
	shipped: 'Tu entrega va en camino',
	cancelled: 'Tu orden fue cancelada',
	completed: 'Entregada',
}

export const PaymentStatusLabel: Record<PaymentStatus, string> = {
	UNPAID: 'Pago pendiente',
	PENDING_TRANSFER: 'Transferencia pendiente',
	PAID: 'Pagado',
	REFUNDED: 'Reembolsado',
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
	CARD: 'Pago con tarjeta',
	TRANSFER: 'Transferencia bancaria',
}
