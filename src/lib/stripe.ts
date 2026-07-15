import { loadStripe, type Stripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

export const stripePromise: Promise<Stripe | null> = STRIPE_PUBLISHABLE_KEY
	? loadStripe(STRIPE_PUBLISHABLE_KEY)
	: Promise.resolve(null)

export const isStripeConfigured = Boolean(STRIPE_PUBLISHABLE_KEY)
