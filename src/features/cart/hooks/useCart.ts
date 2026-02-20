'use client'

import { useState, useCallback } from 'react'
import {
	cartApi,
	Cart,
	CartItemPayload,
	CartUpdatePayload,
} from '@/features/services/cart.api'
import { ApiError } from '@/shared/api/axios'

type UseCartState = {
	cart: Cart | null
	isLoading: boolean
	error: string | null
}

export function useCart() {
	const [state, setState] = useState<UseCartState>({
		cart: null,
		isLoading: false,
		error: null,
	})

	const fetchCart = useCallback(async () => {
		setState((prev) => ({ ...prev, isLoading: true, error: null }))
		try {
			const res = await cartApi.getCart()
			if (res.ok && res.data) {
				setState({ cart: res.data.cart, isLoading: false, error: null })
			} else {
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: res.error?.message ?? 'Failed to load cart',
				}))
			}
		} catch (err) {
			const message =
				err instanceof ApiError ? err.message : 'Failed to load cart'
			setState((prev) => ({ ...prev, isLoading: false, error: message }))
		}
	}, [])

	const addItem = useCallback(async (payload: CartItemPayload) => {
		setState((prev) => ({ ...prev, error: null }))
		try {
			const res = await cartApi.addItem(payload)
			if (res.ok && res.data) {
				setState((prev) => ({ ...prev, cart: res.data!.cart }))
			} else {
				setState((prev) => ({
					...prev,
					error: res.error?.message ?? 'Failed to add item',
				}))
			}
		} catch (err) {
			const message =
				err instanceof ApiError ? err.message : 'Failed to add item'
			setState((prev) => ({ ...prev, error: message }))
		}
	}, [])

	const updateItem = useCallback(async (payload: CartUpdatePayload) => {
		setState((prev) => ({ ...prev, error: null }))
		try {
			const res = await cartApi.updateItem(payload)
			if (res.ok && res.data) {
				setState((prev) => ({ ...prev, cart: res.data!.cart }))
			} else {
				setState((prev) => ({
					...prev,
					error: res.error?.message ?? 'Failed to update item',
				}))
			}
		} catch (err) {
			const message =
				err instanceof ApiError ? err.message : 'Failed to update item'
			setState((prev) => ({ ...prev, error: message }))
		}
	}, [])

	const removeItem = useCallback(async (articleId: string) => {
		setState((prev) => ({ ...prev, error: null }))
		try {
			const res = await cartApi.deleteItem(articleId)
			if (res.ok && res.data) {
				setState((prev) => ({ ...prev, cart: res.data!.cart }))
			} else {
				setState((prev) => ({
					...prev,
					error: res.error?.message ?? 'Failed to remove item',
				}))
			}
		} catch (err) {
			const message =
				err instanceof ApiError ? err.message : 'Failed to remove item'
			setState((prev) => ({ ...prev, error: message }))
		}
	}, [])

	return { ...state, fetchCart, addItem, updateItem, removeItem }
}
