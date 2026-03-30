import type {
	Article,
	ArticleStock,
	ArticleStockWeb,
	ArticlesListResponse,
	ListArticlesQuery,
} from '@/features/services/articles.api'

type ApiResponse<T> = {
	ok: boolean
	data?: T
	error?: { code?: string; message?: string; requestId?: string }
}

export class ServerApiError extends Error {
	constructor(
		public status: number,
		public code: string,
		message: string,
	) {
		super(message)
		this.name = 'ServerApiError'
	}
}

function getApiUrl(): string {
	const apiUrl = process.env.API_BASE_URL
	if (!apiUrl) {
		throw new Error('API_BASE_URL environment variable is not configured')
	}
	return apiUrl
}

export async function fetchArticleById(id: string): Promise<
	ApiResponse<{
		article: Article | null
		stock?: ArticleStock | null
		stock_web?: ArticleStockWeb | null
		price?: number | null
	}>
> {
	const url = `${getApiUrl()}/articles/${id}`

	const res = await fetch(url, {
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json' },
	})

	if (!res.ok) {
		let message = `HTTP ${res.status}`
		let code = `HTTP_${res.status}`
		try {
			const body = await res.json()
			if (body?.error?.message) message = body.error.message
			if (body?.error?.code) code = body.error.code
		} catch {
			// ignore parse errors
		}
		throw new ServerApiError(res.status, code, message)
	}

	return res.json()
}

export async function fetchArticlesList(
	query?: ListArticlesQuery,
): Promise<ApiResponse<ArticlesListResponse>> {
	const apiUrl = getApiUrl()
	const url = new URL(`${apiUrl}/articles`)

	if (query) {
		Object.entries(query).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				url.searchParams.set(key, String(value))
			}
		})
	}

	const res = await fetch(url.toString(), {
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json' },
	})

	if (!res.ok) {
		console.error(`Failed to fetch articles: ${res.status}`)
		return { ok: false }
	}

	return res.json()
}
