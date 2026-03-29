'use client'

import { useRouter } from 'next/navigation'
import styles from './OrdersPanelCard.module.scss'
import { Chip } from '@/components/Chip/Chip'
import type { OrderItem } from '@/features/orders/services/orders.api'
import Image from 'next/image'
import { formatCurrency } from '@/shared/utils/format'

interface OrdersPanelCardProps {
	title: string
	orderId?: string
	items?: OrderItem[]
	firstItem?: {
		label: string
		value: string
	}
	secondItem?: {
		label: string
		value: string
	}
	thirdItem?: {
		label: string
		value: string
	}
}

export const OrdersPanelCard = ({
	title,
	orderId,
	items,
	firstItem,
	secondItem,
	thirdItem,
}: OrdersPanelCardProps) => {
	const router = useRouter()

	const handleViewMore = () => {
		if (orderId) {
			router.push(`/orders/${orderId}`)
		}
	}

	return (
		<div className={styles.card}>
			<div className={styles.card__header}>
				<h4 className={styles.title}>{title}</h4>
				<button
					type="button"
					onClick={handleViewMore}
					className={styles.chipButton}
					aria-label="Ver detalles completos de la orden"
				>
					<Chip text={'Ver más'} />
				</button>
			</div>

			<div className={styles.card__details}>
				{firstItem && (
					<div className={styles.column}>
						<span className={styles.title}>{firstItem.label}</span>
						<span className={styles.value}>{firstItem.value}</span>
					</div>
				)}
				{secondItem && (
					<div className={styles.column}>
						<span className={styles.title}>{secondItem.label}</span>
						<span className={styles.value}>{secondItem.value}</span>
					</div>
				)}
				{thirdItem && (
					<div className={styles.column}>
						<span className={styles.title}>{thirdItem.label}</span>
						<span className={styles.value}>{thirdItem.value}</span>
					</div>
				)}
			</div>

			{items && items.length > 0 && (
				<div className={styles.card__items}>
					<ul className={styles.itemsList}>
						{items.map((item, index) => (
							<li key={index} className={styles.item}>
								<div className={styles.itemImageWrapper}>
									{item.article?.image ? (
										<Image
											src={item.article.image}
											alt={item.article.description || 'Artículo'}
											width={72}
											height={72}
											className={styles.itemImage}
										/>
									) : (
										<div className={styles.itemImagePlaceholder} aria-hidden />
									)}
									<span className={styles.quantityBadge}>{item.quantity}</span>
								</div>
								<div className={styles.itemDetails}>
									<div className={styles.itemHeader}>
										<div className={styles.itemTexts}>
											<span className={styles.itemDescription}>
												{item.article?.description ||
													`Artículo ${item.article_id}`}
											</span>
											{item.article?.brand && (
												<span className={styles.itemBrand}>
													{item.article.brand}
												</span>
											)}
										</div>
									</div>
									<div className={styles.itemPriceGroup}>
										<span className={styles.itemPrice}>
											{formatCurrency(item.total)}
										</span>
										<span className={styles.itemCurrency}>MXN</span>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
