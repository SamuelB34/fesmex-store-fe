'use client'
import styles from './Nav.module.scss'
import Image from 'next/image'
import { useState } from 'react'
import { MenuItem } from '@/components/MenuItem/MenuItem'
import { CartButton } from '@/app/_components/CartButton/CartButton'
import { Cart } from '@/app/_components/Nav/_components/Cart/Cart'
import { MenuContainer } from '@/app/_components/Nav/_components/MenuContainer/MenuContainer'
import { BrandsList, ProductsList } from '@/app/_components/Nav/variables'
import Link from 'next/link'
import { useCart } from '@/features/cart/context/CartContext'

export const Nav = () => {
	const [isCartOpen, setIsCartOpen] = useState(false)
	const [openMenu, setOpenMenu] = useState<'products' | 'brands' | null>(null)
	const { cartCount } = useCart()

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
	}
	return (
		<>
			{(isCartOpen || openMenu) && (
				<div className={styles.overlay} onClick={closeAll} />
			)}
			<div className={styles.nav}>
				<Image
					src={'/illustrations/lg-logo.svg'}
					alt={'logo'}
					width="186"
					height="48"
				/>

				<div className={styles.nav__btns}>
					<Link href={'/'}>
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
						{openMenu === 'products' && <MenuContainer items={ProductsList} />}
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
						{openMenu === 'brands' && <MenuContainer items={BrandsList} />}
					</div>

					<div className={styles.cart}>
						<CartButton
							count={cartCount}
							isActive={isCartOpen}
							onClick={toggleCart}
						/>

						{isCartOpen && <Cart />}
					</div>
				</div>
			</div>
		</>
	)
}
