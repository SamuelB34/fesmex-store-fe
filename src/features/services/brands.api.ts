import { api } from '@/shared/api/axios'
import { unwrap } from '@/shared/api/utils'

export type BrandItem = {
	brand: string
	article_count: number
}

export type BrandsListResponse = {
	items: BrandItem[]
}

const list = () => unwrap<BrandsListResponse>(api.get('/articles/brands'))

export const brandsApi = {
	list,
}
