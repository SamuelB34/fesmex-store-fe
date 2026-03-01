'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { Products } from '@/app/_components/Products/Products'
import { getArticleImageUrl } from '@/features/services/articles.api'
import type { Section } from '@/app/mock'
import type { ListArticlesQuery } from '@/features/services/articles.api'

interface ProductView {
	id: string
	name: string
	brand: string
	price: number
	currency: string
	stock: number
	image: string
}

interface HomeProductsProps {
	sections: Section[]
}

export const HomeProducts = ({ sections }: HomeProductsProps) => {
	const router = useRouter()
	const [activeSectionId, setActiveSectionId] = useState<string>(() => sections[0]?.id ?? 'all')
	const { items, isLoading, fetchArticles } = useArticles()

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
		fetchArticles(query)
	}, [fetchArticles, categoryFilter])

	const products = useMemo<ProductView[]>(
		() =>
			items.map((item) => ({
				id: item._id,
				name: item.description || item.name,
				brand: item.brand || '',
				price: item.price,
				currency: 'MXN',
				stock: item.stock_web?.count ?? item.stock?.count ?? 0,
				image: getArticleImageUrl(item),
			})),
		[items],
	)

	const handleSelectProduct = (productId: string) => {
		router.push(`/productos/${productId}`)
	}

	return (
		<Products
			sections={computedSections}
			products={products}
			isLoading={isLoading}
			onSectionSelect={setActiveSectionId}
			onSelectProduct={handleSelectProduct}
		/>
	)
}
