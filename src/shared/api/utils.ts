import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/shared/types'

export async function unwrap<T>(
	promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<ApiResponse<T>> {
	const res = await promise
	return res.data
}

export async function unwrapOrThrow<T>(
	promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<T> {
	const res = await promise
	const payload = res.data
	if (!payload.ok || !payload.data) {
		throw new Error(payload.error?.message || 'Request failed')
	}
	return payload.data
}
