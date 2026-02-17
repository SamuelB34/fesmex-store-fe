import styles from './Products.module.scss'
import { Brand } from '@/components/Brand/Brand'
import { Product } from '@/components/Product/Product'
import Marquee from 'react-fast-marquee'

export const Products = () => {
	return (
		<div className={styles.products}>
			<span className={styles.products__title}>Soluciones FESMEX</span>

			<div className={styles.products__catalog}>
				{/*Sections*/}
				<div className={styles.sections}>
					<Brand
						text={'Todos los productos'}
						number={365}
						type={'category'}
						active={true}
					/>
					<Brand
						text={'Bombas & Bombeo'}
						number={54}
						type={'category'}
						active={false}
					/>
					<Brand
						text={'HVAC & Ventilación'}
						number={54}
						type={'category'}
						active={false}
					/>
					<Brand
						text={'Válvulas & Fluidos'}
						number={54}
						type={'category'}
						active={false}
					/>
					<Brand
						text={'Control y Automatización'}
						number={54}
						type={'category'}
						active={false}
					/>
					<Brand
						text={'Protección y Seguridad'}
						number={54}
						type={'category'}
						active={false}
					/>
					<Brand
						text={'Infraestructura'}
						number={54}
						type={'category'}
						active={false}
					/>
					<Brand
						text={'Motores'}
						number={54}
						type={'category'}
						active={false}
					/>
				</div>

				{/*Products*/}
				<div className={styles.products_list}>
					<span className={styles.products_list__title}>365 Productos</span>
					<div className={styles.products_list__content}>
						<div className={styles.item}>
							<Product short />
						</div>
						<div className={styles.item}>
							<Product short />
						</div>
						<div className={styles.item}>
							<Product short />
						</div>
						<div className={styles.item}>
							<Product short />
						</div>
						<div className={styles.item}>
							<Product short />
						</div>
						<div className={styles.item}>
							<Product short />
						</div>
						<div className={styles.item}>
							<Product short />
						</div>
						<div className={styles.item}>
							<Product short />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
