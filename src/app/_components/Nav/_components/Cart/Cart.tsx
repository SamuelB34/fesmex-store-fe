import styles from './Cart.module.scss'
import Image from 'next/image'
import { Counter } from '@/components/Counter/Counter'
import { Button } from '@/components/Button/Button'

type CartItem = {
	id: string
	image: string
	description: string
	price: number
	brand: string
	quantity: number
}

interface CartProps {
	items: CartItem[]
	onQuantityChange?: (id: string, quantity: number) => void
}

export const Cart = ({ items, onQuantityChange }: CartProps) => {
	return (
		<div className={styles.cart}>
			{items.map((item, index) => (
				<CartItem
					{...item}
					key={`${item.id}_${index}`}
					onQuantityChange={onQuantityChange}
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

const CartItem = ({ id, image, description, brand, quantity, price, onQuantityChange }: CartItem & {
	onQuantityChange?: (id: string, quantity: number) => void
}) => {
	return (
		<div className={styles.cartItem}>
			<Image src={image} alt={description} width={133} height={133} />
			<div className={styles.cartItem__details}>
				{/*Description*/}
				<div className={styles.left}>
					<div className={styles.left__top}>
						<span className={styles.description}>{description}</span>
						<span className={styles.brand}>{brand}</span>
					</div>
					<Counter
						value={quantity}
						onChange={(value) => {
							onQuantityChange?.(id, value)
							console.log(`Item ${id} cantidad: ${value}`)
						}}
					/>
				</div>

				{/*Price*/}
				<span className={styles.cartItem__price}>
					${price} <span className={styles.cartItem__coin}>MXN</span>
				</span>
			</div>
		</div>
	)
}
