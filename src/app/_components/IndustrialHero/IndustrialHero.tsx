import Image from 'next/image'
import styles from './IndustrialHero.module.scss'
import { Button } from '@/components/Button/Button'

export const IndustrialHero = () => {
	return (
		<section className={styles.hero}>
			<div className={styles.hero__card}>
				<div className={styles.hero__text}>
					<p className={styles.hero__eyebrow}>En FESMEX</p>
					<p className={styles.hero__title}>encuentras las mejores</p>
					<p className={styles.hero__headline}>SOLUCIONES INDUSTRIALES</p>
					<div className={styles.btn}>
						<Button
							filled
							variant={'accent'}
							text={'Cónoce nuestros productos'}
						/>
					</div>
				</div>

				<div className={styles.hero__engines}>
					<Image
						src="/illustrations/engine_1.svg"
						alt="Motor industrial 1"
						width={320}
						height={220}
						className={`${styles.engine} ${styles.engine__top}`}
						priority
					/>
					<Image
						src="/illustrations/engine_2.svg"
						alt="Motor industrial 2"
						width={340}
						height={230}
						className={`${styles.engine} ${styles.engine__right}`}
						priority
					/>
					<Image
						src="/illustrations/engine_3.svg"
						alt="Motor industrial 3"
						width={360}
						height={240}
						className={`${styles.engine} ${styles.engine__bottom}`}
						priority
					/>
				</div>
			</div>
		</section>
	)
}
