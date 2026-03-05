'use client'

import { FormEvent, useEffect, useState } from 'react'
import styles from './FiscalProfileForm.module.scss'
import { Input } from '@/components/Input/Input'
import {
	fiscalProfileApi,
	type FiscalProfile,
	type CreateFiscalProfilePayload,
} from '@/features/services/fiscalProfile.api'
import { sileo } from 'sileo'

export const FiscalProfileForm = () => {
	const [fiscalProfile, setFiscalProfile] = useState<FiscalProfile | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [rfc, setRfc] = useState('')
	const [razonSocial, setRazonSocial] = useState('')
	const [usoCfdi, setUsoCfdi] = useState('')
	const [regimenFiscal, setRegimenFiscal] = useState('')
	const [cp, setCp] = useState('')

	useEffect(() => {
		fetchFiscalProfile()
	}, [])

	const fetchFiscalProfile = async () => {
		setIsLoading(true)
		setError(null)
		try {
			const res = await fiscalProfileApi.getFiscalProfile()
			if (res.ok && res.data?.fiscalProfile) {
				const profile = res.data.fiscalProfile
				setFiscalProfile(profile)
				setRfc(profile.rfc)
				setRazonSocial(profile.razon_social)
				setUsoCfdi(profile.uso_cfdi)
				setRegimenFiscal(profile.regimen_fiscal)
				setCp(profile.cp)
			}
		} catch (err) {
			if (err instanceof Error && err.message.includes('not found')) {
				setFiscalProfile(null)
			} else {
				setError('Error al cargar datos fiscales')
			}
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)
		setIsSubmitting(true)

		const payload: CreateFiscalProfilePayload = {
			rfc,
			razon_social: razonSocial,
			uso_cfdi: usoCfdi,
			regimen_fiscal: regimenFiscal,
			cp,
		}

		try {
			if (fiscalProfile) {
				const res = await fiscalProfileApi.updateFiscalProfile(payload)
				if (res.ok && res.data?.fiscalProfile) {
					setFiscalProfile(res.data.fiscalProfile)
					sileo.success({
						title: 'Datos actualizados',
						description: 'Tu información fiscal se actualizó correctamente.',
					})
				} else {
					throw new Error(res.error?.message || 'Error al actualizar')
				}
			} else {
				const res = await fiscalProfileApi.createFiscalProfile(payload)
				if (res.ok && res.data?.fiscalProfile) {
					setFiscalProfile(res.data.fiscalProfile)
					sileo.success({
						title: 'Datos guardados',
						description: 'Tu información fiscal se guardó correctamente.',
					})
				} else {
					throw new Error(res.error?.message || 'Error al crear')
				}
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message)
			} else {
				setError('No se pudo guardar la información fiscal')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>Cargando...</div>
			</div>
		)
	}

	return (
		<div id="fiscal-profile" className={styles.container}>
			<div className={styles.header}>
				<h2 className={styles.title}>Datos Fiscales</h2>
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				{error && <div className={styles.error}>{error}</div>}

				<div className={styles.field}>
					<label htmlFor="rfc">RFC</label>
					<Input
						id="rfc"
						type="text"
						value={rfc}
						onChange={(event) => setRfc(event.target.value)}
						required
						disabled={isSubmitting}
						placeholder="Ej: XAXX010101000"
					/>
				</div>

				<div className={styles.field}>
					<label htmlFor="razon-social">Razón Social</label>
					<Input
						id="razon-social"
						type="text"
						value={razonSocial}
						onChange={(event) => setRazonSocial(event.target.value)}
						required
						disabled={isSubmitting}
						placeholder="Nombre o razón social"
					/>
				</div>

				<div className={styles.field}>
					<label htmlFor="uso-cfdi">Uso CFDI</label>
					<Input
						id="uso-cfdi"
						type="text"
						value={usoCfdi}
						onChange={(event) => setUsoCfdi(event.target.value)}
						required
						disabled={isSubmitting}
						placeholder="Ej: G03 - Gastos en general"
					/>
				</div>

				<div className={styles.field}>
					<label htmlFor="regimen-fiscal">Régimen Fiscal</label>
					<Input
						id="regimen-fiscal"
						type="text"
						value={regimenFiscal}
						onChange={(event) => setRegimenFiscal(event.target.value)}
						required
						disabled={isSubmitting}
						placeholder="Ej: 601 - General de Ley Personas Morales"
					/>
				</div>

				<div className={styles.field}>
					<label htmlFor="cp">Código Postal</label>
					<Input
						id="cp"
						type="text"
						value={cp}
						onChange={(event) => setCp(event.target.value)}
						required
						disabled={isSubmitting}
						placeholder="Ej: 12345"
					/>
				</div>

				<div className={styles.actions}>
					<button type="submit" disabled={isSubmitting} className={styles.submitButton}>
						{isSubmitting ? 'Guardando...' : fiscalProfile ? 'Actualizar' : 'Guardar'}
					</button>
				</div>
			</form>
		</div>
	)
}
