import styles from './Cart.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Counter } from '@/components/Counter/Counter'
import { Button } from '@/components/Button/Button'
import { useCart } from '@/features/cart/context/CartContext'
import { formatCurrency } from '@/shared/utils/format'
import { sileo } from 'sileo'

interface CartProps {
	onClose?: () => void
}

export const Cart = ({ onClose }: CartProps) => {
	const router = useRouter()
	const { items, updateQuantity, removeItem } = useCart()
	const hasItems = items.length > 0

	return (
		<div className={styles.cart}>
			{/* Mobile Header */}
			<div className={styles.cart__mobileHeader}>
				<Link href={'/'} onClick={onClose}>
					<Image
						src={'/illustrations/lg-logo.svg'}
						alt={'logo'}
						width="133"
						height="34"
					/>
				</Link>
			</div>

			{/* Cart Items */}
			<div className={styles.cart__items}>
				{items.map((item, index) => (
					<CartItem
						{...item}
						key={`${item.id}_${index}`}
						onQuantityChange={(id, qty) => updateQuantity(id, qty)}
						onRemove={(id) => removeItem(id)}
					/>
				))}

				{items.length === 0 && (
					<div className={styles.cart__empty}>
						<span>El carrito esta vacío</span>
					</div>
				)}
			</div>

			{/* Mobile Footer */}
			<div className={styles.cart__mobileFooter}>
				{onClose && (
					<button className={styles.cart__closeBtn} onClick={onClose}>
						<Image
							src={'/icons/close.svg'}
							alt={'close'}
							width={24}
							height={24}
						/>
					</button>
				)}

				<div className={styles.cart__btn}>
					<Button
						filled={true}
						text={'CHECKOUT'}
						variant={'accent'}
						disabled={!hasItems}
						onClick={() => {
							if (!hasItems) return
							onClose?.()
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
	stock?: number
	onQuantityChange?: (id: string, quantity: number) => void
	onRemove?: (id: string) => void
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
	onRemove,
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

					<span className={styles.cartItem_mobile}>
						{formatCurrency(unitPrice)}{' '}
						<span className={styles.cartItem__coin}>MXN</span>
					</span>
					<Counter
						value={quantity}
						max={stock}
						onChange={(value) => {
							onQuantityChange?.(id, value)
						}}
						onMaxReached={handleMaxReached}
						onMinReached={() => onRemove?.(id)}
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
