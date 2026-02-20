const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'

export class ApiError extends Error {
	constructor(
		public status: number,
		public code: string,
		message: string,
		public details?: unknown,
		public requestId?: string,
	) {
		super(message)
		this.name = 'ApiError'
	}
}

type ApiFetchOptions = RequestInit & {
	skipAuth?: boolean
}

function getToken(): string | null {
	if (typeof window === 'undefined') return null
	return localStorage.getItem('auth_token')
}

export function clearToken(): void {
	if (typeof window === 'undefined') return
	localStorage.removeItem('auth_token')
}

export function setToken(token: string): void {
	if (typeof window === 'undefined') return
	localStorage.setItem('auth_token', token)
}

function redirectToLogin(currentPath?: string): void {
	if (typeof window === 'undefined') return

	const next = currentPath || window.location.pathname + window.location.search
	const loginUrl = `/login?next=${encodeURIComponent(next)}`
	window.location.href = loginUrl
}

async function handleErrorResponse(res: Response): Promise<never> {
	let errorData: unknown
	const contentType = res.headers.get('content-type')

	try {
		if (contentType?.includes('application/json')) {
			errorData = await res.json()
		} else {
			errorData = await res.text()
		}
	} catch {
		errorData = null
	}

	let message = `HTTP ${res.status}`
	let code = `HTTP_${res.status}`
	let details: unknown = undefined
	let requestId: string | undefined = undefined

	if (errorData && typeof errorData === 'object') {
		const data = errorData as Record<string, unknown>

		if (data.error && typeof data.error === 'object') {
			const error = data.error as Record<string, unknown>
			message = (error.message as string) || message
			code = (error.code as string) || code
			details = error.details
			requestId = error.requestId as string | undefined
		} else {
			message = (data.message as string) || message
			code = (data.code as string) || code
			details = data.details
			requestId = data.requestId as string | undefined
		}
	} else if (typeof errorData === 'string') {
		message = errorData || message
	}

	if (res.status === 401 || res.status === 403) {
		clearToken()
		redirectToLogin()
	}

	throw new ApiError(res.status, code, message, details, requestId)
}

export async function apiFetch<T = unknown>(
	endpoint: string,
	options: ApiFetchOptions = {},
): Promise<T> {
	const { skipAuth = false, headers = {}, ...restOptions } = options

	const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`

	const token = skipAuth ? null : getToken()

	const finalHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...(headers as Record<string, string>),
	}

	if (token) {
		finalHeaders['Authorization'] = `Bearer ${token}`
	}

	const res = await fetch(url, {
		...restOptions,
		headers: finalHeaders,
	})

	if (!res.ok) {
		await handleErrorResponse(res)
	}

	if (res.status === 204) {
		return undefined as T
	}

	return res.json() as Promise<T>
}
