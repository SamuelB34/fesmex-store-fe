import { useState, useEffect, useCallback, useMemo } from 'react'
import { shippingApi, ShippingState } from '../services/shipping.api'

export type { ShippingState }

export function useShippingStates() {
	const [states, setStates] = useState<ShippingState[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchStates = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)
			const data = await shippingApi.getActiveStates()
			setStates(data)
		} catch (err) {
			console.error('Failed to fetch shipping states:', err)
			setError('Error al cargar estados')
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchStates()
	}, [fetchStates])

	const getStateById = useCallback(
		(stateId: string): ShippingState | undefined => {
			return states.find((s) => s._id === stateId)
		},
		[states],
	)

	const getStateByName = useCallback(
		(stateName: string): ShippingState | undefined => {
			if (!stateName) return undefined
			const normalized = stateName.toLowerCase().trim()
			return states.find((s) => s.name.toLowerCase().trim() === normalized)
		},
		[states],
	)

	const calculateShipping = useCallback(
		(stateId: string, subtotal: number): number => {
			const state = getStateById(stateId)
			if (!state) {
				console.warn(`State not found for shipping calculation: ${stateId}`)
				return 0
			}
			return Number((subtotal * state.percentage).toFixed(2))
		},
		[getStateById],
	)

	const calculateShippingByName = useCallback(
		(stateName: string, subtotal: number): number => {
			const state = getStateByName(stateName)
			if (!state) {
				console.warn(`State not found by name for shipping: ${stateName}`)
				return 0
			}
			return Number((subtotal * state.percentage).toFixed(2))
		},
		[getStateByName],
	)

	const stateOptions = useMemo(() => {
		return states.map((s) => ({
			value: s._id,
			label: s.name
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' '),
			percentage: s.percentage,
		}))
	}, [states])

	return {
		states,
		stateOptions,
		isLoading,
		error,
		fetchStates,
		getStateById,
		getStateByName,
		calculateShipping,
		calculateShippingByName,
	}
}
