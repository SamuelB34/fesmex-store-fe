import styles from './page.module.scss'
import { Cover } from '@/app/_components/Cover/Cover'
import { ProductFeatured } from '@/app/_components/ProductsFeatured/ProductFeatured'
import { BestBrands } from '@/app/_components/BestBrands/BestBrands'
import { IndustrialHero } from '@/app/_components/IndustrialHero/IndustrialHero'
import { HomeProducts } from '@/app/_components/HomeProducts/HomeProducts'
import { fetchHomeCategories } from '@/features/categories/homeCategories.server'
import { fetchArticlesList } from '@/features/articles/articles.server'
import {
	getArticleImageUrl,
	type ArticleListItem,
} from '@/features/services/articles.api'
import { SectionsInitializer } from '@/features/categories/components/SectionsInitializer'
import type { ProductView } from '@/app/_components/Products/Products'

interface InitialProductsResult {
	products: ProductView[]
	total: number
}

async function fetchInitialProducts(): Promise<InitialProductsResult> {
	try {
		const response = await fetchArticlesList({ page: 1, limit: 12 })
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
		console.error('Failed to fetch home products', error)
		return { products: [], total: 0 }
	}
}

export default async function Home() {
	const [sections, initialProductsResult] = await Promise.all([
		fetchHomeCategories(),
		fetchInitialProducts(),
	])
	return (
		<div className={styles.container}>
			<SectionsInitializer sections={sections} />
			<div className={styles.content}>
				<Cover />
			</div>

			<div className={styles.product_featured}>
				<ProductFeatured />
			</div>

			<div className={styles.content}>
				<HomeProducts
					initialProducts={initialProductsResult.products}
					totalProducts={initialProductsResult.total}
				/>
			</div>

			<BestBrands />

			<div className={'content'}>
				<IndustrialHero />
			</div>
		</div>
	)
}
