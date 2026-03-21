'use client'

import { Suspense, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { api } from '@/shared/api/axios'
import styles from './verify-email.module.scss'

type VerifyStatus = 'loading' | 'success' | 'error' | 'no-token'

function VerifyEmailContent() {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const [status, setStatus] = useState<VerifyStatus>(token ? 'loading' : 'no-token')
	const [errorMessage, setErrorMessage] = useState<string | null>(
		token ? null : 'Token de verificación no encontrado'
	)
	const hasVerified = useRef(false)

	useEffect(() => {
		if (!token || hasVerified.current) return
		hasVerified.current = true

		const verifyEmail = async () => {
			try {
				await api.post('/email/verify', { token })
				setStatus('success')
			} catch (err) {
				setStatus('error')
				if (err instanceof Error) {
					setErrorMessage(err.message)
				} else {
					setErrorMessage('Error al verificar el correo electrónico')
				}
			}
		}

		verifyEmail()
	}, [token])

	if (status === 'loading') {
		return (
			<div className={styles.container}>
				<div className={styles.card}>
					<div className={styles.iconContainer}>
						<div className={styles.spinner} />
					</div>
					<h1 className={styles.title}>Verificando tu correo...</h1>
					<p className={styles.message}>
						Por favor espera mientras verificamos tu cuenta.
					</p>
				</div>
			</div>
		)
	}

	if (status === 'success') {
		return (
			<div className={styles.container}>
				<div className={styles.card}>
					<div className={styles.iconContainer}>
						<div className={styles.successIcon}>✓</div>
					</div>
					<h1 className={styles.title}>¡Correo verificado!</h1>
					<p className={styles.message}>
						Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.
					</p>
					<Link href="/" className={styles.button}>
						Iniciar sesión
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<div className={styles.iconContainer}>
					<div className={styles.errorIcon}>✕</div>
				</div>
				<h1 className={styles.title}>Error de verificación</h1>
				<p className={styles.message}>
					{errorMessage || 'No se pudo verificar tu correo electrónico.'}
				</p>
				<p className={styles.hint}>
					El enlace puede haber expirado o ya fue utilizado.
				</p>
				<div className={styles.actions}>
					<Link href="/" className={styles.buttonSecondary}>
						Iniciar sesión
					</Link>
				</div>
			</div>
		</div>
	)
}

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={null}>
			<VerifyEmailContent />
		</Suspense>
	)
}
