import { notFound } from 'next/navigation'
import { products } from '@/app/mock'
import styles from './ProductDetail.module.scss'
import { ProductDetailClient } from './ProductDetailClient'
import { ProductFeatured } from '@/app/_components/ProductsFeatured/ProductFeatured'

export const generateStaticParams = async () => {
	return products.map((product) => ({ id: product.id }))
}

export const dynamic = 'force-dynamic'

interface ProductPageProps {
	params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
	const { id } = await params
	const product = products.find((item) => item.id === id)

	if (!product) {
		return notFound()
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
