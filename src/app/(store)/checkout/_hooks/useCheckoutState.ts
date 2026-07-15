'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { sileo } from 'sileo'
import { useAuth } from '@/shared/auth/AuthProvider'
import { useCart } from '@/features/cart/context/CartContext'
import { useShippingAddresses } from '@/features/orders/hooks/useOrders'
import { useShippingStates } from '@/features/shipping'
import type { PaymentMethod, CreateOrderPayload } from '@/features/orders/services/orders.api'

export type DeliveryType = 'shipping' | 'pickup'

export type CheckoutFormValues = {
	fullName: string
	phone: string
	line1: string
	line2: string
	city: string
	state: string
	postalCode: string
	notes: string
}

export const PICKUP_LOCATIONS = [
	{
		id: 'mxli',
		name: 'Almacén Mexicali',
		address:
			'Blvd. Adolfo López Mateos 2292-4, Zona Industrial, 21389 Mexicali, B.C.',
		delivery: 'ENTREGA INMEDIATA',
	},
]

export const STRIPE_MIN_CARD_AMOUNT_MXN = 10

export function useCheckoutState() {
	const router = useRouter()
	const { user, accessToken, isBootstrapping } = useAuth()
	const { items, total, clearCart, updateQuantity, removeItem } = useCart()
	const {
		addresses,
		isLoading: isLoadingAddresses,
		fetchAddresses,
	} = useShippingAddresses()
	const {
		stateOptions,
		isLoading: isLoadingStates,
		getStateByName,
		calculateShipping,
	} = useShippingStates()

	const [deliveryType, setDeliveryType] = useState<DeliveryType>('shipping')
	const [selectedAddressIndex, setSelectedAddressIndex] = useState<
		number | 'new'
	>('new')
	const [pickupLocation, setPickupLocation] = useState<string>('mxli')
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')
	const [selectedStateId, setSelectedStateId] = useState<string>('')
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
		string | null
	>(null)
	const [savePaymentMethod, setSavePaymentMethod] = useState(false)
	const [pendingFormValues, setPendingFormValues] =
		useState<CheckoutFormValues | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<CheckoutFormValues>({
		mode: 'onChange',
		defaultValues: {
			fullName: '',
			phone: '',
			line1: '',
			line2: '',
			city: '',
			state: '',
			postalCode: '',
			notes: '',
		},
	})

	// Derive estimatedShipping from state instead of setState-in-effect
	const estimatedShipping = useMemo(() => {
		if (deliveryType !== 'shipping' || !selectedStateId) return 0
		return calculateShipping(selectedStateId, total)
	}, [deliveryType, selectedStateId, total, calculateShipping])

	const grandTotal = useMemo(
		() => total + (deliveryType === 'shipping' ? estimatedShipping : 0),
		[total, estimatedShipping, deliveryType],
	)

	const shouldSavePaymentMethod =
		paymentMethod === 'CARD' && !selectedPaymentMethodId && savePaymentMethod

	const isFormReady = useMemo(() => {
		let isAddressValid = false
		if (deliveryType === 'pickup') {
			isAddressValid = true
		} else if (selectedAddressIndex !== 'new') {
			const addr = addresses[selectedAddressIndex]
			isAddressValid = Boolean(addr)
		} else {
			isAddressValid = isValid && Boolean(selectedStateId)
		}
		return isAddressValid
	}, [deliveryType, selectedAddressIndex, isValid, selectedStateId, addresses])

	// Redirect if not logged in or account not verified
	useEffect(() => {
		if (isBootstrapping) return

		if (!accessToken) {
			sileo.error({
				title: 'Inicia sesión',
				description: 'Debes iniciar sesión para continuar con tu compra.',
			})
			router.push('/')
			return
		}

		if (user?.status !== 'active') {
			sileo.error({
				title: 'Cuenta no verificada',
				description:
					'Debes verificar tu correo electrónico para poder realizar compras.',
			})
			router.push('/account')
			return
		}
	}, [accessToken, user, isBootstrapping, router])

	useEffect(() => {
		fetchAddresses()
	}, [fetchAddresses])

	// Handle state change from NewAddressForm
	const handleNewAddressStateChange = (stateId: string) => {
		setSelectedStateId(stateId)
	}

	// Handle payment method change — reset dependent state directly
	const handlePaymentMethodChange = (method: PaymentMethod) => {
		setPaymentMethod(method)
		setSelectedPaymentMethodId(null)
		setSavePaymentMethod(false)
	}

	// Handle address selection — set stateId for shipping calculation
	const handleSelectAddress = (index: number | 'new') => {
		setSelectedAddressIndex(index)
		if (index === 'new') {
			setSelectedStateId('')
		} else if (addresses[index]) {
			const state = getStateByName(addresses[index].state)
			setSelectedStateId(state?._id ?? '')
		}
	}

	const showStripeMinimumAmountError = () => {
		sileo.error({
			title: 'Monto mínimo no alcanzado',
			description: `Stripe requiere un mínimo de ${STRIPE_MIN_CARD_AMOUNT_MXN} MXN para pagos con tarjeta. Ajusta tu carrito o usa transferencia bancaria.`,
		})
	}

	const onSubmit = handleSubmit(async (values) => {
		if (paymentMethod === 'CARD') {
			if (grandTotal < STRIPE_MIN_CARD_AMOUNT_MXN) {
				showStripeMinimumAmountError()
				return
			}
		}
		setPendingFormValues(values)
		setShowConfirmModal(true)
	})

	const buildOrderPayload = (values: CheckoutFormValues): CreateOrderPayload => {
		const payload: CreateOrderPayload = {
			payment_method: paymentMethod,
			notes: values.notes,
			delivery_type: deliveryType,
			...(shouldSavePaymentMethod ? { save_payment_method: true } : {}),
			...(selectedPaymentMethodId
				? { provider_payment_method_id: selectedPaymentMethodId }
				: {}),
		}

		if (deliveryType === 'shipping') {
			if (selectedAddressIndex !== 'new' && addresses[selectedAddressIndex]) {
				payload.shipping_address = addresses[selectedAddressIndex]
			} else {
				payload.shipping_address = {
					full_name: values.fullName,
					phone: values.phone,
					line1: values.line1,
					line2: values.line2,
					city: values.city,
					state: values.state,
					postal_code: values.postalCode,
					country: 'MX',
				}
			}
		}

		return payload
	}

	return {
		// Auth
		user,
		accessToken,
		isBootstrapping,
		// Cart
		items,
		total,
		clearCart,
		updateQuantity,
		removeItem,
		// Addresses
		addresses,
		isLoadingAddresses,
		// States
		stateOptions,
		isLoadingStates,
		// Form
		register,
		handleSubmit: onSubmit,
		errors,
		isValid,
		// State
		deliveryType,
		setDeliveryType,
		selectedAddressIndex,
		handleSelectAddress,
		pickupLocation,
		setPickupLocation,
		paymentMethod,
		handlePaymentMethodChange,
		estimatedShipping,
		selectedStateId,
		showConfirmModal,
		setShowConfirmModal,
		selectedPaymentMethodId,
		setSelectedPaymentMethodId,
		savePaymentMethod,
		setSavePaymentMethod,
		pendingFormValues,
		setPendingFormValues,
		// Derived
		grandTotal,
		shouldSavePaymentMethod,
		isFormReady,
		// Helpers
		handleNewAddressStateChange,
		showStripeMinimumAmountError,
		buildOrderPayload,
	}
}
