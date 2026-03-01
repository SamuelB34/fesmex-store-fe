import styles from './page.module.scss'
import { Cover } from '@/app/_components/Cover/Cover'
import { ProductFeatured } from '@/app/_components/ProductsFeatured/ProductFeatured'
import { BestBrands } from '@/app/_components/BestBrands/BestBrands'
import { IndustrialHero } from '@/app/_components/IndustrialHero/IndustrialHero'
import { HomeProducts } from '@/app/_components/HomeProducts/HomeProducts'
import { fetchHomeCategories } from '@/features/categories/homeCategories.server'

export default async function Home() {
	const sections = await fetchHomeCategories()
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Cover />
			</div>

			<div className={styles.product_featured}>
				<ProductFeatured />
			</div>

			<div className={styles.content}>
				<HomeProducts sections={sections} />
			</div>

			<BestBrands />

			<div className={'content'}>
				<IndustrialHero />
			</div>
		</div>
	)
}
