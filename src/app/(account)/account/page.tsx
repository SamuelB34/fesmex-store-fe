'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/auth/AuthProvider'
import styles from './account.module.scss'
import { FiscalProfileForm } from './_components/FiscalProfileForm/FiscalProfileForm'

export default function AccountPage() {
	const { accessToken, user, isBootstrapping, fetchMe } = useAuth()
	const router = useRouter()
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [showFiscalSection, setShowFiscalSection] = useState(false)
	const fiscalSectionRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!isBootstrapping && !accessToken) {
			router.push('/login')
		}
	}, [accessToken, isBootstrapping, router])

	useEffect(() => {
		if (showFiscalSection) {
			fiscalSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}, [showFiscalSection])

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

	const handleShowFiscalSection = () => {
		setShowFiscalSection(true)
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
				<h1 className={styles.title}>Bienvenido, {user.first_name || user.last_name ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() : user.email}</h1>
			</div>

			<div className={styles.quickLinks}>
				<Link href="/orders" className={styles.quickLink}>
					<span className={styles.quickLinkIcon}>📦</span>
					<span>My Orders</span>
				</Link>
				<button type="button" className={styles.quickLink} onClick={handleShowFiscalSection}>
					<span className={styles.quickLinkIcon}>📄</span>
					<span>Mis Direcciones y Datos Fiscales</span>
				</button>
				<Link href="/" className={styles.quickLink}>
					<span className={styles.quickLinkIcon}>🏪</span>
					<span>Browse Articles</span>
				</Link>
			</div>

			<div className={styles.card}>
				<div className={styles.cardHeader}>
					<h2 className={styles.cardTitle}>User Information</h2>
					<button
						onClick={handleRefresh}
						className={styles.refreshButton}
						disabled={isRefreshing}
					>
						{isRefreshing ? 'Refreshing...' : 'Refresh My Info'}
					</button>
				</div>
				<div className={styles.userDetails}>
					<div className={styles.userField}>
						<span className={styles.userFieldLabel}>Email</span>
						<span>{user.email}</span>
					</div>
					{user.first_name && (
						<div className={styles.userField}>
							<span className={styles.userFieldLabel}>First Name</span>
							<span>{user.first_name}</span>
						</div>
					)}
					{user.last_name && (
						<div className={styles.userField}>
							<span className={styles.userFieldLabel}>Last Name</span>
							<span>{user.last_name}</span>
						</div>
					)}
					{user.mobile && (
						<div className={styles.userField}>
							<span className={styles.userFieldLabel}>Mobile</span>
							<span>{user.mobile}</span>
						</div>
					)}
					{user.status && (
						<div className={styles.userField}>
							<span className={styles.userFieldLabel}>Status</span>
							<span>{user.status}</span>
						</div>
					)}
				</div>
			</div>

			{showFiscalSection && (
				<div ref={fiscalSectionRef}>
					<FiscalProfileForm />
				</div>
			)}
		</div>
	)
}
