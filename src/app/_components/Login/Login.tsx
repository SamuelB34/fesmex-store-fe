'use client'

import { FormEvent, MouseEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './Login.module.scss'
import { Input } from '@/components/Input/Input'
import { Button } from '@/components/Button/Button'
import { useAuth } from '@/shared/auth/AuthProvider'
import { useLoginModal } from '@/shared/login-modal/LoginModalProvider'

export const Login = () => {
	const { login } = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()
	const { close, openRegister } = useLoginModal()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)
		setIsSubmitting(true)

		try {
			await login({ email, password })
			const next = searchParams.get('next') || '/account'
			router.push(next)
			close()
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message)
			} else {
				setError('Login failed')
			}
			setIsSubmitting(false)
		}
	}

	const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			close()
		}
	}

	return (
		<div className={styles.login} onClick={handleBackdropClick}>
			<div className={styles.login__modal}>
				<div className={styles.form}>
					<div className={styles.header}>
						<span className={styles.header__title}>Iniciar sesión</span>
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

					{error && <div className={styles.error}>{error}</div>}

					<form onSubmit={handleSubmit}>
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

						<Button
							text={isSubmitting ? 'Iniciando…' : 'Iniciar sesión'}
							variant={'accent'}
							disabled={isSubmitting}
						/>
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
