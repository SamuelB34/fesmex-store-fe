'use client'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	ReactNode,
} from 'react'

export type CartItem = {
	id: string
	image: string
	name: string
	brand: string
	unitPrice: number
	quantity: number
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

	// Load from localStorage on mount (SSR-safe)
	useEffect(() => {
		if (typeof window === 'undefined') return

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
	}, [])

	// Persist to localStorage whenever items change
	useEffect(() => {
		if (typeof window === 'undefined') return
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
		} catch (error) {
			console.error('Failed to save cart to localStorage', error)
		}
	}, [items])

	const addItem = useCallback(
		(item: CartItem, options?: { maxStock?: number }) => {
			setItems((prev) => {
				const existing = prev.find((i) => i.id === item.id)
				const nextQuantity = (existing?.quantity ?? 0) + item.quantity
				const maxQuantity = options?.maxStock
					? Math.min(nextQuantity, options.maxStock)
					: nextQuantity
				const safeQuantity = Math.max(1, maxQuantity)

				if (existing) {
					return prev.map((i) =>
						i.id === item.id ? { ...i, quantity: safeQuantity } : i,
					)
				}
				return [...prev, { ...item, quantity: safeQuantity }]
			})
		},
		[],
	)

	const removeItem = useCallback((id: string) => {
		setItems((prev) => prev.filter((i) => i.id !== id))
	}, [])

	const updateQuantity = useCallback(
		(id: string, quantity: number, options?: { maxStock?: number }) => {
			setItems((prev) => {
				const maxQuantity = options?.maxStock
					? Math.min(quantity, options.maxStock)
					: quantity
				const safeQuantity = Math.max(1, maxQuantity)
				return prev.map((i) =>
					i.id === id ? { ...i, quantity: safeQuantity } : i,
				)
			})
		},
		[],
	)

	const clearCart = useCallback(() => {
		setItems([])
	}, [])

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
