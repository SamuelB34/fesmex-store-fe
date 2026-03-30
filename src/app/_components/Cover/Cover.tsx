'use client'

import styles from './Cover.module.scss'
import Image from 'next/image'
import { Chip } from '@/components/Chip/Chip'
import AsyncSelect from 'react-select/async'
import {
	articlesApi,
	getArticleImageUrl,
} from '@/features/services/articles.api'
import { useRouter } from 'next/navigation'

interface ProductOption {
	value: string
	label: string
	image: string
	description?: string
}

export const Cover = () => {
	const router = useRouter()

	const loadOptions = async (inputValue: string): Promise<ProductOption[]> => {
		if (!inputValue || inputValue.trim().length < 2) {
			return []
		}

		try {
			const response = await articlesApi.list({
				q: inputValue,
				limit: 8,
				page: 1,
			})

			if (!response.ok || !response.data) {
				return []
			}

			return response.data.items.map((article) => ({
				value: article._id,
				label: article.description || article.name,
				image: getArticleImageUrl(article),
				description: article.brand || '',
			}))
		} catch (error) {
			console.error('Error fetching products:', error)
			return []
		}
	}

	const handleSelectProduct = (option: ProductOption | null) => {
		if (option) {
			router.push(`/productos/${option.value}`)
		}
	}

	const formatOptionLabel = (option: ProductOption) => (
		<div className={styles.selectOption}>
			{option.image && (
				<div
					className={styles.selectOption__image}
					style={{ backgroundImage: `url(${option.image})` }}
					role="img"
					aria-label={option.label}
				/>
			)}
			<div className={styles.selectOption__content}>
				<div className={styles.selectOption__label}>{option.label}</div>
				{option.description && (
					<div className={styles.selectOption__description}>
						{option.description}
					</div>
				)}
			</div>
		</div>
	)

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
						<div className={styles.selectWrapper}>
							<AsyncSelect
								instanceId="product-search"
								cacheOptions
								loadOptions={loadOptions}
								onChange={handleSelectProduct}
								placeholder={'¿Que buscas? Accesorios de bombeo, motores....'}
								isClearable
								isSearchable
								formatOptionLabel={formatOptionLabel}
								noOptionsMessage={() => 'Sin resultados'}
								loadingMessage={() => 'Buscando...'}
								classNamePrefix="product-select"
								styles={{
									control: (base) => ({
										...base,
										border: 'none',
										boxShadow: 'none',
										backgroundColor: 'transparent',
										padding: 0,
										minHeight: 'auto',
										cursor: 'text',
									}),
									input: (base) => ({
										...base,
										color: 'inherit',
										margin: 0,
										padding: 0,
									}),
									menu: (base) => ({
										...base,
										zIndex: 10,
									}),
									option: (base, state) => ({
										...base,
										backgroundColor: state.isSelected
											? '#f0f0f0'
											: state.isFocused
												? '#fafafa'
												: 'white',
										color: 'inherit',
										cursor: 'pointer',
										padding: '8px 12px',
									}),
								}}
							/>
						</div>
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
