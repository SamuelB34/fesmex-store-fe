'use client'

import styles from './Product.module.scss'
import Image from 'next/image'
import { Button } from '@/components/Button/Button'
import type { Product as ProductType } from '@/app/mock'
import { MouseEvent, useMemo } from 'react'
import { useCart } from '@/features/cart/context/CartContext'

interface ProductProps {
	product: ProductType
	short?: boolean
	onSelect?: (productId: string) => void
}

export const Product = ({ product, short, onSelect }: ProductProps) => {
	const { addItem, removeItem, items } = useCart()

	const inCartItem = useMemo(
		() => items.find((i) => i.id === product.id),
		[items, product.id],
	)

	const handleSelect = () => {
		console.log('Product selected:', product.id)
		onSelect?.(product.id)
	}

	const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()
		if (inCartItem) {
			removeItem(product.id)
		} else {
			addItem(
				{
					id: product.id,
					image: product.image,
					name: product.name,
					brand: product.brand,
					unitPrice: product.price,
					quantity: 1,
				},
				{ maxStock: product.stock },
			)
		}
	}

	return (
		<div className={styles.product} onClick={handleSelect} role={'button'}>
			<Image
				src={product.image}
				alt={product.name}
				width={272}
				height={272}
				className={styles.product__image}
			/>
			<div className={styles.tags}>
				{/*Discount*/}

				{/*New*/}
			</div>

			<div className={styles.product__info}>
				<span className={styles.name}>{product.name}</span>
				<span className={styles.brand}>{product.brand}</span>

				<div className={styles.prices}>
					<div className={styles.prices__original_price}>
						<span className={styles.txt}>$ {product.price.toFixed(2)}</span>
						<span className={styles.coin}>{product.currency}</span>
					</div>

					{/*Old price*/}
					{!short && product.oldPrice && (
						<span className={styles.prices__old}>
							$ {product.oldPrice.toFixed(2)}
						</span>
					)}
				</div>
			</div>

			{/*In stock*/}
			<div className={styles.product__stock}>
				<span className={styles.txt}>
					<span className={styles.txt__bold}>{product.stock}</span>
					IN STOCK
				</span>
			</div>

			<div className={styles.product__btn}>
				<Button
					onClick={handleButtonClick}
					filled={Boolean(inCartItem)}
					leftIcon={
						<Image
							src={'/icons/cart.svg'}
							alt={'cart'}
							width={24}
							height={24}
							className={Boolean(inCartItem) ? styles.icon : ''}
						/>
					}
					text={!short ? 'Agregar al carrito' : undefined}
				/>
			</div>
		</div>
	)
}
