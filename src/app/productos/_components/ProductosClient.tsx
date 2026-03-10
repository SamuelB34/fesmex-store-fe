'use client'

import { Search } from '@/app/productos/_components/search/Search'
import { HomeProducts } from '@/app/_components/HomeProducts/HomeProducts'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Section } from '@/app/mock'
import type { ProductView } from '@/app/_components/Products/Products'

interface ProductosClientProps {
	brands: Section[]
	initialProducts: ProductView[]
	initialSearch?: string
}

export function ProductosClient({
	brands,
	initialProducts,
	initialSearch = '',
}: ProductosClientProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const urlQuery = searchParams.get('q') ?? initialSearch

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
		<>
			<Search key={urlQuery} onSearch={handleSearch} initialValue={urlQuery} />
			<HomeProducts brands={brands} initialProducts={initialProducts} />
		</>
	)
}
