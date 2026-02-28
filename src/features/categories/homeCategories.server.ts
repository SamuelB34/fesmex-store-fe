import type { Section } from '@/app/mock'

interface Category {
	_id: string
	name: string
	slug: string
	is_active: boolean
}

interface CategoriesResponse {
	ok: boolean
	data: {
		items: Category[]
	}
}

const FETCH_REVALIDATE_SECONDS = 3600

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

export async function fetchHomeCategories(): Promise<Section[]> {
	const apiUrl = process.env.API_BASE_URL

	if (!apiUrl) {
		console.error('API_BASE_URL not configured')
		return getDefaultSections()
	}

	const url = `${apiUrl}/categories?is_active=true&roots=true`

	try {
		const response = await fetch(url, {
			next: { revalidate: FETCH_REVALIDATE_SECONDS },
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			console.error(`Failed to fetch categories: ${response.status}`)
			return getDefaultSections()
		}

		const result: CategoriesResponse = await response.json()

		const sections: Section[] = result.data.items.map((category) => ({
			id: category._id,
			text: category.name,
			number: 0,
			type: 'category',
			active: false,
		}))

		return [getDefaultSections()[0], ...sections]
	} catch (error) {
		console.error('Error fetching categories:', error)
		return getDefaultSections()
	}
}
