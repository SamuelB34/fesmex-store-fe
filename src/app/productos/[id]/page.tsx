import { notFound } from 'next/navigation'
import styles from './ProductDetail.module.scss'
import { ProductDetailClient } from './ProductDetailClient'
import { ViewTracker } from './ViewTracker'
import { ProductFeatured } from '@/app/_components/ProductsFeatured/ProductFeatured'
import { getArticleImageUrl } from '@/features/services/articles.api'
import {
	fetchArticleById,
	ServerApiError,
} from '@/features/articles/articles.server'
import type { Product } from '@/app/mock'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
	params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
	const { id } = await params

	let articleRes
	try {
		articleRes = await fetchArticleById(id)
	} catch (err) {
		if (err instanceof ServerApiError && err.status === 404) {
			return notFound()
		}
		throw err
	}

	const article = articleRes.data?.article

	if (!article) {
		return notFound()
	}

	const price = articleRes.data?.price ?? article.price ?? 0
	const stock =
		articleRes.data?.stock_web?.count ?? articleRes.data?.stock?.count ?? 0
	const image = getArticleImageUrl(article)

	const product: Product = {
		id: article._id as string,
		name:
			(article.description as string) || (article.name as string) || 'Producto',
		brand: (article.brand as string) || '',
		price,
		currency: 'MXN',
		stock,
		image,
		content: {
			details: article.content?.details ?? null,
		},
	}

	return (
		<div className={styles.detail}>
			<ViewTracker articleId={product.id} />
			<ProductDetailClient product={product} />
			<div className={styles.product_featured}>
				<ProductFeatured />
			</div>
		</div>
	)
}
