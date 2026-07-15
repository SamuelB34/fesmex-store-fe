'use client'

import { useEffect } from 'react'
import { sileo } from 'sileo'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error('Page error:', error)
	}, [error])

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '60vh',
				padding: '32px',
				textAlign: 'center',
			}}
		>
			<h2 style={{ color: 'var(--primary)', marginBottom: '12px' }}>
				Algo salió mal
			</h2>
			<p
				style={{
					color: 'var(--secondary-text)',
					marginBottom: '24px',
					maxWidth: '400px',
				}}
			>
				Ocurrió un error inesperado. Puedes intentar recargar la página.
			</p>
			<button
				onClick={() => {
					reset()
					sileo.success({ title: 'Reintentando', description: 'Recargando...' })
				}}
				style={{
					background: 'var(--primary)',
					color: '#fff',
					border: 'none',
					borderRadius: '8px',
					padding: '12px 24px',
					cursor: 'pointer',
					fontSize: '16px',
				}}
			>
				Reintentar
			</button>
		</div>
	)
}
