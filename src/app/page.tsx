'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { useCart } from '@/features/cart/hooks/useCart'
import { useAuth } from '@/shared/auth/AuthProvider'
import { ArticleListItem } from '@/features/services/articles.api'
import styles from './page.module.scss'
import { formatCurrency } from '@/shared/utils/format'
import { Header } from '@/app/_components/Header/Header'
import { Nav } from '@/app/_components/Nav/Nav'
import { Cover } from '@/app/_components/Cover/Cover'
import { ProductFeatured } from '@/app/_components/ProductsFeatured/ProductFeatured'

export default function Home() {
	const router = useRouter()
	const { accessToken } = useAuth()
	const { items, page, totalPages, isLoading, error, fetchArticles } =
		useArticles()
	const { addItem } = useCart()
	const [addingId, setAddingId] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		fetchArticles({ page: 1, limit: 12 })
	}, [fetchArticles])

	const handleAddToCart = async (article: ArticleListItem) => {
		if (!accessToken) {
			router.push('/login?next=%2F')
			return
		}
		setAddingId(article._id)
		await addItem({
			article_id: article._id,
			quantity: 1,
			unit_price: article.price,
		})
		setAddingId(null)
	}

	const handleSearch = () => {
		fetchArticles({ page: 1, limit: 12, q: searchQuery || undefined })
	}

	const handlePageChange = (newPage: number) => {
		fetchArticles({ page: newPage, limit: 12, q: searchQuery || undefined })
	}

	return (
		<div className={styles.container}>
			<Header />
			<div className={styles.content}>
				<Nav />
				<Cover />
				<ProductFeatured />
			</div>

			<nav className={styles.nav}>
				<Link href="/" className={styles.navBrand}>
					FESMEX Store
				</Link>
				<div className={styles.navLinks}>
					<Link href="/cart">Cart</Link>
					<Link href="/orders">Orders</Link>
					{accessToken ? (
						<Link href="/account">Account</Link>
					) : (
						<Link href="/login">Login</Link>
					)}
				</div>
			</nav>

			<h1 className={styles.title}>Articles</h1>

			<div className={styles.searchBar}>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					placeholder="Search articles..."
					className={styles.searchInput}
				/>
				<button onClick={handleSearch} className={styles.searchButton}>
					Search
				</button>
			</div>

			{error && <div className={styles.error}>{error}</div>}

			{isLoading ? (
				<p className={styles.loadingText}>Loading articles...</p>
			) : (
				<>
					<div className={styles.grid}>
						{items.map((article) => (
							<div key={article._id} className={styles.card}>
								<h3 className={styles.cardTitle}>{article.name}</h3>
								{article.description && (
									<p className={styles.cardDesc}>{article.description}</p>
								)}
								<div className={styles.cardMeta}>
									{article.brand && <span>Brand: {article.brand}</span>}
									{article.sku && <span>SKU: {article.sku}</span>}
								</div>
								<div className={styles.cardFooter}>
									{/*Price*/}
									<span className={styles.price}>
										{formatCurrency(article.price ?? 0)}
									</span>
									{article.stock && (
										<span
											className={
												article.stock.count ? styles.stock : styles.stockOut
											}
										>
											{article.stock.count > 0
												? `${article.stock.count} in stock`
												: 'Out of stock'}
										</span>
									)}
								</div>
								<button
									onClick={() => handleAddToCart(article)}
									disabled={addingId === article._id}
									className={styles.addButton}
								>
									{addingId === article._id ? 'Adding...' : 'Add to Cart'}
								</button>
							</div>
						))}
					</div>

					{items.length === 0 && !isLoading && (
						<p className={styles.emptyText}>No articles found.</p>
					)}

					{totalPages > 1 && (
						<div className={styles.pagination}>
							<button
								onClick={() => handlePageChange(page - 1)}
								disabled={page <= 1}
								className={styles.pageButton}
							>
								Previous
							</button>
							<span className={styles.pageInfo}>
								Page {page} of {totalPages}
							</span>
							<button
								onClick={() => handlePageChange(page + 1)}
								disabled={page >= totalPages}
								className={styles.pageButton}
							>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</div>
	)
}
