import { api } from '@/shared/api/axios'
import { unwrap } from '@/shared/api/utils'

export type Tag = {
	_id: string
	name: string
	slug: string
	type: 'filter' | 'sidebar'
	is_active: boolean
	created_at?: string
	updated_at?: string
}

export type TagsListResponse = {
	items: Tag[]
}

export type TagsListQuery = {
	is_active?: boolean
	type?: 'filter' | 'sidebar'
	limit?: number
}

export const listTags = async (query?: TagsListQuery) => {
	return unwrap<TagsListResponse>(api.get('/tags', { params: query }))
}
