import { api } from '@/shared/api/axios'
import type { AxiosResponse } from 'axios'

type ApiResponse<T> = {
	ok: boolean
	data?: T
	error?: { code?: string; message?: string }
}

export type BrandItem = {
	brand: string
	article_count: number
}

export type BrandsListResponse = {
	items: BrandItem[]
}

const unwrap = async <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>) => {
	const response = await promise
	return response.data
}

const list = () => unwrap<BrandsListResponse>(api.get('/articles/brands'))

export const brandsApi = {
	list,
}
