'use client'

import { FormEvent, Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/features/services/auth.api'
import { sileo } from 'sileo'
import styles from './reset-password.module.scss'

function ResetPasswordContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token') || ''
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const passwordChecks = useMemo(
		() => ({
			length: password.length >= 8,
			match: password === confirmPassword,
		}),
		[confirmPassword, password],
	)

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)

		if (!token) {
			setError('El enlace de recuperación es inválido o está incompleto.')
			return
		}

		if (!passwordChecks.length) {
			setError('La contraseña debe tener al menos 8 caracteres.')
			return
		}

		if (!passwordChecks.match) {
			setError('Las contraseñas no coinciden.')
			return
		}

		setIsSubmitting(true)

		try {
			const res = await authApi.resetPassword({ token, password })
			if (res.ok) {
				sileo.success({
					title: 'Contraseña actualizada',
					description: 'Ya puedes iniciar sesión con tu nueva contraseña.',
				})
				router.push('/')
				return
			}

			throw new Error(res.error?.message || 'No fue posible actualizar tu contraseña')
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message)
			} else {
				setError('No fue posible actualizar tu contraseña')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h1 className={styles.title}>Restablecer contraseña</h1>
				<p className={styles.subtitle}>
					Ingresa una nueva contraseña para tu cuenta.
				</p>

				{error && <div className={styles.error}>{error}</div>}

				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.formGroup}>
						<label htmlFor="password" className={styles.label}>
							Nueva contraseña
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className={styles.input}
							disabled={isSubmitting}
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="confirmPassword" className={styles.label}>
							Confirmar contraseña
						</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							className={styles.input}
							disabled={isSubmitting}
						/>
					</div>

					<div className={styles.helpText}>
						La contraseña debe tener al menos 8 caracteres.
					</div>

					<button
						type="submit"
						className={styles.button}
						disabled={isSubmitting || !token}
					>
						{isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
					</button>
				</form>

				<div className={styles.footer}>
					<Link href="/login" className={styles.link}>
						Volver al inicio de sesión
					</Link>
				</div>
			</div>
		</div>
	)
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={null}>
			<ResetPasswordContent />
		</Suspense>
	)
}
