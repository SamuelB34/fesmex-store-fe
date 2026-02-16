import styles from './CartButton.module.scss'
import Image from 'next/image'

export const CartButton = () => {
	return (
		<div className={styles.cartButton}>
			<Image src={'/icons/cart.svg'} alt={'cart'} width={24} height={24} />
			<div className={styles.cartButton__count}>
				<span className={styles.text}>0</span>
			</div>
		</div>
	)
}
