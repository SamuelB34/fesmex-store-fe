import styles from './Products.module.scss'
import { Search } from '@/app/productos/_components/search/Search'
import { Products } from '@/app/_components/Products/Products'
import { brands, types } from '@/app/mock'
import { IndustrialHero } from '@/app/_components/IndustrialHero/IndustrialHero'

export default function Productos() {
	return (
		<div className={styles.products}>
			<Search />
			<Products
				sections={[
					{
						id: '1',
						text: 'Todos los productos',
						number: 365,
						type: 'category',
						active: true,
					},
				]}
				brands={brands}
				types={types}
			/>

			<div className={'content'}>
				<IndustrialHero />
			</div>
		</div>
	)
}
