'use client'

import { FormEvent, MouseEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './Login.module.scss'
import { Input } from '@/components/Input/Input'
import { Button } from '@/components/Button/Button'
import { useAuth } from '@/shared/auth/AuthProvider'
import { useLoginModal } from '@/shared/login-modal/LoginModalProvider'
import { authApi } from '@/features/services/auth.api'
import { sileo } from 'sileo'

export const Login = () => {
	const { login } = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()
	const { close, openRegister } = useLoginModal()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isForgotSubmitting, setIsForgotSubmitting] = useState(false)
	const [isForgotMode, setIsForgotMode] = useState(false)

	useEffect(() => {
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSubmitting(true)

		try {
			await login({ email, password })
			const next = searchParams.get('next') || '/account'
			router.push(next)
			close()
		} catch (err) {
			sileo.error({
				title: 'No se pudo iniciar sesión',
				description: err instanceof Error ? err.message : 'Login failed',
			})
			setIsSubmitting(false)
		}
	}

	const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			close()
		}
	}

	const handleBackToLogin = () => {
		setIsForgotMode(false)
	}

	const handleForgotPassword = async () => {
		if (!email.trim()) {
			sileo.error({
				title: 'Correo requerido',
				description: 'Ingresa tu correo electrónico para enviar el enlace de recuperación.',
			})
			return
		}

		setIsForgotSubmitting(true)

		try {
			const res = await authApi.forgotPassword({ email })
			if (res.ok) {
				sileo.success({
					title: 'Revisa tu correo',
					description: 'Si la cuenta existe, recibirás un enlace para restablecer tu contraseña.',
				})
			} else {
				throw new Error(res.error?.message || 'Forgot password failed')
			}
		} catch (err) {
			sileo.error({
				title: 'No fue posible enviar el enlace',
				description:
					err instanceof Error
						? err.message
						: 'No fue posible enviar el enlace de recuperación',
			})
		} finally {
			setIsForgotSubmitting(false)
		}
	}

	const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (isForgotMode) {
			await handleForgotPassword()
			return
		}

		await handleSubmit(event)
	}

	return (
		<div className={styles.login} onClick={handleBackdropClick}>
			<div className={styles.login__modal}>
				<div className={styles.form}>
					<div className={styles.header}>
						<span className={styles.header__title}>
							{isForgotMode ? 'Restaurar contraseña' : 'Iniciar sesión'}
						</span>
						<button
							type="button"
							className={styles.header__close}
							onClick={close}
						>
							<Image
								src={'/icons/close.svg'}
								alt={'close'}
								width={24}
								height={24}
							/>
						</button>
					</div>

					<form onSubmit={handleFormSubmit}>
						{isForgotMode ? (
							<>
								<div className={styles.input}>
									<span>Correo electrónico</span>
									<Input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										disabled={isForgotSubmitting}
									/>
								</div>

								<div className={styles.forgot_actions}>
									<Button
										text={
											isForgotSubmitting
												? 'Enviando enlace...'
												: 'Restaurar mi contraseña'
										}
										variant={'accent'}
										disabled={isForgotSubmitting}
										type="submit"
									/>

									<Button
										text={'Volver'}
										variant={'secondary'}
										filled={false}
										type="button"
										onClick={handleBackToLogin}
										disabled={isForgotSubmitting}
									/>
								</div>
							</>
						) : (
							<>
								<div className={styles.input}>
									<span>Correo electrónico</span>
									<Input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>
								<div className={styles.input}>
									<span>Contraseña</span>
									<Input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										disabled={isSubmitting}
									/>
								</div>

								<div
									className={styles.forgot_password}
									onClick={() => {
										setIsForgotMode(true)
									}}
								>
									<span>Olvidé mi contraseña</span>
								</div>

								<Button
									text={isSubmitting ? 'Iniciando…' : 'Iniciar sesión'}
									variant={'accent'}
									disabled={isSubmitting}
									type="submit"
								/>
							</>
						)}
					</form>
				</div>

				<div className={styles.create_account}>
					<span className={styles.create_account__title}>
						¿Aún no tienes cuenta?
					</span>

					<div className={styles.create_account__info_row}>
						<Image
							src={'/icons/octagone-check.svg'}
							alt={'octagone-check'}
							width={24}
							height={24}
						/>

						<span>
							Guarda tus direcciones y tarjetas; ahorra tiempo en tus compras en
							linea
						</span>
					</div>

					<div className={styles.create_account__info_row}>
						<Image
							src={'/icons/book.svg'}
							alt={'book'}
							width={24}
							height={24}
						/>

						<span>
							Consulta tu historial y revisa el estatus de tus pedidos
						</span>
					</div>

					<div className={styles.create_account__info_row}>
						<Image
							src={'/icons/facturas.svg'}
							alt={'facturas'}
							width={24}
							height={24}
						/>

						<span>Tus facturas en un solo lugar</span>
					</div>

					<div className={styles.btn}>
						<Button
							text={'Crear Cuenta'}
							variant={'accent'}
							filled={false}
							onClick={() => {
								close()
								openRegister()
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
