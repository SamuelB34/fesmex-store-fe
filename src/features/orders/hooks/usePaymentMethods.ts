'use client'

import { useState, useCallback, useEffect } from 'react'
import { paymentMethodsApi, type PaymentMethod } from '../services/paymentMethods.api'

export function usePaymentMethods() {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchPaymentMethods = useCallback(async () => {
		setIsLoading(true)
		setError(null)
		try {
			const methods = await paymentMethodsApi.getPaymentMethods()
			setPaymentMethods(methods)
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Error al cargar métodos de pago'
			setError(message)
			console.error('Error fetching payment methods:', err)
		} finally {
			setIsLoading(false)
		}
	}, [])

	const deletePaymentMethod = useCallback(async (paymentMethodId: string) => {
		try {
			await paymentMethodsApi.deletePaymentMethod(paymentMethodId)
			setPaymentMethods((prev) => prev.filter((pm) => pm._id !== paymentMethodId))
			setError(null)
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Error al eliminar método de pago'
			setError(message)
			console.error('Error deleting payment method:', err)
			throw err
		}
	}, [])

	const setDefaultPaymentMethod = useCallback(async (paymentMethodId: string) => {
		try {
			await paymentMethodsApi.setDefaultPaymentMethod(paymentMethodId)
			setPaymentMethods((prev) =>
				prev.map((pm) => ({
					...pm,
					is_default: pm._id === paymentMethodId,
				}))
			)
			setError(null)
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Error al establecer método de pago por defecto'
			setError(message)
			console.error('Error setting default payment method:', err)
			throw err
		}
	}, [])

	useEffect(() => {
		fetchPaymentMethods()
	}, [fetchPaymentMethods])

	return {
		paymentMethods,
		isLoading,
		error,
		fetchPaymentMethods,
		deletePaymentMethod,
		setDefaultPaymentMethod,
	}
}
