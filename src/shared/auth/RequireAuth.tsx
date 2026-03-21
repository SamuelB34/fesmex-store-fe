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
			window.location.href = '/'
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
