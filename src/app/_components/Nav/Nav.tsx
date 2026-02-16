import styles from './Nav.module.scss'
import Image from 'next/image'
import { MenuItem } from '@/components/MenuItem/MenuItem'
import { CartButton } from '@/app/_components/CartButton/CartButton'

export const Nav = () => {
	return (
		<div className={styles.nav}>
			<Image
				src={'/illustrations/lg-logo.svg'}
				alt={'logo'}
				width="186"
				height="48"
			/>

			<div className={styles.nav__btns}>
				<MenuItem text={'Inicio'} />
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
				/>
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
				/>
				<div className={styles.cart}>
					<CartButton />
				</div>
			</div>
		</div>
	)
}
