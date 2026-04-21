import { AxiosResponse } from 'axios'
import { api } from '@/shared/api/axios'

export type Tag = {
	_id: string
	name: string
	slug: string
	type: 'filter' | 'sidebar'
	is_active: boolean
	created_at?: string
	updated_at?: string
}

type ApiResponse<T> = {
	ok: boolean
	data?: T
	error?: { code?: string; message?: string; requestId?: string }
}

export type TagsListResponse = {
	items: Tag[]
}

export type TagsListQuery = {
	is_active?: boolean
	type?: 'filter' | 'sidebar'
	limit?: number
}

const unwrap = async <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<ApiResponse<T>> => {
	const res = await promise
	return res.data
}

export const listTags = async (query?: TagsListQuery) => {
	return unwrap<TagsListResponse>(api.get('/tags', { params: query }))
}
