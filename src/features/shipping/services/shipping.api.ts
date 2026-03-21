import { api } from '@/shared/api/axios'
import { AxiosResponse } from 'axios'

export type ShippingState = {
	_id: string
	name: string
	code?: string
	percentage: number
	is_active: boolean
}

type ApiResponse<T> = {
	ok: boolean
	data?: T
	error?: { code?: string; message?: string; requestId?: string }
}

export class ShippingApiError extends Error {
	code?: string
	requestId?: string

	constructor(
		message: string,
		options?: { code?: string; requestId?: string },
	) {
		super(message)
		this.name = 'ShippingApiError'
		this.code = options?.code
		this.requestId = options?.requestId
	}
}

const unwrapOrThrow = async <T>(
	promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<T> => {
	const res = await promise
	const payload = res.data

	if (!payload.ok) {
		throw new ShippingApiError(payload.error?.message || 'Request failed', {
			code: payload.error?.code,
			requestId: payload.error?.requestId,
		})
	}

	if (payload.data === undefined || payload.data === null) {
		throw new ShippingApiError('Malformed response: missing data')
	}

	return payload.data
}

type StatesListResponse = {
	states: ShippingState[]
}

const getActiveStates = async (): Promise<ShippingState[]> => {
	const data = await unwrapOrThrow<StatesListResponse>(
		api.get('/shipping/states'),
	)
	return data.states
}

export const shippingApi = {
	getActiveStates,
}
