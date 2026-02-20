'use client'

import { useEffect } from 'react'
import { useAuth } from './AuthProvider'

type RequireAuthProps = {
	children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
	const { accessToken, isBootstrapping } = useAuth()

	useEffect(() => {
		if (!isBootstrapping && !accessToken) {
			const currentPath = window.location.pathname + window.location.search
			const loginUrl = `/login?next=${encodeURIComponent(currentPath)}`
			window.location.href = loginUrl
		}
	}, [accessToken, isBootstrapping])

	if (isBootstrapping) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '100vh',
				}}
			>
				<p>Loading...</p>
			</div>
		)
	}

	if (!accessToken) {
		return null
	}

	return <>{children}</>
}
