import Link from 'next/link'

export default function NotFound() {
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
			<h1
				style={{
					fontSize: '4rem',
					color: 'var(--primary)',
					marginBottom: '8px',
				}}
			>
				404
			</h1>
			<h2 style={{ color: 'var(--text)', marginBottom: '12px' }}>
				Página no encontrada
			</h2>
			<p
				style={{
					color: 'var(--secondary-text)',
					marginBottom: '24px',
					maxWidth: '400px',
				}}
			>
				La página que buscas no existe o fue movida.
			</p>
			<Link
				href="/"
				style={{
					background: 'var(--primary)',
					color: '#fff',
					borderRadius: '8px',
					padding: '12px 24px',
					textDecoration: 'none',
					fontSize: '16px',
				}}
			>
				Volver al inicio
			</Link>
		</div>
	)
}
