'use client'

import styles from './Products.module.scss'
import { Search } from '@/app/productos/_components/search/Search'
import { IndustrialHero } from '@/app/_components/IndustrialHero/IndustrialHero'
import { HomeProducts } from '@/app/_components/HomeProducts/HomeProducts'
import { useRouter, useSearchParams } from 'next/navigation'
import { useBrands } from '@/features/brands/context/BrandsContext'

export default function Productos() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { brands } = useBrands()
	const searchQuery = searchParams.get('q') ?? ''

	const handleSearch = (query: string) => {
		const params = new URLSearchParams(searchParams.toString())
		if (query) {
			params.set('q', query)
		} else {
			params.delete('q')
		}
		const queryString = params.toString()
		router.push(`/productos${queryString ? `?${queryString}` : ''}`)
	}

	return (
		<div className={styles.products}>
			<Search onSearch={handleSearch} initialValue={searchQuery} />
			<HomeProducts brands={brands} />

			<div className={'content'}>
				<IndustrialHero />
			</div>
		</div>
	)
}
