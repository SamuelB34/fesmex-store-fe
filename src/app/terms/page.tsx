import type { CSSProperties } from 'react'

export const metadata = {
	title: 'Términos de Uso | FESMEX',
	description: 'Revisa los términos de uso aplicables al sitio y a las compras realizadas en FESMEX.',
}

const sectionStyle: CSSProperties = {
	maxWidth: '900px',
	margin: '0 auto',
	padding: '48px 20px 80px',
	lineHeight: 1.7,
	color: '#1f2937',
}

const cardStyle: CSSProperties = {
	background: '#fff',
	border: '1px solid #e5e7eb',
	borderRadius: '16px',
	padding: '24px',
	boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
	marginTop: '24px',
}

export default function TermsPage() {
	return (
		<main style={sectionStyle}>
			<h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px' }}>
				Términos de Uso
			</h1>
			<p style={{ color: '#6b7280', marginBottom: '24px' }}>
				Última actualización: 1 de mayo de 2026
			</p>

			<section style={cardStyle}>
				<p>
					Al usar este sitio aceptas los siguientes términos generales de uso.
					Te recomendamos leer esta información antes de realizar una compra.
				</p>

				<h2 style={{ fontSize: '1.35rem', marginTop: '24px', marginBottom: '12px' }}>
					Uso del sitio
				</h2>
				<ul style={{ paddingLeft: '20px', margin: 0 }}>
					<li>Debes proporcionar información veraz y actualizada.</li>
					<li>No está permitido usar el sitio para actividades ilícitas o fraudulentas.</li>
					<li>Podemos modificar, suspender o mejorar funcionalidades en cualquier momento.</li>
				</ul>

				<h2 style={{ fontSize: '1.35rem', marginTop: '24px', marginBottom: '12px' }}>
					Pedidos y pagos
				</h2>
				<ul style={{ paddingLeft: '20px', margin: 0 }}>
					<li>Los pedidos están sujetos a disponibilidad y validación.</li>
					<li>Los pagos con tarjeta se procesan mediante Stripe.</li>
					<li>El guardado de tarjeta solo ocurre cuando lo autorices en el checkout.</li>
				</ul>

				<h2 style={{ fontSize: '1.35rem', marginTop: '24px', marginBottom: '12px' }}>
					Propiedad intelectual
				</h2>
				<p>
					Los contenidos, marcas, imágenes y materiales del sitio pertenecen a sus
					respectivos titulares y no pueden reutilizarse sin autorización.
				</p>

				<h2 style={{ fontSize: '1.35rem', marginTop: '24px', marginBottom: '12px' }}>
					Contacto
				</h2>
				<p>
					Si necesitas ayuda con una compra o con estos términos, contáctanos en{' '}
					<a href="mailto:contacto@fesmex.com">contacto@fesmex.com</a>.
				</p>
			</section>
		</main>
	)
}
