'use client'

import { ShippingAddress } from '@/features/orders/services/orders.api'
import styles from './ShippingAddressSelector.module.scss'

interface ShippingAddressSelectorProps {
	addresses: ShippingAddress[]
	isLoading: boolean
	selectedIndex: number | 'new'
	onSelectAddress: (index: number | 'new') => void
}

export const ShippingAddressSelector = ({
	addresses,
	isLoading,
	selectedIndex,
	onSelectAddress,
}: ShippingAddressSelectorProps) => {
	if (isLoading) {
		return <p className={styles.loadingText}>Cargando direcciones...</p>
	}

	return (
		<>
			{addresses.map((address, index) => (
				<button
					key={`${address.line1}-${address.postal_code}-${index}`}
					type="button"
					className={`${styles.radioOption} ${
						selectedIndex === index ? styles.active : ''
					}`}
					onClick={() => onSelectAddress(index)}
				>
					<div className={styles.left}>
						<div className={styles.radioBtn}>
							<div className={styles.radioBtn__inner}></div>
						</div>
						<div className={styles.addressInfo}>
							<strong>{address.full_name}</strong>
							<p>
								{address.line1}
								{address.line2 ? `, ${address.line2}` : ''}
							</p>
							<p>
								{address.city}, {address.state} {address.postal_code}
							</p>
							<p>{address.phone}</p>
						</div>
					</div>
				</button>
			))}

			<button
				type="button"
				className={`${styles.radioOption} ${
					selectedIndex === 'new' ? styles.active : ''
				}`}
				onClick={() => onSelectAddress('new')}
			>
				<div className={styles.left}>
					<div className={styles.radioBtn}>
						<div className={styles.radioBtn__inner}></div>
					</div>
					Agregar dirección de entrega
				</div>
			</button>
		</>
	)
}
