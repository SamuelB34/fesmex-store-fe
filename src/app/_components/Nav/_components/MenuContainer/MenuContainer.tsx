import styles from './MenuContainer.module.scss'
import { MenuItem } from '@/components/MenuItem/MenuItem'
import Link from 'next/link'
import { useMemo } from 'react'
import { useSections } from '@/features/categories/context/SectionsContext'
import { useBrands } from '@/features/brands/context/BrandsContext'

type MenuItemProps = {
	title: string
	url: string
}

interface MenuContainerProps {
	items?: MenuItemProps[]
	type?: 'products' | 'brands'
}

export const MenuContainer = ({ items = [], type = 'products' }: MenuContainerProps) => {
	const { sections } = useSections()
	const { brands } = useBrands()

	const computedItems = useMemo<MenuItemProps[]>(() => {
		if (type === 'products' && sections.length > 0) {
			return sections.map((section) => ({
				title: section.text,
				url:
					section.id === 'all'
						? '/productos'
						: `/productos?category=${encodeURIComponent(section.id)}`,
			}))
		}
		if (type === 'brands' && brands.length > 0) {
			return brands.map((brand) => ({
				title: brand.text,
				url: `/productos?brand=${encodeURIComponent(brand.id)}`,
			}))
		}
		return items
	}, [items, sections, type, brands])

	if (computedItems.length === 0) {
		return null
	}
	return (
		<div className={styles.menu_container}>
			{computedItems.map((item, index) => (
				<Link href={item.url} key={`${item.title}_${index}`}>
					<MenuItem text={item.title} />
				</Link>
			))}
		</div>
	)
}
