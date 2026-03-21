'use client'

import styles from './Products.module.scss'
import { Brand } from '@/components/Brand/Brand'
import { Product } from '@/components/Product/Product'
import type { Section } from '@/app/mock'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface ProductView {
	id: string
	name: string
	brand: string
	price: number
	currency: string
	stock: number
	image: string
}

interface ProductProps {
	sections: Section[]
	brands?: Section[]
	types?: Section[]
	products: ProductView[]
	isLoading: boolean
	onSectionSelect?: (sectionId: string) => void
	onBrandSelect?: (brandId: string) => void
	onSelectProduct?: (productId: string) => void
}

export const Products = ({
	sections,
	brands,
	types,
	products,
	isLoading,
	onSectionSelect,
	onBrandSelect,
	onSelectProduct,
}: ProductProps) => {
	const router = useRouter()
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set(),
	)

	const { orderedSections, childrenMap } = useMemo(() => {
		const childrenMap = sections.reduce<Record<string, Section[]>>(
			(acc, section) => {
				if (section.parentId) {
					if (!acc[section.parentId]) {
						acc[section.parentId] = []
					}
					acc[section.parentId]?.push(section)
				}
				return acc
			},
			{},
		)

		const result: Section[] = []
		const visited = new Set<string>()

		const appendWithChildren = (section: Section) => {
			if (visited.has(section.id)) return
			visited.add(section.id)
			result.push(section)
			const children = childrenMap[section.id] || []
			children.forEach((child) => appendWithChildren(child))
		}

		sections
			.filter((section) => !section.parentId)
			.forEach((section) => appendWithChildren(section))

		sections.forEach((section) => appendWithChildren(section))

		return { orderedSections: result, childrenMap }
	}, [sections])

	const toggleCategoryExpansion = (categoryId: string) => {
		setExpandedCategories((prev) => {
			const next = new Set(prev)
			if (next.has(categoryId)) {
				next.delete(categoryId)
			} else {
				next.add(categoryId)
			}
			return next
		})
	}

	const ensureParentExpanded = (parentId: string) => {
		setExpandedCategories((prev) => {
			if (prev.has(parentId)) return prev
			const next = new Set(prev)
			next.add(parentId)
			return next
		})
	}

	const visibleSections = useMemo(() => {
		return orderedSections.filter((section) => {
			if (!section.parentId) return true
			return expandedCategories.has(section.parentId) || section.active
		})
	}, [orderedSections, expandedCategories])

	const handleSectionClick = (section: Section) => {
		const hasChildren = !!childrenMap[section.id]?.length
		if (!section.parentId && hasChildren) {
			toggleCategoryExpansion(section.id)
		} else if (section.parentId) {
			ensureParentExpanded(section.parentId)
		}
		onSectionSelect?.(section.id)
	}

	const handleSelectProduct = (productId: string) => {
		onSelectProduct?.(productId)
		router.push(`/productos/${productId}`)
	}

	return (
		<div className={styles.products}>
			<span className={styles.products__title}>Soluciones FESMEX</span>

			<div className={styles.products__catalog}>
				<div className={styles.left}>
					{/*Sections*/}
					<div className={styles.sections}>
						{visibleSections.map((section) => (
							<Brand
								key={section.id}
								text={section.text}
								number={section.number}
								type={section.type === 'brand' ? 'category' : section.type}
								active={section.active}
								onSelect={() => handleSectionClick(section)}
							/>
						))}
					</div>

					{/*Brands*/}
					{brands?.length && brands.length > 0 ? (
						<div className={styles.sections}>
							<span className={styles.sections__subtitle}>Marca</span>
							{brands.map((brand) => (
								<Brand
									key={brand.text}
									text={brand.text}
									number={brand.number}
									type={brand.type === 'brand' ? 'category' : brand.type}
									active={brand.active}
									onSelect={() => onBrandSelect?.(brand.id)}
								/>
							))}
						</div>
					) : null}

					{/*Types*/}
					{types && (
						<div className={styles.sections}>
							<span className={styles.sections__subtitle}>Tipo</span>
							{types.map((type) => (
								<Brand
									key={type.text}
									text={type.text}
									number={type.number}
									type={type.type === 'brand' ? 'category' : type.type}
									active={type.active}
								/>
							))}
						</div>
					)}
				</div>

				{/*Products*/}
				<div className={styles.products_list}>
					<span className={styles.products_list__title}>
						{isLoading
							? 'Cargando productos...'
							: `${products.length} Productos`}
					</span>
					<div className={styles.products_list__content}>
						{products.map((product) => (
							<div className={styles.item} key={product.id}>
								<Product
									product={product}
									short
									onSelect={handleSelectProduct}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
