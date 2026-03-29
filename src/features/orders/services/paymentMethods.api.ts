import { api } from '@/shared/api/axios'

export interface PaymentMethod {
	_id: string
	brand: string
	last4: string
	exp_month: number
	exp_year: number
	is_default: boolean
	wallet?: string | null
	created_at: string
}

interface PaymentMethodsResponse {
	ok: boolean
	data?: {
		payment_methods: PaymentMethod[]
	}
	error?: {
		code?: string
		message?: string
	}
}

interface DeleteResponse {
	ok: boolean
	data?: {
		success: boolean
	}
	error?: {
		code?: string
		message?: string
	}
}

interface SetDefaultResponse {
	ok: boolean
	data?: PaymentMethod
	error?: {
		code?: string
		message?: string
	}
}

export const paymentMethodsApi = {
	getPaymentMethods: async (): Promise<PaymentMethod[]> => {
		const response = await api.get<PaymentMethodsResponse>('/payments/payment-methods')
		if (response.data.ok && response.data.data?.payment_methods) {
			return response.data.data.payment_methods
		}
		throw new Error(response.data.error?.message || 'Error al cargar métodos de pago')
	},

	deletePaymentMethod: async (paymentMethodId: string): Promise<void> => {
		const response = await api.delete<DeleteResponse>(`/payments/payment-methods/${paymentMethodId}`)
		if (!response.data.ok) {
			throw new Error(response.data.error?.message || 'Error al eliminar método de pago')
		}
	},

	setDefaultPaymentMethod: async (paymentMethodId: string): Promise<PaymentMethod> => {
		const response = await api.patch<SetDefaultResponse>(`/payments/payment-methods/${paymentMethodId}/default`)
		if (response.data.ok && response.data.data) {
			return response.data.data
		}
		throw new Error(response.data.error?.message || 'Error al establecer método de pago por defecto')
	},
}
