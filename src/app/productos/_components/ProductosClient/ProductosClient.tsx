'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { Products } from '@/app/_components/Products/Products'
import { getArticleImageUrl } from '@/features/services/articles.api'
import { useSections } from '@/features/categories/context/SectionsContext'
import type { Section } from '@/app/mock'
import type { ListArticlesQuery } from '@/features/services/articles.api'
import type { ProductView } from '@/app/_components/Products/Products'

interface ProductosClientProps {
	brands?: Section[]
	types?: Section[]
	initialProducts: ProductView[]
}

export const ProductosClient = ({
	brands,
	types,
	initialProducts,
}: ProductosClientProps) => {
	const router = useRouter()
	const { sections } = useSections()
	const [activeSectionId, setActiveSectionId] = useState<string>(
		() => sections.find((s) => s.active)?.id ?? sections[0]?.id ?? 'all',
	)
	const { items, isLoading, fetchArticles } = useArticles()
	const [hasFetched, setHasFetched] = useState(false)

	const computedSections = useMemo(
		() =>
			sections.map((section) => ({
				...section,
				active: section.id === activeSectionId,
			})),
		[sections, activeSectionId],
	)

	const activeSection = computedSections.find((section) => section.active)
	const categoryFilter =
		activeSection && activeSection.id !== 'all' ? activeSection.id : null

	useEffect(() => {
		const query: ListArticlesQuery & { category_id?: string } = {
			page: 1,
			limit: 12,
		}
		if (categoryFilter) {
			query.category_id = categoryFilter
		}
		void fetchArticles(query).then(() => setHasFetched(true))
	}, [fetchArticles, categoryFilter])

	const products = useMemo<ProductView[]>(() => {
		if (!hasFetched) {
			return initialProducts
		}
		return items.map((item) => ({
			id: item._id,
			name: item.description || item.name,
			brand: item.brand || '',
			price: item.price,
			currency: 'MXN',
			stock: item.stock_web?.count ?? item.stock?.count ?? 0,
			image: getArticleImageUrl(item),
		}))
	}, [items, initialProducts, hasFetched])

	const handleSelectProduct = (productId: string) => {
		router.push(`/productos/${productId}`)
	}

	return (
		<Products
			sections={computedSections}
			brands={brands}
			types={types}
			products={products}
			isLoading={isLoading}
			onSectionSelect={setActiveSectionId}
			onSelectProduct={handleSelectProduct}
		/>
	)
}
