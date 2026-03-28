'use client'

import styles from './BestBrands.module.scss'
import Image from 'next/image'
import { LogosMarquee } from '@/components/LogosMarquee/LogosMarquee'
import { logos } from '@/app/_components/BestBrands/logos'
import { Button } from '@/components/Button/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const BestBrands = () => {
	const router = useRouter()
	const firstGroupLogos = logos.slice(0, 6)
	const secondGroupLogos = logos.slice(6)

	const handleBrandClick = (brandName: string) => {
		const encoded = encodeURIComponent(brandName)
		router.push(`/productos?brand=${encoded}`)
	}

	return (
		<div className={styles.best_brands}>
			{/*Text*/}
			<div className={styles.best_brands__txt}>
				<span className={styles.best_brands__h2}>Contamos con</span>
				<span className={styles.best_brands__h1}>LAS MEJORES MARCAS</span>
				<span className={styles.best_brands__h2}>en el mercado</span>
				<Image
					src={'/illustrations/underline.svg'}
					alt={'underline'}
					className={styles.selected}
					width="208"
					height="20"
				/>
			</div>

			<div className={styles.best_brands__brands}>
				<LogosMarquee logos={firstGroupLogos} direction={'right'} onBrandClick={handleBrandClick} />
				<LogosMarquee logos={secondGroupLogos} direction={'left'} onBrandClick={handleBrandClick} />
			</div>

			<Link href={'/productos'}>
				<Button
					text={'Ver nuestro productos'}
					variant={'accent'}
					filled={false}
				/>
			</Link>
		</div>
	)
}
