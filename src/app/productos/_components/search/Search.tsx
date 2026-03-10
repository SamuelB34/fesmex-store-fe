import styles from './Search.module.scss'
import { Input } from '@/components/Input/Input'
import Image from 'next/image'
import { useState } from 'react'

interface SearchProps {
	onSearch: (query: string) => void
	initialValue?: string
}

export const Search = ({ onSearch, initialValue = '' }: SearchProps) => {
	const [value, setValue] = useState(initialValue)

	const handleSearch = () => {
		onSearch(value.trim())
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			handleSearch()
		}
	}

	return (
		<div className={styles.search}>
			<span className={styles.search__title}>
				Nuestros <br /> Productos
			</span>
			<div className={styles.shape}></div>
			<div className={styles.search__input}>
				<Input
					placeholder={'¿Que buscas? Accesorios de bombeo, motores....'}
					value={value}
					onChange={(event) => setValue(event.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<div
					className={styles.btn}
					onClick={handleSearch}
					role="button"
					tabIndex={0}
				>
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
