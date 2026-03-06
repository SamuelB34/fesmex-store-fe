'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
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

	const [initialValues, setInitialValues] = useState({
		rfc: '',
		razon_social: '',
		uso_cfdi: '',
		regimen_fiscal: '',
		cp: '',
	})

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
		try {
			const res = await fiscalProfileApi.getFiscalProfile()
			if (res.ok) {
				const profile = res.fiscalProfile
				setFiscalProfile(profile)
				setInitialValues({
					rfc: profile.rfc,
					razon_social: profile.razon_social,
					uso_cfdi: profile.uso_cfdi,
					regimen_fiscal: profile.regimen_fiscal,
					cp: profile.cp,
				})
				setRfc(profile.rfc)
				setRazonSocial(profile.razon_social)
				setUsoCfdi(profile.uso_cfdi)
				setRegimenFiscal(profile.regimen_fiscal)
				setCp(profile.cp)
			}
		} catch (err) {
			if (err instanceof Error && err.message.includes('not found')) {
				setFiscalProfile(null)
				setInitialValues({
					rfc: '',
					razon_social: '',
					uso_cfdi: '',
					regimen_fiscal: '',
					cp: '',
				})
			}
		} finally {
			setIsLoading(false)
		}
	}

	const isDirty = useMemo(() => {
		return (
			rfc !== initialValues.rfc ||
			razonSocial !== initialValues.razon_social ||
			usoCfdi !== initialValues.uso_cfdi ||
			regimenFiscal !== initialValues.regimen_fiscal ||
			cp !== initialValues.cp
		)
	}, [cp, initialValues, razonSocial, regimenFiscal, rfc, usoCfdi])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
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
				if (res.ok) {
					setFiscalProfile(res.fiscalProfile)
					setInitialValues({
						rfc: res.fiscalProfile.rfc,
						razon_social: res.fiscalProfile.razon_social,
						uso_cfdi: res.fiscalProfile.uso_cfdi,
						regimen_fiscal: res.fiscalProfile.regimen_fiscal,
						cp: res.fiscalProfile.cp,
					})
					sileo.success({
						title: 'Datos actualizados',
						description: 'Tu información fiscal se actualizó correctamente.',
					})
				} else {
					throw new Error(res.error?.message || 'Error al actualizar')
				}
			} else {
				const res = await fiscalProfileApi.createFiscalProfile(payload)
				if (res.ok) {
					setFiscalProfile(res.fiscalProfile)
					setInitialValues({
						rfc: res.fiscalProfile.rfc,
						razon_social: res.fiscalProfile.razon_social,
						uso_cfdi: res.fiscalProfile.uso_cfdi,
						regimen_fiscal: res.fiscalProfile.regimen_fiscal,
						cp: res.fiscalProfile.cp,
					})
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
				sileo.error({
					title: 'Error al guardar',
					description: err.message,
				})
			} else {
				sileo.error({
					title: 'Error al guardar',
					description: 'No se pudo guardar la información fiscal',
				})
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
				<h2 className={styles.title}>Datos de Facturación</h2>
				<p className={styles.subtitle}>Actualiza tus datos de facturación.</p>
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
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
