import styles from './Product.module.scss'
import Image from 'next/image'
import { Button } from '@/components/Button/Button'
import { Chip } from '@/components/Chip/Chip'

export const Product = () => {
	return (
		<div className={styles.product}>
			<Image
				src={'/illustrations/motor.svg'}
				alt={'motor'}
				width={272}
				height={272}
			/>
			<div className={styles.tags}>
				{/*Discount*/}

				{/*New*/}
			</div>

			<div className={styles.product__info}>
				<span className={styles.name}>
					Motor Globetrotter Propósito general
				</span>
				<span className={styles.brand}>Marathon</span>

				<div className={styles.prices}>
					<div className={styles.prices__original_price}>
						<span className={styles.txt}>$ 127.00</span>
						<span className={styles.coin}>MXN</span>
					</div>

					{/*Old price*/}
					<span className={styles.prices__old}>$ 254.00</span>
				</div>
			</div>

			{/*In stock*/}
			<div className={styles.product__stock}>
				<span className={styles.txt}>
					<span className={styles.txt__bold}>34</span>
					IN STOCK
				</span>
			</div>

			<div className={styles.product__btn}>
				<Button
					filled={false}
					leftIcon={
						<Image
							src={'/icons/cart.svg'}
							alt={'cart'}
							width={24}
							height={24}
						/>
					}
					text={'Agregar al carrito'}
				/>
			</div>
		</div>
	)
}
