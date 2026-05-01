import type { CSSProperties } from 'react'

export const metadata = {
	title: 'Aviso de Privacidad | FESMEX',
	description: 'Consulta cómo FESMEX trata la información personal de los usuarios de la tienda en línea.',
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

export default function PrivacyPage() {
	return (
		<main style={sectionStyle}>
			<h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px' }}>
				Aviso de Privacidad
			</h1>
			<p style={{ color: '#6b7280', marginBottom: '24px' }}>
				Última actualización: 1 de mayo de 2026
			</p>

			<section style={cardStyle}>
				<p>
					En FESMEX nos tomamos en serio la protección de tus datos personales.
					Esta página resume, de forma general, cómo utilizamos la información
					que compartes al navegar, registrarte o comprar en nuestra tienda.
				</p>

				<h2 style={{ fontSize: '1.35rem', marginTop: '24px', marginBottom: '12px' }}>
					¿Qué información podemos recopilar?
				</h2>
				<ul style={{ paddingLeft: '20px', margin: 0 }}>
					<li>Datos de contacto, como nombre, correo y teléfono.</li>
					<li>Direcciones de envío o facturación.</li>
					<li>Datos necesarios para procesar tus pedidos y pagos.</li>
					<li>Información técnica básica para mejorar la experiencia del sitio.</li>
				</ul>

				<h2 style={{ fontSize: '1.35rem', marginTop: '24px', marginBottom: '12px' }}>
					¿Para qué usamos esa información?
				</h2>
				<ul style={{ paddingLeft: '20px', margin: 0 }}>
					<li>Procesar compras y confirmar pedidos.</li>
					<li>Gestionar entregas, soporte y seguimiento.</li>
					<li>Guardar métodos de pago solo cuando tú lo autorizas.</li>
					<li>Mejorar el funcionamiento y seguridad de la tienda.</li>
				</ul>

				<h2 style={{ fontSize: '1.35rem', marginTop: '24px', marginBottom: '12px' }}>
					Terceros y pagos
				</h2>
				<p>
					Para procesar pagos podemos apoyarnos en proveedores como Stripe. Cuando
					existe un guardado de tarjeta, solo ocurre si lo eliges explícitamente en
					el checkout.
				</p>

				<h2 style={{ fontSize: '1.35rem', marginTop: '24px', marginBottom: '12px' }}>
					Contacto
				</h2>
				<p>
					Si tienes dudas sobre este aviso, puedes escribirnos a{' '}
					<a href="mailto:contacto@fesmex.com">contacto@fesmex.com</a>.
				</p>
			</section>
		</main>
	)
}
