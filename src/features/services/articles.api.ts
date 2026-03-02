import { AxiosResponse } from 'axios'
import { api } from '@/shared/api/axios'

type ApiResponse<T> = {
	ok: boolean
	data?: T
	error?: { code?: string; message?: string; requestId?: string }
}

export type ArticleStock = {
	count: number
	min_stock?: number
	max_stock?: number
}

export type ArticleStockWeb = ArticleStock & { warehouse_id: string }

export type ArticleFile = {
	key: string
	filename: string
	mime_type: string
	size: number
	uploaded_at: string
	url: string
}

export type ArticleFiles = {
	images?: ArticleFile[]
	datasheets?: ArticleFile[]
}

export type Article = {
	_id: string
	name: string
	description?: string
	brand?: string
	unit?: string
	price: number
	group_id?: string
	sku?: string
	barcode?: string
	image_url?: string
	files?: ArticleFiles
	stock_web?: ArticleStockWeb | null
	created_at?: string
	updated_at?: string
	is_featured?: boolean
	featured_order?: number
}

export type ArticleListItem = Article & { stock?: ArticleStock | null }

export type ListArticlesQuery = {
	page?: number
	limit?: number
	q?: string
	brand?: string
	unit?: string
	group_id?: string
	category_id?: string
	is_featured?: boolean
	sort?: string
}

export type ArticlesListResponse = {
	items: ArticleListItem[]
	page: number
	limit: number
	total: number
	totalPages: number
}

const unwrap = async <T>(
	promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<ApiResponse<T>> => {
	const res = await promise
	return res.data
}

const list = (query?: ListArticlesQuery) =>
	unwrap<ArticlesListResponse>(api.get('/articles', { params: query }))
const listFeatured = (limit = 8) =>
	list({ is_featured: true, limit, sort: 'featured_order' })
const getById = (id: string) =>
	unwrap<{
		article: Article | null
		stock?: ArticleStock | null
		stock_web?: ArticleStockWeb | null
		price?: number | null
	}>(
		api.get(`/articles/${id}`),
	)

export const getArticleImageUrl = (article?: Article | null) => {
	if (!article) return ''
	const presigned = article.files?.images?.[0]?.url
	return presigned ?? article.image_url ?? ''
}

export const articlesApi = {
	list,
	listFeatured,
	getById,
}
