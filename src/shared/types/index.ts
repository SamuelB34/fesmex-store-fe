export type Section = {
	id: string
	text: string
	number: number
	type: 'category' | 'subcategory' | 'brand'
	active?: boolean
	parentId?: string | null
}

export type Product = {
	id: string
	article_number: string
	name: string
	brand: string
	price: number
	oldPrice?: number
	currency: string
	stock: number
	image: string
	content?: {
		details?: string | null
	}
}

export type ApiResponse<T> = {
	ok: boolean
	data?: T
	error?: { code?: string; message?: string; requestId?: string }
}

export type ProductView = {
	id: string
	article_number: string
	name: string
	brand: string
	price: number
	currency: string
	stock: number
	image: string
}
