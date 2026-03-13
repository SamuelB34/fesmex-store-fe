'use client'

import { UseFormRegister, FieldErrors } from 'react-hook-form'
import styles from './NewAddressForm.module.scss'

interface CheckoutFormValues {
	fullName: string
	phone: string
	line1: string
	line2: string
	city: string
	state: string
	postalCode: string
	notes: string
}

interface NewAddressFormProps {
	register: UseFormRegister<CheckoutFormValues>
	errors: FieldErrors<CheckoutFormValues>
	isRequired: boolean
}

export const NewAddressForm = ({
	register,
	errors,
	isRequired,
}: NewAddressFormProps) => {
	return (
		<div className={styles.cardForm}>
			<div className={styles.fieldGrid__input}>
				<span>Nombre completo</span>
				<input
					className={styles.input}
					placeholder="Juan Pérez"
					{...register('fullName', {
						required: isRequired ? 'Nombre requerido' : false,
					})}
				/>
				{errors.fullName && (
					<p className={styles.errorMsg}>{errors.fullName.message}</p>
				)}
			</div>

			<div className={styles.fieldGrid__input}>
				<span>Teléfono</span>
				<input
					className={styles.input}
					placeholder="555-123-4567"
					{...register('phone', {
						required: isRequired ? 'Teléfono requerido' : false,
					})}
				/>
				{errors.phone && (
					<p className={styles.errorMsg}>{errors.phone.message}</p>
				)}
			</div>

			<div className={styles.fieldGrid__input}>
				<span>Calle</span>
				<input
					className={styles.input}
					placeholder="Av. Lázaro Cardenas #1234"
					{...register('line1', {
						required: isRequired ? 'Ingresa la calle' : false,
					})}
				/>
				{errors.line1 && (
					<p className={styles.errorMsg}>{errors.line1.message}</p>
				)}
			</div>

			<div className={styles.fieldGrid__input}>
				<span>Colonia</span>
				<input
					className={styles.input}
					placeholder="Colonia"
					{...register('line2')}
				/>
			</div>

			<div className={styles.fieldGrid}>
				<div className={styles.fieldGrid__input}>
					<span>Código Postal</span>
					<input
						className={styles.input}
						placeholder="12345"
						{...register('postalCode', {
							required: isRequired ? 'Código postal requerido' : false,
						})}
					/>
					{errors.postalCode && (
						<p className={styles.errorMsg}>{errors.postalCode.message}</p>
					)}
				</div>
				<div className={styles.fieldGrid__input}>
					<span>Número exterior</span>
					<input className={styles.input} placeholder="12345" />
				</div>
			</div>

			<div className={styles.fieldGrid}>
				<div className={styles.fieldGrid__input}>
					<span>Ciudad</span>
					<input
						className={styles.input}
						placeholder="Mexicali"
						{...register('city', {
							required: isRequired ? 'Ciudad requerida' : false,
						})}
					/>
					{errors.city && (
						<p className={styles.errorMsg}>{errors.city.message}</p>
					)}
				</div>
				<div className={styles.fieldGrid__input}>
					<span>Estado</span>
					<input
						className={styles.input}
						placeholder="Baja California"
						{...register('state', {
							required: isRequired ? 'Estado requerido' : false,
						})}
					/>
					{errors.state && (
						<p className={styles.errorMsg}>{errors.state.message}</p>
					)}
				</div>
			</div>
		</div>
	)
}
