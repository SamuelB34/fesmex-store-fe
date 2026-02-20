'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import styles from './ProductDetail.module.scss'
import { Counter } from '@/components/Counter/Counter'
import type { Product } from '@/app/mock'
import { Button } from '@/components/Button/Button'
import { Chip } from '@/components/Chip/Chip'
import { useCart } from '@/features/cart/context/CartContext'

interface ProductDetailClientProps {
	product: Product
}

export const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
	const [quantity, setQuantity] = useState(1)
	const { addItem, removeItem, items } = useCart()

	const inCart = useMemo(
		() => items.some((i) => i.id === product.id),
		[items, product.id],
	)

	const handleToggleCart = () => {
		if (inCart) {
			removeItem(product.id)
			return
		}
		addItem(
			{
				id: product.id,
				image: product.image,
				name: product.name,
				brand: product.brand,
				unitPrice: product.price,
				quantity,
			},
			{ maxStock: product.stock },
		)
	}

	return (
		<div className={styles.product_details}>
			<div className={styles.detail__content}>
				<Image
					src={product.image}
					alt={product.name}
					width={600}
					height={600}
				/>

				<div className={styles.detail__info}>
					<div className={styles.name_brand}>
						<h1 className={styles.title}>{product.name}</h1>
						<p className={styles.brand}>{product.brand}</p>
					</div>

					<div className={styles.prices}>
						<p className={styles.price}>
							$ {product.price.toFixed(2)}
							<span className={styles.price__currency}>{product.currency}</span>
						</p>
						{product.oldPrice && (
							<p className={styles.old_price}>
								$ {product.oldPrice.toFixed(2)}
							</p>
						)}
					</div>

					<div className={styles.count}>
						<div className={styles.counter_stock}>
							<div className={styles.counter_stock__counter}>
								<Counter
									value={quantity}
									onChange={(val) => setQuantity(val)}
								/>
							</div>
							<div className={styles.counter_stock__stock}>
								<span>{product.stock} IN STOCK</span>
							</div>
						</div>

						<Button
							onClick={handleToggleCart}
							filled={inCart}
							text={inCart ? 'En el carrito' : 'Agregar al carrito'}
							leftIcon={
								<Image
									src={inCart ? '/icons/check.svg' : '/icons/cart.svg'}
									alt={inCart ? 'checked' : 'cart'}
									width={24}
									height={24}
								/>
							}
						/>
					</div>

					<div className={styles.sale_details}>
						<div className={styles.sale_details__line}>
							<Image
								src={'/icons/delivery.svg'}
								alt={'delivery'}
								width={24}
								height={24}
							/>
							Envíos a toda la república Mexicana
						</div>

						<div className={styles.sale_details__line}>
							<Image
								src={'/icons/credit-card.svg'}
								alt={'credit-card'}
								width={24}
								height={24}
								className={styles.icon}
							/>
							<div className={styles.last}>
								Contamos con diferentes métodos de pago
								<div className={styles.chips}>
									<div className={styles.chip}>
										<span className={styles.chip__txt}>Tarjeta de Crédito</span>
									</div>
									<div className={styles.chip}>
										<span className={styles.chip__txt}>
											Transferencia Bancaria
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/*Detalles y specs*/}
			<div className={styles.details}>
				<div className={styles.details__chips}>
					<Chip text={'Overview del Producto'} type={'primary'} active={true} />
					<Chip
						text={'Detalles del Producto'}
						type={'primary'}
						active={false}
					/>
					<Chip
						text={'Términos de la Garantía'}
						type={'primary'}
						active={false}
					/>
				</div>

				{/*Overview*/}
				<div className={styles.specs}>
					<div className={styles.specs__row}>
						<span className={styles.title}>
							Alta eficiencia y bajo mantenimiento:
						</span>
						<span className={styles.paragraph}>
							Reduce tiempos de inactividad y costos operativos, garantizando
							funcionamiento continuo en entornos severos.
						</span>
					</div>

					<div className={styles.specs__row}>
						<span className={styles.title}>Aplicaciones:</span>
						<p className={styles.paragraph}>
							Ideales para industrias de servicio severo y aplicaciones
							extremas, como: <br />
							Plantas químicas. <br />
							Fábricas de pulpa y papel. <br />
							Refinerías. <br />
							Minas a cielo abierto. <br />
							Procesamiento de alimentos. <br />
							Fundiciones. <br />
							Tras operaciones de alta exigencia y ciclo prolongado.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
