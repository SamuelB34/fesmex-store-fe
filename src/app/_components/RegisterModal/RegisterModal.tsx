'use client'

import { FormEvent, MouseEvent, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import styles from './RegisterModal.module.scss'
import { useAuth } from '@/shared/auth/AuthProvider'
import { useLoginModal } from '@/shared/login-modal/LoginModalProvider'
import { sileo } from 'sileo'

const PASSWORD_REQUIREMENTS = [
	{ key: 'length', label: '8 caracteres' },
	{ key: 'lower', label: 'Una letra minúscula' },
	{ key: 'upper', label: 'Una letra mayúscula' },
	{ key: 'number', label: 'Un número' },
	{ key: 'special', label: 'Un carácter especial (=-_*?@!#$%(){},:;)' },
] as const

export const RegisterModal = () => {
	const { register } = useAuth()
	const { close, openLogin } = useLoginModal()
	const [email, setEmail] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const passwordChecks = useMemo(
		() => ({
			length: password.length >= 8,
			lower: /[a-z]/.test(password),
			upper: /[A-Z]/.test(password),
			number: /\d/.test(password),
			special: /[=\-_\*\?@!#$%(){}.,:;]/.test(password),
		}),
		[password],
	)

	const isPasswordValid = passwordChecks.length

	useEffect(() => {
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [])

	const resetAndClose = () => {
		setEmail('')
		setFirstName('')
		setLastName('')
		setPassword('')
		setConfirmPassword('')
		setError(null)
		close()
	}

	const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			resetAndClose()
		}
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)

		if (!isPasswordValid) {
			setError('La contraseña debe tener al menos 8 caracteres')
			return
		}

		if (password !== confirmPassword) {
			setError('Las contraseñas no coinciden')
			return
		}

		setIsSubmitting(true)

		try {
			await register({
				email,
				password,
				first_name: firstName,
				last_name: lastName,
			})
			sileo.success({
				title: 'Revisa tu correo',
				description: 'Se envió un correo a tu correo registrado.',
			})
			resetAndClose()
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message)
			} else {
				setError('No se pudo crear la cuenta')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className={styles.overlay} onClick={handleBackdropClick}>
			<div className={styles.card}>
				<div className={styles.header}>
					<h2>Crea tu Cuenta</h2>
					<button type="button" onClick={resetAndClose}>
						<Image src="/icons/close.svg" alt="Cerrar" width={24} height={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					{error && <div className={styles.error}>{error}</div>}

					<div className={styles.field}>
						<label htmlFor="register-first-name">Nombre</label>
						<input
							id="register-first-name"
							type="text"
							value={firstName}
							onChange={(event) => setFirstName(event.target.value)}
							required
							disabled={isSubmitting}
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="register-last-name">Apellidos</label>
						<input
							id="register-last-name"
							type="text"
							value={lastName}
							onChange={(event) => setLastName(event.target.value)}
							required
							disabled={isSubmitting}
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="register-email">Correo electrónico</label>
						<input
							id="register-email"
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
							disabled={isSubmitting}
						/>
					</div>

					<div className={styles.requirements}>
						<strong>Ingresa una nueva contraseña. Tu contraseña debe incluir al menos</strong>
						<ul>
							{PASSWORD_REQUIREMENTS.map(({ key, label }) => (
								<li key={key}>
									{passwordChecks[key] ? (
										<Image
											src="/icons/check.svg"
											alt="check"
											width={16}
											height={16}
											className={styles.checkIcon}
										/>
									) : (
										<span className={styles.bullet} />
									)}
									{label}
								</li>
							))}
						</ul>
					</div>

					<div className={styles.field}>
						<label htmlFor="register-password">Contraseña</label>
						<input
							id="register-password"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							required
							minLength={8}
							disabled={isSubmitting}
						/>
						<button
							type="button"
							className={styles.toggle}
							onClick={() => setShowPassword((prev) => !prev)}
						>
							{showPassword ? 'Ocultar' : 'Mostrar'}
						</button>
					</div>

					<div className={styles.field}>
						<label htmlFor="register-confirm-password">Confirmar contraseña</label>
						<input
							id="register-confirm-password"
							type={showConfirmPassword ? 'text' : 'password'}
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
							required
							disabled={isSubmitting}
						/>
						<button
							type="button"
							className={styles.toggle}
							onClick={() => setShowConfirmPassword((prev) => !prev)}
						>
							{showConfirmPassword ? 'Ocultar' : 'Mostrar'}
						</button>
					</div>

					<p className={styles.terms}>
						Al crear la cuenta aceptas los Términos y Condiciones y el Aviso de privacidad.
					</p>

					<div className={styles.actions}>
						<button type="submit" className={styles.submitButton} disabled={isSubmitting}>
							{isSubmitting ? 'Creando cuenta…' : 'Crear Cuenta'}
						</button>

						<p className={styles.switch}>
							¿Ya tienes una cuenta?{' '}
							<button
								type="button"
								onClick={() => {
									resetAndClose()
									openLogin()
								}}
							>
								Inicia sesión
							</button>
						</p>
					</div>
				</form>
			</div>
		</div>
	)
}
