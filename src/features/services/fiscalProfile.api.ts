import { api } from '@/shared/api/axios'

export type FiscalProfile = {
	_id: string
	customer_id: string
	rfc: string
	razon_social: string
	uso_cfdi: string
	regimen_fiscal: string
	cp: string
	created_at?: Date
	updated_at?: Date
}

export type CreateFiscalProfilePayload = {
	rfc: string
	razon_social: string
	uso_cfdi: string
	regimen_fiscal: string
	cp: string
}

export type UpdateFiscalProfilePayload = Partial<CreateFiscalProfilePayload>

type ApiResponse<T> = {
	ok: boolean
	data?: T
	error?: { code?: string; message?: string; requestId?: string }
}

const unwrap = async <T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<ApiResponse<T>> => {
	const res = await promise
	return res.data
}

const getFiscalProfile = () =>
	unwrap<{ fiscalProfile: FiscalProfile }>(api.get('/customers/me/fiscal-profile'))

const createFiscalProfile = (payload: CreateFiscalProfilePayload) =>
	unwrap<{ fiscalProfile: FiscalProfile }>(
		api.post('/customers/me/fiscal-profile', payload)
	)

const updateFiscalProfile = (payload: UpdateFiscalProfilePayload) =>
	unwrap<{ fiscalProfile: FiscalProfile }>(
		api.patch('/customers/me/fiscal-profile', payload)
	)

export const fiscalProfileApi = {
	getFiscalProfile,
	createFiscalProfile,
	updateFiscalProfile,
}
