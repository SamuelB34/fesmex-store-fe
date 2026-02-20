import { AxiosResponse } from 'axios'
import { api, AuthRequestConfig } from '@/shared/api/axios'

export type AuthUser = {
	id?: string
	_id?: string
	email: string
	first_name?: string
	last_name?: string
	mobile?: string
	status?: string
}

export type RegisterPayload = {
	email: string
	password: string
	first_name: string
	last_name: string
	mobile?: string
}

export type LoginPayload = {
	email: string
	password: string
}

export type ForgotPasswordPayload = {
	email: string
}

export type ResetPasswordPayload = {
	token: string
	password: string
}

export type EmailTokenPayload = {
	token: string
}

type ApiResponse<T> = {
	ok: boolean
	data?: T
	error?: { code?: string; message?: string; requestId?: string }
}

type UserResponse = ApiResponse<{ user: AuthUser } | AuthUser>

type CustomerResponse = ApiResponse<{ customer: AuthUser } | AuthUser>

const unwrap = async <T>(
	promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<ApiResponse<T>> => {
	const res = await promise
	return res.data
}

const register = (payload: RegisterPayload) =>
	unwrap<{
		accessToken: string
	}>(api.post('/register', payload, { skipAuth: true } as AuthRequestConfig))

const login = (payload: LoginPayload) =>
	unwrap<{
		accessToken: string
	}>(api.post('/login', payload, { skipAuth: true } as AuthRequestConfig))

const refresh = () =>
	unwrap<{
		accessToken: string
	}>(api.post('/refresh', {}, { skipAuth: true } as AuthRequestConfig))

const logout = () => unwrap(api.post('/logout', {}))

const logoutAll = () => unwrap(api.post('/logout-all', {}))

const me = () => unwrap<UserResponse>(api.get('/me'))

const customerMe = () => unwrap<CustomerResponse>(api.get('/customers/me'))

const forgotPassword = (payload: ForgotPasswordPayload) =>
	unwrap<{ sent: boolean }>(
		api.post('/password/forgot', payload, {
			skipAuth: true,
		} as AuthRequestConfig),
	)

const resetPassword = (payload: ResetPasswordPayload) =>
	unwrap<{ reset: boolean }>(
		api.post('/password/reset', payload, {
			skipAuth: true,
		} as AuthRequestConfig),
	)

const verifyEmail = (payload: EmailTokenPayload) =>
	unwrap<{ verified: boolean }>(
		api.post('/email/verify', payload, { skipAuth: true } as AuthRequestConfig),
	)

const resendEmail = (payload: { email: string }) =>
	unwrap<{ sent: boolean }>(
		api.post('/email/resend', payload, { skipAuth: true } as AuthRequestConfig),
	)

export const authApi = {
	register,
	login,
	refresh,
	logout,
	logoutAll,
	forgotPassword,
	resetPassword,
	verifyEmail,
	resendEmail,
	me,
	customerMe,
}
