'use client'

import styles from './ProductFeatured.module.scss'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/components/Product/Product'
import { articlesApi, type ArticleListItem } from '@/features/services/articles.api'
import type { Product as ProductType } from '@/app/mock'

export const ProductFeatured = () => {
	const router = useRouter()
	const [featured, setFeatured] = useState<ProductType[]>([])
	const [loading, setLoading] = useState(false)

	const handleSelect = (productId: string) => {
		router.push(`/productos/${productId}`)
	}

	useEffect(() => {
		let mounted = true
		const load = async () => {
			setLoading(true)
			try {
				const res = await articlesApi.listFeatured(8)
				if (mounted && res.ok && res.data) {
					const mapped = res.data.items.map(mapArticleToProduct)
					setFeatured(mapped)
				}
			} finally {
				if (mounted) setLoading(false)
			}
		}
		load()
		return () => {
			mounted = false
		}
	}, [])

	const content = useMemo(() => {
		if (loading && featured.length === 0) return <span>Cargando destacados...</span>
		if (!featured.length) return <span>No hay productos destacados</span>
		return featured
	}, [featured, loading])

	return (
		<div className={styles.products_featured}>
			<div className={styles.products_featured__discount}>
				<div className={styles.discounts}>
					<span className={styles.discounts__title}>Hasta</span>
					<span className={styles.discounts__title_2}>50%</span>
					<span className={styles.discounts__discount}>de descuento</span>
				</div>

				<div className={styles.last}>
					<span className={styles.last__txt}>ULTIMAS PIEZAS</span>
				</div>

				<div className={styles.last__circle}></div>
			</div>

			{Array.isArray(content)
				? content.map((product) => (
					<div key={product.id}>
						<Product
							product={product}
							onSelect={handleSelect}
							short
						/>
					</div>
				  ))
				: content}
		</div>
	)
}

function mapArticleToProduct(article: ArticleListItem): ProductType {
	return {
		id: article._id,
		name: article.name || article.description || 'Producto',
		brand: article.brand || '',
		price: Number(article.price) || 0,
		oldPrice: undefined,
		currency: 'MXN',
		stock: article.stock_web?.count ?? 0,
		image:
			article.files?.images?.[0]?.url || article.image_url || '/illustrations/motor.svg',
	}
}
