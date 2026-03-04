'use client'

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	ReactNode,
} from 'react'
import type { Section } from '@/app/mock'

export type SectionsContextValue = {
	sections: Section[]
	setSections: (sections: Section[]) => void
	isLoading: boolean
	setIsLoading: (loading: boolean) => void
}

const SectionsContext = createContext<SectionsContextValue | undefined>(
	undefined,
)

export type SectionsProviderProps = {
	children: ReactNode
	initialSections?: Section[]
}

export function SectionsProvider({
	children,
	initialSections = [],
}: SectionsProviderProps) {
	const [sections, setSectionsState] = useState<Section[]>(initialSections)
	const [isLoading, setIsLoading] = useState(false)

	const setSections = useCallback((newSections: Section[]) => {
		setSectionsState(newSections)
	}, [])

	const value = useMemo<SectionsContextValue>(
		() => ({
			sections,
			setSections,
			isLoading,
			setIsLoading,
		}),
		[sections, setSections, isLoading],
	)

	return (
		<SectionsContext.Provider value={value}>
			{children}
		</SectionsContext.Provider>
	)
}

export function useSectionsContext(): SectionsContextValue {
	const context = useContext(SectionsContext)
	if (!context) {
		throw new Error('useSectionsContext must be used within a SectionsProvider')
	}
	return context
}

export const useSections = useSectionsContext
