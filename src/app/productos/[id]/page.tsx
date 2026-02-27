import { notFound } from 'next/navigation'
import styles from './ProductDetail.module.scss'
import { ProductDetailClient } from './ProductDetailClient'
import { ProductFeatured } from '@/app/_components/ProductsFeatured/ProductFeatured'
import { articlesApi, getArticleImageUrl } from '@/features/services/articles.api'
import { ApiError } from '@/shared/api/axios'
import type { Product } from '@/app/mock'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
	params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
	const { id } = await params

	let articleRes
	try {
		articleRes = await articlesApi.getById(id)
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) {
			return notFound()
		}
		throw err
	}

	const article = articleRes.data?.article

	if (!article) {
		return notFound()
	}

	const price = articleRes.data?.price ?? article.price ?? 0
	const stock = articleRes.data?.stock_web?.count ?? articleRes.data?.stock?.count ?? 0
	const image = getArticleImageUrl(article)

	const product: Product = {
		id: article._id as string,
		name: (article.description as string) || (article.name as string) || 'Producto',
		brand: (article.brand as string) || '',
		price,
		currency: 'MXN',
		stock,
		image,
	}

	return (
		<div className={styles.detail}>
			<ProductDetailClient product={product} />
			<div className={styles.product_featured}>
				<ProductFeatured />
			</div>
		</div>
	)
}
