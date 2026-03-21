'use client'

import { useEffect } from 'react'
import { useBrands } from '@/features/brands/context/BrandsContext'
import type { Section } from '@/app/mock'

interface BrandsInitializerProps {
	brands: Section[]
}

export function BrandsInitializer({ brands }: BrandsInitializerProps) {
	const { setBrands } = useBrands()

	useEffect(() => {
		if (brands.length > 0) {
			setBrands(brands)
		}
	}, [brands, setBrands])

	return null
}
