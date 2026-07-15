import { api, AuthRequestConfig } from '@/shared/api/axios'
import { unwrap } from '@/shared/api/utils'

const health = () =>
	unwrap<{ status: string }>(
		api.get('/health', { skipAuth: true } as AuthRequestConfig),
	)

export const healthApi = {
	health,
}
