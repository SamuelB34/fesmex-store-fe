'use client'

import { useEffect } from 'react'
import { useSections } from '@/features/categories/context/SectionsContext'
import type { Section } from '@/app/mock'

interface SectionsInitializerProps {
	sections: Section[]
}

export function SectionsInitializer({ sections }: SectionsInitializerProps) {
	const { setSections } = useSections()

	useEffect(() => {
		if (sections.length > 0) {
			setSections(sections)
		}
	}, [sections, setSections])

	return null
}
