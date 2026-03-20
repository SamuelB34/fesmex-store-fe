'use client'

import { useEffect } from 'react'
import { articlesApi } from '@/features/services/articles.api'

interface ViewTrackerProps {
	articleId: string
}

// Use window with timestamps to debounce rapid calls
declare global {
	interface Window {
		__viewTimestamps?: Map<string, number>
	}
}

const DEBOUNCE_MS = 1000 // 1 second debounce

const canRecordView = (articleId: string): boolean => {
	if (typeof window === 'undefined') return false
	
	if (!window.__viewTimestamps) {
		window.__viewTimestamps = new Map()
	}
	
	const lastRecorded = window.__viewTimestamps.get(articleId)
	const now = Date.now()
	
	if (lastRecorded && now - lastRecorded < DEBOUNCE_MS) {
		return false
	}
	
	window.__viewTimestamps.set(articleId, now)
	return true
}

export const ViewTracker = ({ articleId }: ViewTrackerProps) => {
	useEffect(() => {
		if (!canRecordView(articleId)) {
			return
		}

		articlesApi.recordView(articleId).catch((error) => {
			console.error('Error recording article view:', error)
		})
	}, [articleId])

	return null
}
