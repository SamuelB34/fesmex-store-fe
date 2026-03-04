import styles from './Products.module.scss'
import { IndustrialHero } from '@/app/_components/IndustrialHero/IndustrialHero'
import { SectionsInitializer } from '@/features/categories/components/SectionsInitializer'
import { BrandsInitializer } from '@/features/brands/components/BrandsInitializer'
import { fetchAllCategories } from '@/features/categories/homeCategories.server'
import { fetchHomeBrands } from '@/features/brands/homeBrands.server'
import { articlesApi, getArticleImageUrl, type ArticleListItem } from '@/features/services/articles.api'
import type { ProductView } from '@/app/_components/Products/Products'
import { ProductosClient } from '@/app/productos/_components/ProductosClient'

interface InitialProductsResult {
	products: ProductView[]
	total: number
}

interface ProductosPageProps {
	searchParams?: Record<string, string | string[] | undefined>
}

async function fetchInitialProducts({
	categoryId,
	brandId,
	searchQuery,
}: {
	categoryId?: string | null
	brandId?: string | null
	searchQuery?: string
} = {}): Promise<InitialProductsResult> {
	try {
		const query: { page: number; limit: number; category_id?: string; brand?: string; q?: string } = {
			page: 1,
			limit: 12,
		}
		if (categoryId) {
			query.category_id = categoryId
		}
		if (brandId) {
			query.brand = brandId
		}
		if (searchQuery) {
			query.q = searchQuery
		}
		const response = await articlesApi.list(query)
		if (!response.ok || !response.data) {
			return { products: [], total: 0 }
		}
		const products = response.data.items.map((article: ArticleListItem) => ({
			id: article._id,
			name: article.description || article.name,
			brand: article.brand || '',
			price: article.price,
			currency: 'MXN',
			stock: article.stock_web?.count ?? article.stock?.count ?? 0,
			image: getArticleImageUrl(article),
		}))
		return { products, total: response.data.total }
	} catch (error) {
		console.error('Failed to fetch initial products', error)
		return { products: [], total: 0 }
	}
}

export default async function Productos({ searchParams = {} }: ProductosPageProps) {
	const categoryParam = searchParams.category
	const brandParam = searchParams.brand
	const searchParam = searchParams.q

	const categoryId = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam ?? undefined
	const brandId = Array.isArray(brandParam) ? brandParam[0] : brandParam ?? undefined
	const searchQuery = Array.isArray(searchParam) ? searchParam[0] : searchParam ?? ''

	const [sections, brands, initialProducts] = await Promise.all([
		fetchAllCategories(),
		fetchHomeBrands(),
		fetchInitialProducts({
			categoryId,
			brandId,
			searchQuery: searchQuery || undefined,
		}),
	])

	return (
		<div className={styles.products}>
			<SectionsInitializer sections={sections} />
			<BrandsInitializer brands={brands} />
			<ProductosClient
				brands={brands}
				initialProducts={initialProducts.products}
				initialSearch={searchQuery}
			/>
			<div className={'content'}>
				<IndustrialHero />
			</div>
		</div>
	)
}
