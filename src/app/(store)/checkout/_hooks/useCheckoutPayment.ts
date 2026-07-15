'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { sileo } from 'sileo'
import { useCreateOrder } from '@/features/orders/hooks/useOrders'
import { ordersApi, type CreateOrderPayload } from '@/features/orders/services/orders.api'
import { isStripeConfigured } from '@/lib/stripe'
import type { StripePaymentSectionRef, PaymentErrorType } from '../_components/StripePaymentSection/StripePaymentSection'
import type { CheckoutFormValues } from './useCheckoutState'
import { STRIPE_MIN_CARD_AMOUNT_MXN } from './useCheckoutState'

interface UseCheckoutPaymentParams {
	paymentMethod: 'CARD' | 'TRANSFER'
	selectedPaymentMethodId: string | null
	grandTotal: number
	stripePaymentRef: React.RefObject<StripePaymentSectionRef | null>
	buildOrderPayload: (values: CheckoutFormValues) => CreateOrderPayload
	clearCart: () => void
	showStripeMinimumAmountError: () => void
}

export function useCheckoutPayment({
	paymentMethod,
	selectedPaymentMethodId,
	grandTotal,
	stripePaymentRef,
	buildOrderPayload,
	clearCart,
	showStripeMinimumAmountError,
}: UseCheckoutPaymentParams) {
	const router = useRouter()
	const { createOrder, isSubmitting } = useCreateOrder()
	const [isProcessingPayment, setIsProcessingPayment] = useState(false)
	const [paymentLoaderMessage, setPaymentLoaderMessage] = useState('')
	const confirmOrderLockRef = useRef(false)

	const handlePaymentError = (
		errorType?: PaymentErrorType,
		errorMessage?: string,
	) => {
		if (errorType === 'declined') {
			sileo.error({
				title: 'Pago rechazado',
				description: 'Tu banco rechazó la operación. Intenta nuevamente.',
			})
		} else if (errorType === 'canceled') {
			sileo.warning({
				title: 'Autenticación cancelada',
				description: 'No se completó la verificación bancaria.',
			})
		} else {
			sileo.error({
				title: 'Error en el pago',
				description: errorMessage || 'No se pudo procesar el pago.',
			})
		}
	}

	const handleConfirmOrder = async (
		values: CheckoutFormValues,
		onSuccess: () => void,
	) => {
		if (confirmOrderLockRef.current) return
		confirmOrderLockRef.current = true

		try {
			if (paymentMethod === 'CARD' && !isStripeConfigured) {
				sileo.error({
					title: 'Pago no disponible',
					description: 'El pago con tarjeta no está configurado. Usa transferencia bancaria.',
				})
				return
			}

			if (paymentMethod === 'CARD' && grandTotal < STRIPE_MIN_CARD_AMOUNT_MXN) {
				showStripeMinimumAmountError()
				return
			}

			setIsProcessingPayment(true)
			setPaymentLoaderMessage(
				paymentMethod === 'CARD' ? 'Procesando pago...' : 'Procesando pedido...',
			)

			if (paymentMethod === 'CARD') {
				const paymentMethodId = selectedPaymentMethodId
				const paymentRef = stripePaymentRef.current

				if (!paymentMethodId && !paymentRef) {
					sileo.error({
						title: 'Error de pago',
						description: 'Stripe no está disponible. Recarga la página.',
					})
					return
				}

				if (!paymentMethodId) {
					const validation = await paymentRef!.validatePaymentDetails()
					if (!validation.success) {
						handlePaymentError(validation.errorType, validation.error)
						return
					}
				}

				const payload = buildOrderPayload(values)
				const result = await createOrder(payload)

				if (!result) {
					sileo.error({
						title: 'Error al crear el pedido',
						description: 'No se pudo crear el pedido. Intenta nuevamente.',
					})
					return
				}

				const { order, paymentIntent } = result

				if (paymentMethodId) {
					// Saved payment method - backend already confirmed it
				} else {
					if (!paymentIntent?.client_secret) {
						sileo.error({
							title: 'Error de pago',
							description: 'No se pudo inicializar el pago.',
						})
						return
					}

					const { success, errorType, error } =
						await paymentRef!.confirmPayment(
							paymentIntent.client_secret,
						)

					if (!success) {
						handlePaymentError(errorType, error)
						return
					}
				}

				// Poll backend until payment_status = PAID (webhook processed)
				setPaymentLoaderMessage('Verificando pago...')

				const maxAttempts = 10
				let attempts = 0
				let isPaid = false

				while (attempts < maxAttempts && !isPaid) {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					try {
						const { order: updatedOrder } = await ordersApi.getOrderById(
							order._id,
						)
						if (updatedOrder.payment_status === 'PAID') {
							isPaid = true
						}
					} catch {
						// Continue polling
					}
					attempts++
				}

				if (!isPaid) {
					console.warn('Payment confirmed but webhook not yet processed')
				}
			} else {
				// TRANSFER: create order now
				const payload = buildOrderPayload(values)
				const result = await createOrder(payload)

				if (!result) {
					sileo.error({
						title: 'Error al crear el pedido',
						description: 'No se pudo crear el pedido. Intenta nuevamente.',
					})
					return
				}
			}

			// Clear cart only after payment confirmed
			clearCart()

			sileo.success({
				title: '¡Pedido creado exitosamente!',
				description: 'Se te enviará un correo de confirmación',
			})
			onSuccess()
			setTimeout(() => {
				router.push('/account?tab=orders')
			}, 500)
		} catch (error) {
			console.error('Error creating order:', error)
			sileo.error({
				title: 'Error al procesar tu pedido',
				description: 'Ocurrió un error inesperado. Intenta nuevamente.',
			})
		} finally {
			confirmOrderLockRef.current = false
			setIsProcessingPayment(false)
			setPaymentLoaderMessage('')
		}
	}

	return {
		isSubmitting,
		isProcessingPayment,
		paymentLoaderMessage,
		confirmOrderLockRef,
		handleConfirmOrder,
		handlePaymentError,
	}
}
