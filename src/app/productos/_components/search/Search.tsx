import styles from './Search.module.scss'
import { Input } from '@/components/Input/Input'
import Image from 'next/image'

export const Search = () => {
	return (
		<div className={styles.search}>
			<span className={styles.search__title}>
				Nuestros <br /> Productos
			</span>
			<div className={styles.shape}></div>
			<div className={styles.search__input}>
				<Input placeholder={'¿Que buscas? Accesorios de bombeo, motores....'} />
				<div className={styles.btn}>
					<Image
						src={'/icons/search.svg'}
						alt={'search'}
						width={24}
						height={24}
					/>
				</div>
			</div>
		</div>
	)
}
