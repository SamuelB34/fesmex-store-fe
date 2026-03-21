import styles from './Cart.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Counter } from '@/components/Counter/Counter'
import { Button } from '@/components/Button/Button'
import { useCart } from '@/features/cart/context/CartContext'
import { formatCurrency } from '@/shared/utils/format'
import { sileo } from 'sileo'

export const Cart = () => {
	const router = useRouter()
	const { items, updateQuantity } = useCart()
	const hasItems = items.length > 0

	return (
		<div className={styles.cart}>
			{items.map((item, index) => (
				<CartItem
					{...item}
					key={`${item.id}_${index}`}
					onQuantityChange={(id, qty) => updateQuantity(id, qty)}
				/>
			))}

			{items.length > 0 ? (
				<div className={styles.cart__btn}>
					<Button
						filled={true}
						text={'CHECKOUT'}
						variant={'accent'}
						disabled={!hasItems}
						onClick={() => {
							if (!hasItems) return
							router.push('/checkout')
						}}
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
			) : (
				<div className={styles.cart__empty}>
					<span>El carrito esta vacío</span>
				</div>
			)}
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
	stock?: number
	onQuantityChange?: (id: string, quantity: number) => void
}

const CartItem = ({
	id,
	image,
	name,
	brand,
	quantity,
	unitPrice,
	stock,
	onQuantityChange,
}: CartItemProps) => {
	const handleMaxReached = () => {
		sileo.error({
			title: 'Stock máximo alcanzado',
			description: `Solo hay ${stock} unidades disponibles`,
		})
	}
	return (
		<div className={styles.cartItem}>
			<div className={styles.cartItem__imgContainer}>
				{image ? (
					<Image
						src={image}
						alt={name}
						fill
						sizes="133px"
						className={styles.cartItem__img}
						unoptimized
					/>
				) : (
					<div className={styles.cartItem__imgPlaceholder}>Sin imagen</div>
				)}
			</div>
			<div className={styles.cartItem__details}>
				{/*Description*/}
				<div className={styles.left}>
					<div className={styles.left__top}>
						<span className={styles.description}>{name}</span>
						<span className={styles.brand}>{brand}</span>
					</div>
					<Counter
						value={quantity}
						max={stock}
						onChange={(value) => {
							onQuantityChange?.(id, value)
						}}
						onMaxReached={handleMaxReached}
					/>
				</div>

				{/*Price*/}
				<span className={styles.cartItem__price}>
					{formatCurrency(unitPrice)}{' '}
					<span className={styles.cartItem__coin}>MXN</span>
				</span>
			</div>
		</div>
	)
}
