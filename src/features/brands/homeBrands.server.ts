import type { Section } from '@/app/mock'

interface BrandItem {
	brand: string
	article_count: number
}

interface BrandsResponse {
	ok: boolean
	data?: {
		items: BrandItem[]
	}
	error?: { code?: string; message?: string }
}

function getDefaultBrands(): Section[] {
	return []
}

export async function fetchHomeBrands(): Promise<Section[]> {
	const apiUrl = process.env.API_BASE_URL

	if (!apiUrl) {
		console.error('API_BASE_URL not configured')
		return getDefaultBrands()
	}

	const url = `${apiUrl}/articles/brands`

	try {
		const response = await fetch(url, {
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			console.error(`Failed to fetch brands: ${response.status}`)
			return getDefaultBrands()
		}

		const result: BrandsResponse = await response.json()

		if (!result.ok || !result.data?.items) {
			return getDefaultBrands()
		}

		const brandSections: Section[] = result.data.items.map((item) => ({
			id: item.brand,
			text: item.brand,
			number: item.article_count,
			type: 'category' as const,
			active: false,
		}))

		const totalBrandsCount = brandSections.reduce(
			(sum, brand) => sum + (brand.number ?? 0),
			0,
		)

		const allBrandsSection: Section = {
			id: 'all-brands',
			text: 'Todas las marcas',
			number: totalBrandsCount,
			type: 'category',
			active: true,
		}

		return [allBrandsSection, ...brandSections]
	} catch (error) {
		console.error('Error fetching brands:', error)
		return getDefaultBrands()
	}
}
