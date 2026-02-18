import styles from './CartButton.module.scss'
import Image from 'next/image'

type CartButtonProps = {
	isActive?: boolean
	onClick?: () => void
	count?: number
}

export const CartButton = ({
	isActive = false,
	count,
	onClick,
}: CartButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`${styles.cartButton} ${isActive ? styles.active : ''}`.trim()}
		>
			<Image src={'/icons/cart.svg'} alt={'cart'} width={24} height={24} />
			<div className={styles.cartButton__count}>
				<span className={styles.text}>{count}</span>
			</div>
		</button>
	)
}
