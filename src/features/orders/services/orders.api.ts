import { AxiosResponse } from 'axios'
import { api } from '@/shared/api/axios'

export type OrderStatus =
	| 'pending'
	| 'confirmed'
	| 'shipped'
	| 'cancelled'
	| 'completed'
export type PaymentMethod = 'CARD' | 'TRANSFER'
export type PaymentStatus = 'UNPAID' | 'PENDING_TRANSFER' | 'PAID' | 'REFUNDED'

export type ShippingAddress = {
	full_name: string
	phone: string
	line1: string
	line2?: string
	city: string
	state: string
	postal_code: string
	country?: string
}

export type OrderItem = {
	article_id: string
	quantity: number
	unit_price: number
	total: number
}

export type Order = {
	_id: string
	customer_id: string
	items: OrderItem[]
	status: OrderStatus
	payment_method: PaymentMethod
	payment_status: PaymentStatus
	expires_at?: string | null
	shipping_address: ShippingAddress
	subtotal: number
	shipping_fee: number
	total: number
	tracking_number?: string | null
	notes?: string | null
	created_at: string
	updated_at: string
}

type RawOrderItem = {
	article_id?: string
	quantity?: number | string
	unit_price?: number | string
	total?: number | string
}

type RawShippingAddress = {
	full_name?: string
	phone?: string
	line1?: string
	line2?: string
	city?: string
	state?: string
	postal_code?: string
	country?: string
}

type RawOrder = {
	_id?: string
	customer_id?: string
	items?: RawOrderItem[]
	status?: OrderStatus
	payment_method?: PaymentMethod
	payment_status?: PaymentStatus
	expires_at?: string | null
	shipping_address?: RawShippingAddress | null
	subtotal?: number | string
	shipping_fee?: number | string | null
	total?: number | string
	tracking_number?: string | null
	notes?: string | null
	created_at?: string
	updated_at?: string | null
}

type ApiResponse<T> = {
	ok: boolean
	data?: T
	error?: { code?: string; message?: string; requestId?: string }
}

export class ApiRequestError extends Error {
	code?: string
	requestId?: string

	constructor(
		message: string,
		options?: { code?: string; requestId?: string },
	) {
		super(message)
		this.name = 'ApiRequestError'
		this.code = options?.code
		this.requestId = options?.requestId
	}
}

const toNumber = (value: number | string | undefined | null): number => {
	if (value === undefined || value === null) return 0
	const n = typeof value === 'number' ? value : Number(value)
	return Number.isFinite(n) ? n : 0
}

const toStringOrNull = (
	value: string | number | null | undefined,
): string | null => {
	if (value === undefined || value === null) return null
	return String(value)
}

const normalizeOrderItem = (item: RawOrderItem): OrderItem => {
	return {
		article_id: String(item.article_id ?? ''),
		quantity: toNumber(item.quantity),
		unit_price: toNumber(item.unit_price),
		total: toNumber(item.total),
	}
}

const normalizeShippingAddress = (
	address?: RawShippingAddress | null,
): ShippingAddress => {
	const addr = address ?? {}
	return {
		full_name: String(addr.full_name ?? ''),
		phone: String(addr.phone ?? ''),
		line1: String(addr.line1 ?? ''),
		line2: addr.line2,
		city: String(addr.city ?? ''),
		state: String(addr.state ?? ''),
		postal_code: String(addr.postal_code ?? ''),
		country: addr.country,
	}
}

const normalizeOrder = (input: RawOrder): Order => {
	const itemsRaw = Array.isArray(input.items) ? input.items : []
	const items = itemsRaw.map(normalizeOrderItem)

	if (!input._id) {
		throw new ApiRequestError(
			'Malformed response: missing required order fields',
		)
	}

	const total = toNumber(input.total)

	return {
		_id: String(input._id),
		customer_id: String(input.customer_id ?? ''),
		items,
		status: input.status ?? 'pending',
		payment_method: input.payment_method ?? 'CARD',
		payment_status: input.payment_status ?? 'UNPAID',
		expires_at: input.expires_at ?? null,
		shipping_address: normalizeShippingAddress(input.shipping_address),
		subtotal: toNumber(input.subtotal),
		shipping_fee: toNumber(input.shipping_fee),
		total,
		tracking_number: toStringOrNull(input.tracking_number),
		notes: toStringOrNull(input.notes),
		created_at: String(input.created_at ?? ''),
		updated_at: String(input.updated_at ?? ''),
	}
}

const unwrapOrThrow = async <T>(
	promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<T> => {
	const res = await promise
	const payload = res.data

	if (!payload.ok) {
		throw new ApiRequestError(payload.error?.message || 'Request failed', {
			code: payload.error?.code,
			requestId: payload.error?.requestId,
		})
	}

	if (payload.data === undefined || payload.data === null) {
		throw new ApiRequestError('Malformed response: missing data')
	}

	return payload.data
}

export type CreateOrderPayload = {
	payment_method: PaymentMethod
	notes?: string
	shipping_address: ShippingAddress
}

export type ListOrdersQuery = {
	page?: number
	limit?: number
}

export type ShippingFeePayload = {
	shipping_fee: number
}

const createOrder = async (payload: CreateOrderPayload) => {
	const data = await unwrapOrThrow<{ order: RawOrder }>(
		api.post('/orders', payload),
	)
	return { order: normalizeOrder(data.order) }
}

const listOrders = async (query?: ListOrdersQuery) => {
	const data = await unwrapOrThrow<{
		items: RawOrder[]
		page: number
		limit: number
		total: number
		totalPages: number
	}>(api.get('/orders', { params: query }))

	return {
		items: data.items.map((item) => normalizeOrder(item)),
		page: data.page,
		limit: data.limit,
		total: data.total,
		totalPages: data.totalPages,
	}
}

const getOrderById = async (id: string) => {
	const data = await unwrapOrThrow<{ order: RawOrder }>(
		api.get(`/orders/${id}`),
	)
	return { order: normalizeOrder(data.order) }
}

const updateShipping = async (id: string, payload: ShippingFeePayload) => {
	const data = await unwrapOrThrow<{ order: RawOrder }>(
		api.patch(`/orders/${id}/shipping`, payload),
	)
	return { order: normalizeOrder(data.order) }
}

export const ordersApi = {
	createOrder,
	listOrders,
	getOrderById,
	updateShipping,
}

// Example usage:
// try {
//   const { order } = await ordersApi.createOrder({
//     payment_method: "CARD",
//     shipping_address: {
//       full_name: "Jane Doe",
//       phone: "555-1234",
//       line1: "123 Main St",
//       city: "CDMX",
//       state: "CDMX",
//       postal_code: "01000",
//       country: "MX",
//     },
//   });
//   console.log(order);
// } catch (err) {
//   if (err instanceof ApiRequestError) {
//     // Surface to UI (message/code) and log requestId for tracing
//     console.error("Order failed", { code: err.code, requestId: err.requestId, message: err.message });
//   }
//   throw err;
// }
