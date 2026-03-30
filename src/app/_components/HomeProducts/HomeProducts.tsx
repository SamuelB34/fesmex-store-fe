'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { Products } from '@/app/_components/Products/Products'
import { getArticleImageUrl } from '@/features/services/articles.api'
import { useSections } from '@/features/categories/context/SectionsContext'
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
	brands?: Section[]
	types?: Section[]
	initialProducts?: ProductView[]
	totalProducts?: number
}

const HomeProductsContent = ({
	brands,
	types,
	initialProducts = [],
	totalProducts = 0,
}: HomeProductsProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { sections } = useSections()
	const { items, isLoading, fetchArticles, total: filteredTotal, page, totalPages } = useArticles()
	const [hasFetched, setHasFetched] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)

	const urlCategoryId = searchParams.get('category')
	const urlBrandId = searchParams.get('brand')
	const urlSearchQuery = searchParams.get('q')

	const [userSelectedCategory, setUserSelectedCategory] = useState<
		string | null
	>(null)
	const [userSelectedBrand, setUserSelectedBrand] = useState<string | null>(
		null,
	)

	const activeSectionId = userSelectedCategory ?? urlCategoryId ?? 'all'
	const activeBrandId = userSelectedBrand ?? urlBrandId ?? 'all-brands'

	const activeSections = sections
	const computedBrands = useMemo(
		() =>
			brands?.map((brand) => ({
				...brand,
				active: brand.id === activeBrandId,
			})) ?? [],
		[brands, activeBrandId],
	)

	const products = useMemo<ProductView[]>(() => {
		if (!hasFetched && initialProducts.length > 0) {
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

	const computedSections = useMemo(
		() =>
			activeSections.map((section) => ({
				...section,
				number:
					section.id === 'all' && totalProducts > 0
						? totalProducts
						: section.number,
				active: section.id === activeSectionId,
			})),
		[activeSections, activeSectionId, totalProducts],
	)

	const activeSection = computedSections.find((section) => section.active)
	const categoryFilter =
		activeSection && activeSection.id !== 'all' ? activeSection.id : null
	const brandFilter =
		activeBrandId && activeBrandId !== 'all-brands' ? activeBrandId : null

	const hasFilters = categoryFilter || brandFilter || urlSearchQuery

	useEffect(() => {
		const query: ListArticlesQuery & { category_id?: string } = {
			page: 1,
			limit: 12,
		}
		if (categoryFilter) {
			query.category_id = categoryFilter
		}
		if (brandFilter) {
			query.brand = brandFilter
		}
		if (urlSearchQuery) {
			query.q = urlSearchQuery
		}
		void fetchArticles(query).then(() => setHasFetched(true))
	}, [fetchArticles, categoryFilter, brandFilter, urlSearchQuery])

	const displayTotal = hasFilters ? filteredTotal : totalProducts

	const handleLoadMore = async () => {
		setIsLoadingMore(true)
		const nextPage = page + 1
		const query: ListArticlesQuery & { category_id?: string } = {
			page: nextPage,
			limit: 12,
		}
		if (categoryFilter) {
			query.category_id = categoryFilter
		}
		if (brandFilter) {
			query.brand = brandFilter
		}
		if (urlSearchQuery) {
			query.q = urlSearchQuery
		}
		try {
			await fetchArticles(query)
		} finally {
			setIsLoadingMore(false)
		}
	}

	const hasMoreProducts = page < totalPages

	const handleSelectProduct = (productId: string) => {
		router.push(`/productos/${productId}`)
	}

	return (
		<Products
			sections={computedSections}
			brands={computedBrands}
			types={types}
			products={products}
			totalProducts={displayTotal}
			isLoading={isLoading}
			onLoadMore={handleLoadMore}
			isLoadingMore={isLoadingMore}
			hasMoreProducts={hasMoreProducts}
			onSectionSelect={setUserSelectedCategory}
			onBrandSelect={setUserSelectedBrand}
			onSelectProduct={handleSelectProduct}
		/>
	)
}

export const HomeProducts = (props: HomeProductsProps) => {
	return (
		<Suspense fallback={<div>Loading products...</div>}>
			<HomeProductsContent {...props} />
		</Suspense>
	)
}
