import styles from './Cover.module.scss'
import { Input } from '@/components/Input/Input'
import Image from 'next/image'
import { Chip } from '@/components/Chip/Chip'

export const Cover = () => {
	return (
		<div className={styles.cover}>
			{/*Search*/}
			<div className={styles.cover__left}>
				<div className={styles.hero}>
					<span className={styles.hero__txt}>
						En FESMEX te brindamos las mejores
					</span>
					<span className={styles.hero__big}>
						SOLUCIONES <br /> INDUSTRIALES
					</span>
				</div>

				<div className={styles.mobile_img}>
					<Image
						src={'/illustrations/motor.svg'}
						className={styles.engine}
						alt={'engine'}
						width={342}
						height={342}
					/>
				</div>

				<div className={styles.search_container}>
					<div className={styles.search}>
						<Input
							placeholder={'¿Que buscas? Accesorios de bombeo, motores....'}
						/>
						<div className={styles.search__search}>
							<Image
								src={'/icons/search.svg'}
								alt={'search'}
								width={24}
								height={24}
							/>
						</div>
					</div>

					<div className={styles.products}>
						<span className={styles.products__txt}>PRODUCTOS MÁS BUSCADOS</span>

						<div className={styles.products__chips}>
							<Chip type={'primary'} text={'HVAC'} />
							<Chip type={'primary'} text={'Actuadores'} />
							<Chip type={'primary'} text={'Bombas'} />
							<Chip type={'primary'} text={'Motores'} />
							<Chip type={'primary'} text={'Valvulas'} />
							<Chip type={'primary'} text={'Ventiladores'} />
						</div>
					</div>
				</div>
			</div>

			{/*Images*/}
			<div className={styles.cover__right}>
				<div className={styles.circle}>
					<Image
						src={'/illustrations/motor.svg'}
						className={styles.engine}
						alt={'engine'}
						width={447}
						height={447}
					/>
				</div>
				<Image
					src={'/illustrations/shade.svg'}
					className={styles.shade}
					alt={'cover'}
					width={1152}
					height={508}
				/>
			</div>
		</div>
	)
}
