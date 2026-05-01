'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import styles from './StripePaymentSection.module.scss'

export type PaymentErrorType = 'declined' | 'canceled' | 'generic'

export type PaymentIntentStatus =
	| 'succeeded'
	| 'processing'
	| 'requires_action'
	| 'requires_payment_method'
	| 'canceled'

export interface StripePaymentSectionRef {
	validatePaymentDetails: () => Promise<{
		success: boolean
		errorType?: PaymentErrorType
		error?: string
	}>
	confirmPayment: (clientSecret: string) => Promise<{
		success: boolean
		errorType?: PaymentErrorType
		error?: string
		intentStatus?: PaymentIntentStatus
	}>
	isReady: boolean
}

// PaymentElement supports Apple Pay, Google Pay, and cards automatically
// when PaymentIntent has automatic_payment_methods.enabled = true
export const StripePaymentSection = forwardRef<StripePaymentSectionRef, object>(
	function StripePaymentSection(_, ref) {
		const stripe = useStripe()
		const elements = useElements()
		const [isReady, setIsReady] = useState(false)
		const [error, setError] = useState<string | null>(null)

		const mapConfirmError = (confirmError: {
			type?: string
			code?: string
			message?: string | null
		}) => {
			let errorType: PaymentErrorType = 'generic'

			if (confirmError.type === 'card_error') {
				errorType = 'declined'
			} else if (
				confirmError.code === 'payment_intent_authentication_failure' ||
				confirmError.message?.toLowerCase().includes('cancel')
			) {
				errorType = 'canceled'
			}

			return {
				errorType,
				error: confirmError.message || 'Payment failed',
			}
		}

		useImperativeHandle(ref, () => ({
			isReady,
			validatePaymentDetails: async () => {
				if (!stripe || !elements) {
					return {
						success: false,
						errorType: 'generic' as const,
						error: 'Stripe not loaded',
					}
				}

				const { error: submitError } = await elements.submit()
				if (submitError) {
					setError(submitError.message ?? 'Payment failed')
					return {
						success: false,
						errorType: 'generic' as const,
						error: submitError.message,
					}
				}

				setError(null)

				return { success: true }
			},
			confirmPayment: async (clientSecret: string) => {
				if (!stripe || !elements) {
					return {
						success: false,
						errorType: 'generic' as const,
						error: 'Stripe not loaded',
					}
				}

				if (!clientSecret) {
					return {
						success: false,
						errorType: 'generic' as const,
						error: 'Missing payment client secret',
					}
				}

				// Submit elements first to validate
				const { error: submitError } = await elements.submit()
				if (submitError) {
					setError(submitError.message ?? 'Payment failed')
					return {
						success: false,
						errorType: 'generic' as const,
						error: submitError.message,
					}
				}

				// confirmPayment handles all payment methods (cards, Apple Pay, Google Pay)
				const { error: confirmError, paymentIntent } =
					await stripe.confirmPayment({
						elements,
						clientSecret,
						confirmParams: {
							return_url: window.location.href,
						},
						redirect: 'if_required',
					})

				if (confirmError) {
					const { errorType, error } = mapConfirmError(confirmError)
					setError(error ?? 'Payment failed')
					return {
						success: false,
						errorType,
						error,
					}
				}

				setError(null)

				// No error from Stripe = payment accepted
				// paymentIntent may be undefined in rare cases (e.g., redirect flows)
				// If undefined, treat as success and let polling verify with backend
				if (!paymentIntent) {
					return { success: true, intentStatus: undefined }
				}

				const status = paymentIntent.status as PaymentIntentStatus

				// succeeded or processing = payment accepted, proceed to polling
				if (status === 'succeeded' || status === 'processing') {
					return { success: true, intentStatus: status }
				}

				// requires_action should not happen with redirect: 'if_required'
				if (status === 'requires_action') {
					return {
						success: false,
						errorType: 'canceled' as const,
						error: 'Additional authentication required',
						intentStatus: status,
					}
				}

				// Any other status is unexpected
				return {
					success: false,
					errorType: 'generic' as const,
					error: 'Payment not completed',
					intentStatus: status,
				}
			},
		}))

		return (
			<div className={styles.stripeSection}>
				<PaymentElement
					options={{
						layout: 'tabs',
						wallets: {
							applePay: 'auto',
							googlePay: 'auto',
						},
					}}
					onReady={() => setIsReady(true)}
					onChange={(event) => {
						if (event.complete) {
							setError(null)
						}
					}}
				/>
				{error && <p className={styles.error}>{error}</p>}
			</div>
		)
	},
)
