'use client'

import styles from './Product.module.scss'
import Image from 'next/image'
import { Button } from '@/components/Button/Button'
import type { Product as ProductType } from '@/app/mock'
import { MouseEvent, useMemo } from 'react'
import { useCart } from '@/features/cart/context/CartContext'
import { formatCurrency } from '@/shared/utils/format'
import { sileo } from 'sileo'

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
		onSelect?.(product.id)
	}

	const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()

		if (product.stock <= 0) {
			sileo.error({
				title: 'Sin stock disponible',
				description: 'Este producto está agotado por ahora',
			})
			return
		}
		if (inCartItem) {
			removeItem(product.id)
		} else {
			addItem(
				{
					id: product.id,
					image: product.image ?? '',
					name: product.name,
					brand: product.brand,
					unitPrice: Number(product.price) || 0,
					quantity: 1,
				},
				{ maxStock: product.stock },
			)
			// Confirmación visual cuando se agrega un nuevo artículo
			sileo.success({
				title: 'Producto añadido',
				description: `${product.name} fue agregado al carrito`,
			})
		}
	}

	const altText = product.name || product.brand || 'Producto'

	return (
		<div className={styles.product} onClick={handleSelect} role={'button'}>
			<div className={styles.product__image_container}>
				{product.image ? (
					<Image
						src={product.image}
						alt={altText}
						fill
						sizes="(max-width: 640px) 100vw, 272px"
						className={styles.product__image}
					/>
				) : (
					<div className={styles.product__image_placeholder}>No hay imagen</div>
				)}
			</div>
			{/*<div className={styles.tags}>*/}
			{/*	/!*Discount*!/*/}

			{/*	/!*New*!/*/}
			{/*</div>*/}

			<div className={styles.product__info}>
				<span className={styles.name} title={product.name}>
					{product.name}
				</span>
				<span className={styles.brand}>{product.brand}</span>

				<div className={styles.prices}>
					<div className={styles.prices__original_price}>
						<span className={styles.txt}>{formatCurrency(product.price)}</span>
						<span className={styles.coin}>{product.currency}</span>
					</div>

					{/*Old price*/}
					{!short && product.oldPrice && (
						<span className={styles.prices__old}>
							{formatCurrency(product.oldPrice)}
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
