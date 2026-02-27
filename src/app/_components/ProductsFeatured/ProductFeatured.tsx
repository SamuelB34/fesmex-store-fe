'use client'

import styles from './ProductFeatured.module.scss'
import { Product } from '@/components/Product/Product'
import { products } from '@/app/mock'
import { useRouter } from 'next/navigation'

export const ProductFeatured = () => {
	const router = useRouter()

	const handleSelect = (productId: string) => {
		router.push(`/productos/${productId}`)
	}

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

			{products.map((product) => (
				<Product
					key={product.id}
					product={product}
					onSelect={handleSelect}
					short
				/>
			))}
		</div>
	)
}
