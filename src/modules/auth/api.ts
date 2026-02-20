const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'

type LoginBody = {
	email: string
	password: string
}

type LoginResponse = {
	ok: true
	token: string
	customer: Record<string, unknown>
}

type MeResponse = {
	ok: true
	customer: Record<string, unknown> | null
}

async function handleResponse<T>(res: Response): Promise<T> {
	if (!res.ok) {
		const message = await res.text()
		throw new Error(message || `Error ${res.status}`)
	}
	return res.json() as Promise<T>
}

export async function login(body: LoginBody): Promise<LoginResponse> {
	const res = await fetch(`${API_BASE}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	return handleResponse<LoginResponse>(res)
}

export async function me(token: string): Promise<MeResponse> {
	const res = await fetch(`${API_BASE}/me`, {
		headers: { Authorization: `Bearer ${token}` },
	})
	return handleResponse<MeResponse>(res)
}
