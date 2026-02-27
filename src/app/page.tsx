'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { Cover } from '@/app/_components/Cover/Cover'
import { IndustrialHero } from '@/app/_components/IndustrialHero/IndustrialHero'
import { ProductFeatured } from '@/app/_components/ProductsFeatured/ProductFeatured'
import { Products } from '@/app/_components/Products/Products'
import { BestBrands } from '@/app/_components/BestBrands/BestBrands'
import type { Section } from '@/app/mock'
import { listRootCategories } from '@/features/services/categories.api'

export default function Home() {
	const [sections, setSections] = useState<Section[]>([])

	useEffect(() => {
		let mounted = true
		listRootCategories()
			.then((items) => {
				if (!mounted) return
				const mapped: Section[] = items.map((cat) => ({
					id: cat._id,
					text: cat.name,
					number: 0,
					type: 'category',
					active: false,
				}))
				const allSection: Section = {
					id: 'all',
					text: 'Todos los productos',
					number: 0,
					type: 'category',
					active: true,
				}
				setSections([allSection, ...mapped])
			})
			.catch((err) => {
				console.error('Failed to load categories', err)
			})

		return () => {
			mounted = false
		}
	}, [])

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Cover />
			</div>

			<div className={styles.product_featured}>
				<ProductFeatured />
			</div>

			<div className={styles.content}>
				<Products sections={sections} />
			</div>

			<BestBrands />

			<div className={'content'}>
				<IndustrialHero />
			</div>
		</div>
	)
}
