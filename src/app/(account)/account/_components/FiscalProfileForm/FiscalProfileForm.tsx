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

const CFDI_USAGE_OPTIONS = [
	{ value: 'G01', label: 'G01 - Adquisición de mercancías' },
	{ value: 'G02', label: 'G02 - Devoluciones, descuentos o bonificaciones' },
	{ value: 'G03', label: 'G03 - Gastos en general' },
	{ value: 'I01', label: 'I01 - Construcciones' },
	{ value: 'I02', label: 'I02 - Mobiliario y equipo de oficina por inversiones' },
	{ value: 'I03', label: 'I03 - Equipo de transporte' },
	{ value: 'I04', label: 'I04 - Equipo de cómputo y accesorios' },
	{
		value: 'I05',
		label: 'I05 - Dados, troqueles, moldes, matrices y herramental',
	},
	{ value: 'I06', label: 'I06 - Comunicaciones telefónicas' },
	{ value: 'I07', label: 'I07 - Comunicaciones satelitales' },
	{ value: 'I08', label: 'I08 - Otra maquinaria y equipo' },
	{ value: 'D01', label: 'D01 - Honorarios médicos, dentales y gastos hospitalarios' },
	{ value: 'D02', label: 'D02 - Gastos médicos por incapacidad o discapacidad' },
	{ value: 'D03', label: 'D03 - Gastos funerales' },
	{ value: 'D04', label: 'D04 - Donativos' },
	{ value: 'D05', label: 'D05 - Intereses reales pagados por créditos hipotecarios' },
	{ value: 'D06', label: 'D06 - Aportaciones voluntarias al SAR' },
	{ value: 'D07', label: 'D07 - Primas por seguros de gastos médicos' },
	{ value: 'D08', label: 'D08 - Gastos de transportación escolar obligatoria' },
	{ value: 'D09', label: 'D09 - Depósitos en cuentas para ahorro / planes de pensiones' },
	{ value: 'D10', label: 'D10 - Pagos por servicios educativos / colegiaturas' },
	{ value: 'CP01', label: 'CP01 - Pagos' },
	{ value: 'CN01', label: 'CN01 - Nómina' },
	{ value: 'S01', label: 'S01 - Sin efectos fiscales' },
] as const

const CFDI_REGIME_OPTIONS = [
	{ value: '601', label: '601 - General de Ley Personas Morales' },
	{ value: '603', label: '603 - Personas Morales con Fines no Lucrativos' },
	{ value: '605', label: '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios' },
	{ value: '606', label: '606 - Arrendamiento' },
	{ value: '607', label: '607 - Régimen de Enajenación o Adquisición de Bienes' },
	{ value: '608', label: '608 - Demás ingresos' },
	{
		value: '610',
		label: '610 - Residentes en el Extranjero sin Establecimiento Permanente en México',
	},
	{ value: '611', label: '611 - Ingresos por Dividendos / socios y accionistas' },
	{
		value: '612',
		label: '612 - Personas Físicas con Actividades Empresariales y Profesionales',
	},
	{ value: '614', label: '614 - Ingresos por intereses' },
	{ value: '615', label: '615 - Régimen de los ingresos por obtención de premios' },
	{ value: '616', label: '616 - Sin obligaciones fiscales' },
	{
		value: '620',
		label: '620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
	},
	{ value: '621', label: '621 - Incorporación Fiscal' },
	{
		value: '622',
		label: '622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
	},
	{ value: '623', label: '623 - Opcional para Grupos de Sociedades' },
	{ value: '624', label: '624 - Coordinados' },
	{
		value: '625',
		label: '625 - Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
	},
	{ value: '626', label: '626 - Régimen Simplificado de Confianza — RESICO' },
	{ value: '628', label: '628 - Hidrocarburos' },
	{
		value: '629',
		label: '629 - De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales',
	},
	{ value: '630', label: '630 - Enajenación de acciones en bolsa de valores' },
] as const

const normalizeUsoCfdi = (value: string) => {
	const trimmed = value.trim()
	if (!trimmed) {
		return ''
	}

	const byExactCode = CFDI_USAGE_OPTIONS.find((option) => option.value === trimmed)
	if (byExactCode) {
		return byExactCode.value
	}

	const codeFromLegacyValue = trimmed.match(/^[A-Z0-9]{3,4}/)?.[0]
	if (!codeFromLegacyValue) {
		return trimmed
	}

	const matchedCode = CFDI_USAGE_OPTIONS.find(
		(option) => option.value === codeFromLegacyValue,
	)
	return matchedCode?.value ?? trimmed
}

const normalizeRegimenFiscal = (value: string) => {
	const trimmed = value.trim()
	if (!trimmed) {
		return ''
	}

	const byExactCode = CFDI_REGIME_OPTIONS.find(
		(option) => option.value === trimmed,
	)
	if (byExactCode) {
		return byExactCode.value
	}

	const codeFromLegacyValue = trimmed.match(/^[0-9]{3}/)?.[0]
	if (!codeFromLegacyValue) {
		return trimmed
	}

	const matchedCode = CFDI_REGIME_OPTIONS.find(
		(option) => option.value === codeFromLegacyValue,
	)
	return matchedCode?.value ?? trimmed
}

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
				const normalizedUsoCfdi = normalizeUsoCfdi(profile.uso_cfdi)
				const normalizedRegimenFiscal = normalizeRegimenFiscal(profile.regimen_fiscal)
				setFiscalProfile(profile)
				setInitialValues({
					rfc: profile.rfc,
					razon_social: profile.razon_social,
					uso_cfdi: normalizedUsoCfdi,
					regimen_fiscal: normalizedRegimenFiscal,
					cp: profile.cp,
				})
				setRfc(profile.rfc)
				setRazonSocial(profile.razon_social)
				setUsoCfdi(normalizedUsoCfdi)
				setRegimenFiscal(normalizedRegimenFiscal)
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
					<select
						id="uso-cfdi"
						value={usoCfdi}
						onChange={(event) => setUsoCfdi(event.target.value)}
						required
						disabled={isSubmitting}
					>
						<option value="">Selecciona un uso de CFDI</option>
						{CFDI_USAGE_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div className={styles.field}>
					<label htmlFor="regimen-fiscal">Régimen Fiscal</label>
					<select
						id="regimen-fiscal"
						value={regimenFiscal}
						onChange={(event) => setRegimenFiscal(event.target.value)}
						required
						disabled={isSubmitting}
					>
						<option value="">Selecciona un régimen fiscal</option>
						{CFDI_REGIME_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
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
