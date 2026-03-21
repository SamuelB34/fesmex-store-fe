'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/Input/Input'
import styles from './ProfileForm.module.scss'
import { customersApi } from '@/features/services/customers.api'
import { useAuth } from '@/shared/auth/AuthProvider'
import { sileo } from 'sileo'

export const ProfileForm = () => {
	const { user, fetchMe } = useAuth()
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [mobile, setMobile] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!user) return
		setFirstName(user.first_name ?? '')
		setLastName(user.last_name ?? '')
		setMobile(user.mobile ?? '')
	}, [user])

	const isDirty = useMemo(() => {
		if (!user) return false
		return (
			firstName !== (user.first_name ?? '') ||
			lastName !== (user.last_name ?? '') ||
			mobile !== (user.mobile ?? '') ||
			Boolean(password)
		)
	}, [firstName, lastName, mobile, password, user])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!user) return
		setError(null)

		if (password && password !== confirmPassword) {
			setError('Las contraseñas no coinciden')
			return
		}

		const payload: Record<string, string> = {}
		if (firstName !== (user.first_name ?? '')) {
			payload.first_name = firstName
		}
		if (lastName !== (user.last_name ?? '')) {
			payload.last_name = lastName
		}
		if (mobile !== (user.mobile ?? '')) {
			payload.mobile = mobile
		}
		if (password) {
			payload.password = password
		}

		if (Object.keys(payload).length === 0) {
			setError('No hay cambios para guardar')
			return
		}

		setIsSubmitting(true)
		try {
			const res = await customersApi.updateMe(payload)
			if (!res.ok) {
				throw new Error(res.error?.message ?? 'No se pudo actualizar')
			}

			await fetchMe()
			setPassword('')
			setConfirmPassword('')
			sileo.success({
				title: 'Perfil actualizado',
				description: 'Tus datos se guardaron correctamente.',
			})
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message)
			} else {
				setError('No se pudo actualizar tu perfil')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2 className={styles.title}>Mis Datos</h2>
				<p className={styles.subtitle}>
					Actualiza tu nombre, teléfono o contraseña. El correo y estado no se
					pueden editar
				</p>
			</div>

			<form className={styles.form} onSubmit={handleSubmit}>
				{error && <div className={styles.error}>{error}</div>}

				<div className={styles.grid}>
					<div className={styles.field}>
						<label htmlFor="firstName">Nombre</label>
						<Input
							id="firstName"
							value={firstName}
							onChange={(event) => setFirstName(event.target.value)}
							required
							placeholder="Tu nombre"
						/>
					</div>
					<div className={styles.field}>
						<label htmlFor="lastName">Apellido</label>
						<Input
							id="lastName"
							value={lastName}
							onChange={(event) => setLastName(event.target.value)}
							required
							placeholder="Tus apellidos"
						/>
					</div>
				</div>

				<div className={styles.field}>
					<label htmlFor="mobile">Teléfono</label>
					<Input
						id="mobile"
						value={mobile}
						onChange={(event) => setMobile(event.target.value)}
						placeholder="Ej: +52 55 1234 5678"
					/>
				</div>

				<div className={styles.grid}>
					<div className={styles.field}>
						<label htmlFor="password">Nueva contraseña</label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="Deja en blanco para no cambiar"
							minLength={6}
						/>
					</div>
					<div className={styles.field}>
						<label htmlFor="confirmPassword">Confirmar contraseña</label>
						<Input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
							placeholder="Repite la nueva contraseña"
							minLength={6}
							disabled={!password}
						/>
					</div>
				</div>

				<div className={styles.actions}>
					<button
						type="submit"
						className={styles.submitButton}
						disabled={isSubmitting || !isDirty}
					>
						{isSubmitting ? 'Guardando...' : 'Guardar cambios'}
					</button>
				</div>
			</form>
		</div>
	)
}
