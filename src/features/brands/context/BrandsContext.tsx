'use client'

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react'
import type { Section } from '@/app/mock'

export type BrandsContextValue = {
	brands: Section[]
	setBrands: (brands: Section[]) => void
	isLoading: boolean
	setIsLoading: (loading: boolean) => void
}

const BrandsContext = createContext<BrandsContextValue | undefined>(undefined)

interface BrandsProviderProps {
	children: ReactNode
	initialBrands?: Section[]
}

export function BrandsProvider({ children, initialBrands = [] }: BrandsProviderProps) {
	const [brands, setBrandsState] = useState<Section[]>(initialBrands)
	const [isLoading, setIsLoading] = useState(false)

	const setBrands = useCallback((nextBrands: Section[]) => {
		setBrandsState(nextBrands)
	}, [])

	const value = useMemo<BrandsContextValue>(
		() => ({
			brands,
			setBrands,
			isLoading,
			setIsLoading,
		}),
		[brands, setBrands, isLoading],
	)

	return <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>
}

export function useBrandsContext(): BrandsContextValue {
	const context = useContext(BrandsContext)
	if (!context) {
		throw new Error('useBrands must be used within a BrandsProvider')
	}
	return context
}

export const useBrands = useBrandsContext
