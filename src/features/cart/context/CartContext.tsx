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
	refreshCart: () => Promise<void>
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

	// Fetch cart from backend and update local state
	const refreshCart = useCallback(async () => {
		if (!accessToken) return
		try {
			const res = await cartApi.getCart()
			if (res.ok && res.data?.cart) {
				const backendItems = normalizeRemoteItems(res.data.cart)
				setItems(backendItems)
			}
		} catch (error) {
			console.error('Failed to refresh cart from backend', error)
		}
	}, [accessToken, normalizeRemoteItems])

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
		if (accessToken) return

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

	// Persist to localStorage whenever items change (for non-authenticated users)
	useEffect(() => {
		if (typeof window === 'undefined') return
		if (accessToken) return // Don't persist to localStorage if authenticated
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
		} catch (error) {
			console.error('Failed to save cart to localStorage', error)
		}
	}, [items, accessToken])

	// Add item and sync with backend
	const addItem = useCallback(
		async (item: CartItem, options?: { maxStock?: number }) => {
			const existing = itemsRef.current.find((i) => i.id === item.id)
			const nextQuantity = (existing?.quantity ?? 0) + item.quantity
			const maxQuantity = options?.maxStock
				? Math.min(nextQuantity, options.maxStock)
				: nextQuantity
			const safeQuantity = Math.max(1, maxQuantity)
			const delta = safeQuantity - (existing?.quantity ?? 0)

			// Optimistic update
			const stockValue = item.stock ?? options?.maxStock
			setItems((prev) => {
				if (existing) {
					return prev.map((i) =>
						i.id === item.id
							? { ...i, quantity: safeQuantity, stock: stockValue ?? i.stock }
							: i,
					)
				}
				return [...prev, { ...item, quantity: safeQuantity, stock: stockValue }]
			})

			// Sync with backend
			if (accessToken && delta > 0) {
				try {
					await cartApi.addItem({
						article_id: item.id,
						quantity: delta,
						unit_price: item.unitPrice,
					})
					// Refresh from backend to ensure consistency
					await refreshCart()
				} catch (error) {
					console.error('Failed to sync added item to backend cart', error)
				}
			}
		},
		[accessToken, refreshCart],
	)

	// Remove item and sync with backend
	const removeItem = useCallback(
		async (id: string) => {
			// Optimistic update
			setItems((prev) => prev.filter((i) => i.id !== id))

			// Sync with backend
			if (accessToken) {
				try {
					await cartApi.deleteItem(id)
				} catch (error) {
					console.error('Failed to remove item from backend cart', error)
				}
			}
		},
		[accessToken],
	)

	// Update quantity and sync with backend
	const updateQuantity = useCallback(
		async (id: string, quantity: number, options?: { maxStock?: number }) => {
			const maxQuantity = options?.maxStock
				? Math.min(quantity, options.maxStock)
				: quantity
			const safeQuantity = Math.max(1, maxQuantity)

			// Optimistic update
			setItems((prev) =>
				prev.map((i) => (i.id === id ? { ...i, quantity: safeQuantity } : i)),
			)

			// Sync with backend
			if (accessToken) {
				try {
					await cartApi.updateItem({ article_id: id, quantity: safeQuantity })
				} catch (error) {
					console.error('Failed to sync quantity update to backend cart', error)
				}
			}
		},
		[accessToken],
	)

	// Clear cart - just clear local state, backend is already cleared by order service
	const clearCart = useCallback(() => {
		setItems([])
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(STORAGE_KEY)
		}
	}, [])

	const hasSyncedRef = useRef(false)

	// Initial sync with backend when user logs in
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

			// Migrate local items to backend if they don't exist there
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

			// Fetch final state from backend
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
			refreshCart,
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
			refreshCart,
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
