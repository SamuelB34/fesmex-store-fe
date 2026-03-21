'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/shared/auth/AuthProvider'
import styles from './account.module.scss'
import { FiscalProfileForm } from './_components/FiscalProfileForm/FiscalProfileForm'
import { ProfileForm } from './_components/ProfileForm/ProfileForm'
import { Chip } from '@/components/Chip/Chip'
import {
	useOrdersList,
	useShippingAddresses,
} from '@/features/orders/hooks/useOrders'
import { OrdersPanel } from './_components/OrdersPanel/OrdersPanel'

export default function AccountPage() {
	const { accessToken, user, isBootstrapping, fetchMe } = useAuth()
	const searchParams = useSearchParams()
	const initialTab = searchParams.get('tab') as 'profile' | 'address' | 'payments' | 'orders' | null
	const [activeTab, setActiveTab] = useState<
		'profile' | 'address' | 'payments' | 'orders'
	>(initialTab && ['profile', 'address', 'payments', 'orders'].includes(initialTab) ? initialTab : 'profile')
	const router = useRouter()
	const [isRefreshing, setIsRefreshing] = useState(false)
	const ordersState = useOrdersList()
	const { fetchOrders } = ordersState
	const addressesState = useShippingAddresses()
	const { fetchAddresses } = addressesState

	useEffect(() => {
		if (!isBootstrapping && !accessToken) {
			router.push('/')
		}
	}, [accessToken, isBootstrapping, router])

	useEffect(() => {
		fetchOrders({ page: 1, limit: 20 })
	}, [fetchOrders])

	useEffect(() => {
		fetchAddresses()
	}, [fetchAddresses])

	if (isBootstrapping) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>Loading...</div>
			</div>
		)
	}

	if (!accessToken) {
		return null
	}

	const handleRefresh = async () => {
		setIsRefreshing(true)
		try {
			await fetchMe()
		} catch {
			// Error handled by fetchMe
		} finally {
			setIsRefreshing(false)
		}
	}

	if (!user) {
		return (
			<div className={styles.container}>
				<div className={styles.card}>
					<p>Failed to load user data.</p>
					<button
						onClick={handleRefresh}
						className={styles.refreshButton}
						disabled={isRefreshing}
					>
						{isRefreshing ? 'Retrying...' : 'Retry'}
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>
					Bienvenido,{' '}
					{user.first_name || user.last_name
						? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
						: user.email}
				</h1>

				<div className={styles.header__chips}>
					<div
						className={styles.pointer}
						onClick={() => setActiveTab('profile')}
					>
						<Chip
							text={'Mis datos y Facturación'}
							active={activeTab === 'profile'}
						/>
					</div>
					<div
						className={styles.pointer}
						onClick={() => setActiveTab('orders')}
					>
						<Chip
							text={'Mis pedidos'}
							active={activeTab === 'orders'}
							rightIcon={
								<div className={styles.count}>
									<span>{ordersState.total}</span>
								</div>
							}
						/>
					</div>
					<div
						className={styles.pointer}
						onClick={() => setActiveTab('address')}
					>
						<Chip text={'Mis Direcciones'} active={activeTab === 'address'} />
					</div>
					<div
						className={styles.pointer}
						onClick={() => setActiveTab('payments')}
					>
						<Chip
							text={'Mis Métodos de Pago'}
							active={activeTab === 'payments'}
						/>
					</div>
				</div>
			</div>

			{activeTab === 'profile' && (
				<div className={styles.profile}>
					<ProfileForm />
					<FiscalProfileForm />
				</div>
			)}

			{activeTab === 'orders' && <OrdersPanel ordersState={ordersState} />}

			{activeTab === 'address' && (
				<div className={styles.addressesSection}>
					<h2>Direcciones registradas</h2>
					{addressesState.isLoading ? (
						<p>Cargando direcciones...</p>
					) : addressesState.error ? (
						<p className={styles.error}>{addressesState.error}</p>
					) : addressesState.addresses.length === 0 ? (
						<p>No tienes direcciones registradas.</p>
					) : (
						<ul className={styles.addressesList}>
							{addressesState.addresses.map((address, index) => (
								<li key={`${address.line1}-${address.postal_code}-${index}`}>
									<div className={styles.addressBadge}>{index + 1}</div>
									<div>
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
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	)
}
