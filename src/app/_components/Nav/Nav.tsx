'use client'
import styles from './Nav.module.scss'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MenuItem } from '@/components/MenuItem/MenuItem'
import { CartButton } from '@/app/_components/CartButton/CartButton'
import { Cart } from '@/app/_components/Nav/_components/Cart/Cart'
import { MenuContainer } from '@/app/_components/Nav/_components/MenuContainer/MenuContainer'
import Link from 'next/link'
import { useCart } from '@/features/cart/context/CartContext'
import { useBrands } from '@/features/brands/context/BrandsContext'
import { brandsApi } from '@/features/services/brands.api'
import { useSections } from '@/features/categories/context/SectionsContext'
import { useAuth } from '@/shared/auth/AuthProvider'
import { useLoginModal } from '@/shared/login-modal/LoginModalProvider'

export const Nav = () => {
	const [isCartOpen, setIsCartOpen] = useState(false)
	const [openMenu, setOpenMenu] = useState<'products' | 'brands' | null>(null)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [mobileSubMenu, setMobileSubMenu] = useState<
		'products' | 'brands' | null
	>(null)
	const { cartCount } = useCart()
	const { brands, setBrands, setIsLoading } = useBrands()
	const { sections } = useSections()
	const { user, logout } = useAuth()
	const { openLogin, openRegister } = useLoginModal()

	useEffect(() => {
		let isMounted = true
		if (brands.length === 0) {
			setIsLoading(true)
			void brandsApi
				.list()
				.then((response) => {
					if (!isMounted || !response.ok || !response.data) return
					const nextBrands = response.data.items.map((item) => ({
						id: item.brand,
						text: item.brand,
						number: item.article_count,
						type: 'brand' as const,
					}))
					const totalBrandsCount = nextBrands.reduce(
						(sum, brand) => sum + (brand.number ?? 0),
						0,
					)
					const allBrandsEntry = {
						id: 'all-brands',
						text: 'Todas las marcas',
						number: totalBrandsCount,
						type: 'brand' as const,
					}
					setBrands([allBrandsEntry, ...nextBrands])
				})
				.catch((error) => {
					console.error('Failed to fetch brands:', error)
				})
				.finally(() => {
					if (isMounted) {
						setIsLoading(false)
					}
				})
		}
		return () => {
			isMounted = false
		}
	}, [brands.length, setBrands, setIsLoading])

	const toggleCart = () => {
		setIsCartOpen((prev) => !prev)
		setOpenMenu(null)
	}

	const toggleMenu = (menu: 'products' | 'brands') => {
		setOpenMenu((prev) => (prev === menu ? null : menu))
		setIsCartOpen(false)
	}

	const closeAll = () => {
		setIsCartOpen(false)
		setOpenMenu(null)
		setIsMobileMenuOpen(false)
		setMobileSubMenu(null)
	}

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen((prev) => !prev)
		setMobileSubMenu(null)
		setIsCartOpen(false)
		setOpenMenu(null)
	}

	const openMobileSubMenu = (menu: 'products' | 'brands') => {
		setMobileSubMenu(menu)
	}

	const closeMobileSubMenu = () => {
		setMobileSubMenu(null)
	}
	return (
		<>
			{(isCartOpen || openMenu) && (
				<div className={styles.overlay} onClick={closeAll} />
			)}
			<div className={styles.nav}>
				<div className={styles.hamburger} onClick={toggleMobileMenu}>
					<Image
						src={'/icons/hamburger.svg'}
						alt={'hamburger'}
						width="24"
						height="24"
					/>
				</div>

				{/* Mobile Menu */}
				<div
					className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
				>
					<div className={styles.mobileMenuHeader}>
						<Link href={'/'} onClick={closeAll}>
							<Image
								src={'/illustrations/lg-logo.svg'}
								alt={'logo'}
								width="133"
								height="34"
							/>
						</Link>
					</div>

					{/* Back button for sub-menu */}
					{mobileSubMenu && (
						<button
							className={styles.mobileBackBtn}
							onClick={closeMobileSubMenu}
						>
							<Image
								src={'/icons/back.svg'}
								alt={'back'}
								width={24}
								height={24}
							/>
						</button>
					)}

					<div className={styles.mobileMenuContent}>
						{!mobileSubMenu && (
							<>
								<Link href={'/'} onClick={closeAll}>
									<MenuItem text={'Inicio'} />
								</Link>
								<button
									className={styles.mobileMenuBtn}
									onClick={() => openMobileSubMenu('products')}
								>
									<MenuItem
										text={'Productos'}
										rightIcon={
											<Image
												src={'/icons/chevron-down.svg'}
												alt={'chevron'}
												height={32}
												width={32}
												className={styles.chevronRight}
											/>
										}
									/>
								</button>
								<button
									className={styles.mobileMenuBtn}
									onClick={() => openMobileSubMenu('brands')}
								>
									<MenuItem
										text={'Marcas'}
										rightIcon={
											<Image
												src={'/icons/chevron-down.svg'}
												alt={'chevron'}
												height={32}
												width={32}
												className={styles.chevronRight}
											/>
										}
									/>
								</button>
							</>
						)}

						{mobileSubMenu === 'products' && (
							<div className={styles.mobileSubMenuItems}>
								{sections.map((section) => (
									<Link
										key={section.id}
										href={
											section.id === 'all'
												? '/productos'
												: `/productos?category=${encodeURIComponent(section.id)}`
										}
										onClick={closeAll}
									>
										<MenuItem text={section.text} />
									</Link>
								))}
							</div>
						)}

						{mobileSubMenu === 'brands' && (
							<div className={styles.mobileSubMenuItems}>
								{brands.map((brand) => (
									<Link
										key={brand.id}
										href={
											brand.id === 'all-brands'
												? '/productos'
												: `/productos?brand=${encodeURIComponent(brand.id)}`
										}
										onClick={closeAll}
									>
										<MenuItem text={brand.text} />
									</Link>
								))}
							</div>
						)}
					</div>

					<button className={styles.mobileCloseBtn} onClick={toggleMobileMenu}>
						<Image
							src={'/icons/close.svg'}
							alt={'close'}
							width={24}
							height={24}
						/>
					</button>

					<div className={styles.mobileFooter}>
						{user ? (
							<div className={styles.mobileUserActions}>
								<Link
									href="/account"
									className={styles.mobileUserRow}
									onClick={closeAll}
								>
									<Image
										src={'/icons/user.svg'}
										alt={'user'}
										width={24}
										height={24}
										className={styles.icon}
									/>
									<span>Mi perfil</span>
								</Link>
								<div className={styles.mobileSeparator}></div>
								<button
									className={styles.mobileUserRow}
									onClick={() => {
										logout()
										closeAll()
									}}
								>
									<Image
										src={'/icons/exit.svg'}
										alt={'exit'}
										width={24}
										height={24}
										className={styles.icon}
									/>
									<span>Salir</span>
								</button>
							</div>
						) : (
							<div className={styles.mobileUserActions}>
								<button
									className={styles.mobileUserRow}
									onClick={() => {
										closeAll()
										openLogin()
									}}
								>
									<Image
										src={'/icons/user.svg'}
										alt={'user'}
										width={24}
										height={24}
										className={styles.icon}
									/>
									<span>Login</span>
								</button>
								<div className={styles.mobileSeparator}></div>
								<button
									className={styles.mobileUserRow}
									onClick={() => {
										closeAll()
										openRegister()
									}}
								>
									<span>Regístrate</span>
								</button>
							</div>
						)}
					</div>
				</div>

				<Link href={'/'}>
					<Image
						src={'/illustrations/lg-logo.svg'}
						alt={'logo'}
						width="186"
						height="48"
						className={styles.logo}
					/>
				</Link>

				<div className={styles.nav__btns}>
					<Link className={styles.home} href={'/'}>
						<MenuItem text={'Inicio'} />
					</Link>
					<div className={styles.brands}>
						<MenuItem
							text={'Productos'}
							rightIcon={
								<Image
									src={'/icons/chevron-down.svg'}
									alt={'chevron-down'}
									height={24}
									width={24}
								/>
							}
							onClick={() => toggleMenu('products')}
							isActive={openMenu === 'products'}
						/>
						{openMenu === 'products' && <MenuContainer type="products" />}
					</div>

					<div className={styles.brands}>
						<MenuItem
							text={'Marcas'}
							rightIcon={
								<Image
									src={'/icons/chevron-down.svg'}
									alt={'chevron-down'}
									height={24}
									width={24}
								/>
							}
							onClick={() => toggleMenu('brands')}
							isActive={openMenu === 'brands'}
						/>
						{openMenu === 'brands' && <MenuContainer type="brands" />}
					</div>

					<div className={styles.cart}>
						<CartButton
							count={cartCount}
							isActive={isCartOpen}
							onClick={toggleCart}
						/>

						{isCartOpen && <Cart onClose={closeAll} />}
					</div>
				</div>
			</div>
		</>
	)
}
