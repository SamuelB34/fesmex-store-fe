import { api } from '@/shared/api/axios'

export interface Category {
	_id: string
	name: string
	slug: string
	parent_id?: string | null
	order?: number
	is_active: boolean
	created_at?: string
	updated_at?: string
}

export interface CategoriesListResponse {
	ok: true
	data: {
		items: Category[]
	}
}

export interface CategoriesListQuery {
	is_active?: boolean
	parent_id?: string
	roots?: boolean
}

export async function listCategories(query?: CategoriesListQuery) {
	const params = {
		...(query?.is_active !== undefined ? { is_active: query.is_active } : {}),
		...(query?.parent_id ? { parent_id: query.parent_id } : {}),
		...(query?.roots ? { roots: query.roots } : {}),
	}
	const { data } = await api.get<CategoriesListResponse>('/categories', {
		params,
	})
	return data.data.items
}

export async function listRootCategories() {
	return listCategories({ is_active: true, roots: true })
}
