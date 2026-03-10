'use client'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	ReactNode,
} from 'react'
import {
	cartApi,
	CartItem as RemoteCartItem,
	Cart as RemoteCart,
} from '@/features/services/cart.api'
import { useAuth } from '@/shared/auth/AuthProvider'

export type CartItem = {
	id: string
	image: string
	name: string
	brand: string
	unitPrice: number
	quantity: number
	stock?: number
}

export type CartContextValue = {
	items: CartItem[]
	total: number
	subtotal: number
	cartCount: number
	addItem: (item: CartItem, options?: { maxStock?: number }) => void
	removeItem: (id: string) => void
	updateQuantity: (
		id: string,
		quantity: number,
		options?: { maxStock?: number },
	) => void
	clearCart: () => void
	// Future-ready: coupon placeholder
	couponCode?: string | null
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'cartItems'

export type CartProviderProps = {
	children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
	const [items, setItems] = useState<CartItem[]>([])
	const itemsRef = useRef<CartItem[]>([])
	const prevAccessTokenRef = useRef<string | null>(null)
	const { accessToken, isBootstrapping } = useAuth()

	useEffect(() => {
		itemsRef.current = items
	}, [items])

	// Clear cart when a logged-in user logs out
	useEffect(() => {
		const prevToken = prevAccessTokenRef.current
		if (prevToken && !accessToken) {
			setItems([])
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(STORAGE_KEY)
			}
		}
		prevAccessTokenRef.current = accessToken
	}, [accessToken])

	// Load from localStorage on mount (SSR-safe) - ONLY if not authenticated
	useEffect(() => {
		if (typeof window === 'undefined') return
		if (accessToken) return // Don't load from localStorage if authenticated - wait for backend sync

		let active = true
		const load = async () => {
			try {
				const stored = window.localStorage.getItem(STORAGE_KEY)
				if (!stored) return
				const parsed: CartItem[] = JSON.parse(stored)
				if (active && Array.isArray(parsed)) {
					setItems(parsed)
				}
			} catch (error) {
				console.error('Failed to parse cart from localStorage', error)
			}
		}

		void load()

		return () => {
			active = false
		}
	}, [accessToken])

	// Persist to localStorage whenever items change
	useEffect(() => {
		if (typeof window === 'undefined') return
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
		} catch (error) {
			console.error('Failed to save cart to localStorage', error)
		}
	}, [items])

	const persistAdd = useCallback(
		async (articleId: string, delta: number, unitPrice: number) => {
			if (!accessToken || delta <= 0) return
			try {
				await cartApi.addItem({
					article_id: articleId,
					quantity: delta,
					unit_price: unitPrice,
				})
			} catch (error) {
				console.error('Failed to sync added item to backend cart', error)
			}
		},
		[accessToken],
	)

	const persistUpdate = useCallback(
		async (articleId: string, quantity: number) => {
			if (!accessToken) return
			try {
				await cartApi.updateItem({ article_id: articleId, quantity })
			} catch (error) {
				console.error('Failed to sync quantity update to backend cart', error)
			}
		},
		[accessToken],
	)

	const persistRemove = useCallback(
		async (articleId: string) => {
			if (!accessToken) return
			try {
				await cartApi.deleteItem(articleId)
			} catch (error) {
				console.error('Failed to remove item from backend cart', error)
			}
		},
		[accessToken],
	)

	const addItem = useCallback(
		(item: CartItem, options?: { maxStock?: number }) => {
			let delta = 0
			setItems((prev) => {
				const existing = prev.find((i) => i.id === item.id)
				const nextQuantity = (existing?.quantity ?? 0) + item.quantity
				const maxQuantity = options?.maxStock
					? Math.min(nextQuantity, options.maxStock)
					: nextQuantity
				const safeQuantity = Math.max(1, maxQuantity)
				delta = safeQuantity - (existing?.quantity ?? 0)

				const stockValue = item.stock ?? options?.maxStock
				if (existing) {
					return prev.map((i) =>
						i.id === item.id
							? {
									...i,
									quantity: safeQuantity,
									stock: stockValue ?? i.stock,
								}
							: i,
					)
				}
				return [...prev, { ...item, quantity: safeQuantity, stock: stockValue }]
			})

			if (delta > 0) {
				void persistAdd(item.id, delta, item.unitPrice)
			}
		},
		[persistAdd],
	)

	const removeItem = useCallback(
		(id: string) => {
			setItems((prev) => prev.filter((i) => i.id !== id))
			void persistRemove(id)
		},
		[persistRemove],
	)

	const updateQuantity = useCallback(
		(id: string, quantity: number, options?: { maxStock?: number }) => {
			let safeQuantity = quantity
			setItems((prev) => {
				const maxQuantity = options?.maxStock
					? Math.min(quantity, options.maxStock)
					: quantity
				safeQuantity = Math.max(1, maxQuantity)
				return prev.map((i) =>
					i.id === id ? { ...i, quantity: safeQuantity } : i,
				)
			})

			void persistUpdate(id, safeQuantity)
		},
		[persistUpdate],
	)

	const clearCart = useCallback(() => {
		const ids = itemsRef.current.map((item) => item.id)
		setItems([])
		if (ids.length) {
			void (async () => {
				await Promise.all(ids.map((articleId) => persistRemove(articleId)))
			})()
		}
	}, [persistRemove])

	const normalizeRemoteItems = useCallback(
		(remoteCart: RemoteCart | null | undefined): CartItem[] => {
			if (!remoteCart?.items) return []
			return remoteCart.items.map((item: RemoteCartItem) => {
				const metadata = item as RemoteCartItem & {
					image?: string
					brand?: string
					name?: string
				}
				return {
					id: item.article_id,
					image: metadata.image ?? '',
					name: metadata.name ?? 'Artículo',
					brand: metadata.brand ?? '',
					unitPrice: item.unit_price,
					quantity: item.quantity,
					stock: undefined,
				}
			})
		},
		[],
	)

	const hasSyncedRef = useRef(false)

	const syncWithBackend = useCallback(async () => {
		if (!accessToken || isBootstrapping) return
		if (hasSyncedRef.current) return
		hasSyncedRef.current = true

		try {
			const res = await cartApi
				.getCart()
				.catch(async () => await cartApi.createOrGetCart())

			const remoteCart = res.ok && res.data?.cart ? res.data.cart : null
			const backendItems = normalizeRemoteItems(remoteCart)
			const localItems = itemsRef.current

			const backendIds = new Set(backendItems.map((i) => i.id))
			const itemsToMigrate = localItems.filter((i) => !backendIds.has(i.id))

			for (const item of itemsToMigrate) {
				try {
					await cartApi.addItem({
						article_id: item.id,
						quantity: item.quantity,
						unit_price: item.unitPrice,
					})
				} catch (err) {
					console.warn(`Could not migrate item ${item.id} to backend`, err)
				}
			}

			const latest = await cartApi.getCart()
			if (latest.ok && latest.data?.cart) {
				const finalItems = normalizeRemoteItems(latest.data.cart)
				setItems(finalItems)
				if (typeof window !== 'undefined') {
					window.localStorage.removeItem(STORAGE_KEY)
				}
			}
		} catch (error) {
			console.error('Failed to synchronize cart with backend', error)
		}
	}, [accessToken, isBootstrapping, normalizeRemoteItems])

	useEffect(() => {
		if (!accessToken || isBootstrapping) return
		let active = true
		const run = async () => {
			if (!active) return
			await syncWithBackend()
		}
		void run()
		return () => {
			active = false
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accessToken, isBootstrapping])

	useEffect(() => {
		if (!accessToken) {
			hasSyncedRef.current = false
		}
	}, [accessToken])

	const total = useMemo(
		() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
		[items],
	)
	const subtotal = useMemo(() => total, [total])
	const cartCount = useMemo(
		() => items.reduce((sum, item) => sum + item.quantity, 0),
		[items],
	)

	const value = useMemo<CartContextValue>(
		() => ({
			items,
			total,
			subtotal,
			cartCount,
			addItem,
			removeItem,
			updateQuantity,
			clearCart,
			couponCode: null,
		}),
		[
			items,
			total,
			subtotal,
			cartCount,
			addItem,
			removeItem,
			updateQuantity,
			clearCart,
		],
	)

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCartContext(): CartContextValue {
	const context = useContext(CartContext)
	if (!context) {
		throw new Error('useCartContext must be used within a CartProvider')
	}
	return context
}

// Alias with friendlier name
export const useCart = useCartContext
