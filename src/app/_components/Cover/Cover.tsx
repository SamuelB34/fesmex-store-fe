import styles from './Cover.module.scss'
import { Input } from '@/components/Input/Input'
import Image from 'next/image'
import { Chip } from '@/components/Chip/Chip'

export const Cover = () => {
	return (
		<div className={styles.cover}>
			<div className={styles.cover__left}>
				<div className={styles.hero}>
					<span className={styles.hero__txt}>
						En FESMEX te brindamos las mejores
					</span>
					<span className={styles.hero__big}>
						SOLUCIONES <br /> INDUSTRIALES
					</span>
				</div>

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
						<Chip type={'primary'} active text={'HVAC'} />
						<Chip type={'primary'} active text={'Actuadores'} />
						<Chip type={'primary'} active text={'Bombas'} />
						<Chip type={'primary'} active text={'Motores'} />
						<Chip type={'primary'} active text={'Valvulas'} />
						<Chip type={'primary'} active text={'Ventiladores'} />
					</div>
				</div>
			</div>
		</div>
	)
}
