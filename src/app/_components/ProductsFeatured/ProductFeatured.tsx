import styles from './ProductFeatured.module.scss'
import { Product } from '@/components/Product/Product'

export const ProductFeatured = () => {
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

			<Product />
			<Product />
			<Product />
			<Product />
			<Product />
			<Product />
		</div>
	)
}
