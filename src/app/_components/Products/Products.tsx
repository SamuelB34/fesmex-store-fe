'use client'

import styles from './Products.module.scss'
import { Brand } from '@/components/Brand/Brand'
import { Product } from '@/components/Product/Product'
import type { Section } from '@/app/mock'
import { useRouter } from 'next/navigation'

interface ProductView {
  id: string
  name: string
  brand: string
  price: number
  currency: string
  stock: number
  image: string
}

interface ProductProps {
  sections: Section[]
  brands?: Section[]
  types?: Section[]
  products: ProductView[]
  isLoading: boolean
  onSectionSelect?: (sectionId: string) => void
  onSelectProduct?: (productId: string) => void
}

export const Products = ({
  sections,
  brands,
  types,
  products,
  isLoading,
  onSectionSelect,
  onSelectProduct,
}: ProductProps) => {
  const router = useRouter()

  const handleSelectProduct = (productId: string) => {
    onSelectProduct?.(productId)
    router.push(`/productos/${productId}`)
  }

	return (
		<div className={styles.products}>
			<span className={styles.products__title}>Soluciones FESMEX</span>

			<div className={styles.products__catalog}>
				<div className={styles.left}>
					{/*Sections*/}
					<div className={styles.sections}>
						{sections.map((section) => (
							<Brand
								key={section.id}
								text={section.text}
								number={section.number}
								type={section.type}
								active={section.active}
								onSelect={() => onSectionSelect?.(section.id)}
							/>
						))}
					</div>

					{/*Brands*/}
					{brands && (
						<div className={styles.sections}>
							<span className={styles.sections__subtitle}>Marca</span>
							{brands.map((brand) => (
								<Brand
									key={brand.text}
									text={brand.text}
									number={brand.number}
									type={brand.type}
									active={brand.active}
								/>
							))}
						</div>
					)}

					{/*Types*/}
					{types && (
						<div className={styles.sections}>
							<span className={styles.sections__subtitle}>Tipo</span>
							{types.map((type) => (
								<Brand
									key={type.text}
									text={type.text}
									number={type.number}
									type={type.type}
									active={type.active}
								/>
							))}
						</div>
					)}
				</div>

				{/*Products*/}
				<div className={styles.products_list}>
					<span className={styles.products_list__title}>
						{isLoading
							? 'Cargando productos...'
							: `${products.length} Productos`}
					</span>
					<div className={styles.products_list__content}>
						{products.map((product) => (
							<div className={styles.item} key={product.id}>
								<Product
									product={product}
									short
									onSelect={handleSelectProduct}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
