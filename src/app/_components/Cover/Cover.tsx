'use client'

import styles from './Cover.module.scss'
import Image from 'next/image'
import { Chip } from '@/components/Chip/Chip'
import Select from 'react-select'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useEffect, useRef, useState } from 'react'
import {
	articlesApi,
	getArticleImageUrl,
} from '@/features/services/articles.api'
import { listTags } from '@/features/services/tags.api'
import { useRouter } from 'next/navigation'
import type { SelectInstance } from 'react-select'

interface ProductOption {
	value: string
	label: string
	image: string
	description?: string
}

const DEFAULT_TAGS = [
	'HVAC',
	'Actuadores',
	'Bombas',
	'Motores',
	'Valvulas',
	'Ventiladores',
]

export const Cover = () => {
	const router = useRouter()
	const selectRef = useRef<SelectInstance<ProductOption, false> | null>(null)
	const [topTags, setTopTags] = useState<string[]>(DEFAULT_TAGS)
	const [inputValue, setInputValue] = useState('')
	const [searchOptions, setSearchOptions] = useState<ProductOption[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const debouncedInputValue = useDebounce(inputValue, 500)

	useEffect(() => {
		let isMounted = true

		const loadTopTags = async () => {
			try {
				const response = await listTags({
					is_active: true,
					type: 'filter',
					limit: 6,
				})

				if (!response.ok || !response.data?.items?.length) {
					return
				}

				const sortedTags = response.data.items
					.filter((tag) => tag.name.trim().length > 0)
					.sort((a, b) => {
						const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0
						const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0
						return bTime - aTime
					})
					.map((tag) => tag.name.trim())
					.filter((tag, index, self) => self.indexOf(tag) === index)
					.slice(0, 6)

				if (isMounted && sortedTags.length > 0) {
					setTopTags([...sortedTags, ...DEFAULT_TAGS].filter((tag, index, self) => self.indexOf(tag) === index).slice(0, 6))
				}
			} catch (error) {
				console.error('Error fetching tags for cover:', error)
			}
		}

		void loadTopTags()

		return () => {
			isMounted = false
		}
	}, [])

	const fetchOptions = async (query: string): Promise<ProductOption[]> => {
		const normalizedQuery = query.trim()
		if (normalizedQuery.length < 2) {
			return []
		}

		try {
			const response = await articlesApi.list({
				q: normalizedQuery,
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

	useEffect(() => {
		let isMounted = true

		const loadDebouncedOptions = async () => {
			const query = debouncedInputValue.trim()

			if (query.length < 2) {
				setSearchOptions([])
				setIsSearching(false)
				return
			}

			setIsSearching(true)
			const options = await fetchOptions(query)

			if (isMounted) {
				setSearchOptions(options)
				setIsSearching(false)
			}
		}

		void loadDebouncedOptions()

		return () => {
			isMounted = false
		}
	}, [debouncedInputValue])

	const handleSelectProduct = (option: ProductOption | null) => {
		if (option) {
			router.push(`/productos/${option.value}`)
		}
	}

	const handleChipClick = (tag: string) => {
		setInputValue(tag)
		selectRef.current?.focus()
	}

	const handleInputChange = (newValue: string, actionMeta: { action: string }) => {
		if (actionMeta.action === 'input-change') {
			setInputValue(newValue)
		}

		if (actionMeta.action === 'menu-close') {
			return inputValue
		}

		return newValue
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
							<Select
								ref={selectRef}
								instanceId="product-search"
								options={searchOptions}
								onChange={handleSelectProduct}
								inputValue={inputValue}
								onInputChange={handleInputChange}
								isLoading={isSearching}
								placeholder={'¿Que buscas? Accesorios de bombeo, motores....'}
								isClearable
								isSearchable
								openMenuOnFocus
								formatOptionLabel={formatOptionLabel}
								noOptionsMessage={() => 'Sin resultados'}
								loadingMessage={() => 'Buscando...'}
								classNamePrefix="product-select"
								filterOption={null}
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
							{topTags.slice(0, 6).map((tag) => (
								<button
									key={tag}
									type="button"
									className={styles.chipButton}
									onClick={() => handleChipClick(tag)}
									aria-label={`Buscar por ${tag}`}
								>
									<Chip type={'primary'} text={tag} />
								</button>
							))}
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
