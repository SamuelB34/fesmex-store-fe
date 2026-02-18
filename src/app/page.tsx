'use client'

import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { useArticles } from '@/features/articles/hooks/useArticles'
// import { useCart } from '@/features/cart/hooks/useCart'
// import { useAuth } from '@/shared/auth/AuthProvider'
// import { ArticleListItem } from '@/features/services/articles.api'
import styles from './page.module.scss'
import { Header } from '@/app/_components/Header/Header'
import { Nav } from '@/app/_components/Nav/Nav'
import { Cover } from '@/app/_components/Cover/Cover'
import { IndustrialHero } from '@/app/_components/IndustrialHero/IndustrialHero'
import { ProductFeatured } from '@/app/_components/ProductsFeatured/ProductFeatured'
import { Products } from '@/app/_components/Products/Products'
import { BestBrands } from '@/app/_components/BestBrands/BestBrands'
import { Footer } from '@/app/_components/Footer/Footer'

export default function Home() {
	// const router = useRouter()
	// const { accessToken } = useAuth()
	const { fetchArticles } = useArticles()
	// const { addItem } = useCart()
	// const [_, setAddingId] = useState<string | null>(null)
	// const [searchQuery, _] = useState('')

	useEffect(() => {
		fetchArticles({ page: 1, limit: 12 })
	}, [fetchArticles])

	// const handleAddToCart = async (article: ArticleListItem) => {
	// 	if (!accessToken) {
	// 		router.push('/login?next=%2F')
	// 		return
	// 	}
	// 	setAddingId(article._id)
	// 	await addItem({
	// 		article_id: article._id,
	// 		quantity: 1,
	// 		unit_price: article.price,
	// 	})
	// 	setAddingId(null)
	// }
	//
	// const handleSearch = () => {
	// 	fetchArticles({ page: 1, limit: 12, q: searchQuery || undefined })
	// }
	//
	// const handlePageChange = (newPage: number) => {
	// 	fetchArticles({ page: newPage, limit: 12, q: searchQuery || undefined })
	// }

	return (
		<div className={styles.container}>
			<Header />
			<div className={styles.content}>
				<Nav />
				<Cover />
			</div>

			<div className={styles.product_featured}>
				<ProductFeatured />
			</div>

			<div className={styles.content}>
				<Products />
			</div>

			<BestBrands />

			<div className={styles.content}>
				<IndustrialHero />
			</div>

			<Footer />
		</div>
	)
}
