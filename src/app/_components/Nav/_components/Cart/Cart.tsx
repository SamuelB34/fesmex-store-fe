import styles from './Cart.module.scss'
import Image from 'next/image'
import { Counter } from '@/components/Counter/Counter'
import { Button } from '@/components/Button/Button'
import { useCart } from '@/features/cart/context/CartContext'

export const Cart = () => {
	const { items, updateQuantity } = useCart()

	return (
		<div className={styles.cart}>
			{items.map((item, index) => (
				<CartItem
					{...item}
					key={`${item.id}_${index}`}
					onQuantityChange={(id, qty) => updateQuantity(id, qty)}
				/>
			))}

			<div className={styles.cart__btn}>
				<Button
					filled={true}
					text={'CHECKOUT'}
					variant={'accent'}
					leftIcon={
						<Image
							src={'/icons/credit-card.svg'}
							alt={'credit-card'}
							width={24}
							height={24}
						/>
					}
				/>
			</div>
		</div>
	)
}

type CartItemProps = {
	id: string
	image: string
	name: string
	brand: string
	unitPrice: number
	quantity: number
	onQuantityChange?: (id: string, quantity: number) => void
}

const CartItem = ({
	id,
	image,
	name,
	brand,
	quantity,
	unitPrice,
	onQuantityChange,
}: CartItemProps) => {
	return (
		<div className={styles.cartItem}>
			<Image src={image} alt={name} width={133} height={133} />
			<div className={styles.cartItem__details}>
				{/*Description*/}
				<div className={styles.left}>
					<div className={styles.left__top}>
						<span className={styles.description}>{name}</span>
						<span className={styles.brand}>{brand}</span>
					</div>
					<Counter
						value={quantity}
						onChange={(value) => {
							onQuantityChange?.(id, value)
						}}
					/>
				</div>

				{/*Price*/}
				<span className={styles.cartItem__price}>
					${unitPrice} <span className={styles.cartItem__coin}>MXN</span>
				</span>
			</div>
		</div>
	)
}
