import type { Section } from '@/app/mock'

interface Category {
	_id: string
	name: string
	slug: string
	is_active: boolean
	parent_id?: string | null
	article_count?: number
}

interface CategoriesResponse {
	ok: boolean
	data: {
		items: Category[]
		totalArticles?: number
	}
}

// const FETCH_REVALIDATE_SECONDS = 3600

function getDefaultSections(): Section[] {
	return [
		{
			id: 'all',
			text: 'Todos los productos',
			number: 0,
			type: 'category',
			active: true,
		},
	]
}

type FetchCategoriesOptions = {
	onlyRoots?: boolean
}

async function fetchCategoriesSections({ onlyRoots = true }: FetchCategoriesOptions): Promise<Section[]> {
	const apiUrl = process.env.API_BASE_URL

	if (!apiUrl) {
		console.error('API_BASE_URL not configured')
		return getDefaultSections()
	}

	const url = new URL(`${apiUrl}/categories`)
	url.searchParams.set('is_active', 'true')
	if (onlyRoots) {
		url.searchParams.set('roots', 'true')
	}

	try {
		const response = await fetch(url.toString(), {
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			console.error(`Failed to fetch categories: ${response.status}`)
			return getDefaultSections()
		}

		const result: CategoriesResponse = await response.json()

		const categorySections: Section[] = result.data.items.map((category) => ({
			id: category._id,
			text: category.name,
			number: category.article_count ?? 0,
			type: category.parent_id ? 'subcategory' : 'category',
			active: false,
			parentId: category.parent_id ?? null,
		}))
		const totalArticles =
			result.data.totalArticles ??
			categorySections
				.filter((section) => !section.parentId)
				.reduce((sum, section) => sum + section.number, 0)
		const allSection: Section = {
			id: 'all',
			text: 'Todos los productos',
			number: totalArticles,
			type: 'category',
			active: true,
		}

		return [allSection, ...categorySections]
	} catch (error) {
		console.error('Error fetching categories:', error)
		return getDefaultSections()
	}
}

export async function fetchHomeCategories(): Promise<Section[]> {
	return fetchCategoriesSections({ onlyRoots: true })
}

export async function fetchAllCategories(): Promise<Section[]> {
	return fetchCategoriesSections({ onlyRoots: false })
}
