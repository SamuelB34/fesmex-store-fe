import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import './globals.scss'
import { Providers } from './providers'
import { Header } from '@/app/_components/Header/Header'
import { Nav } from '@/app/_components/Nav/Nav'
import { ReactNode } from 'react'
import { Footer } from '@/app/_components/Footer/Footer'
import { CartProvider } from '@/features/cart/context/CartContext'
import { SectionsProvider } from '@/features/categories/context/SectionsContext'
import { BrandsProvider } from '@/features/brands/context/BrandsContext'
import { Toaster } from 'sileo'
import Script from 'next/script'
import { LoginModalProvider } from '@/shared/login-modal/LoginModalProvider'
import { LoginModalRenderer } from '@/shared/login-modal/LoginModalRenderer'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

const IBMPlexSans = IBM_Plex_Sans({
	variable: '--font-IBM-Plex-Sans',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'FESMEX - Tienda',
	description: 'FESMEX - Tienda en linea',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${IBMPlexSans.variable}`}
			>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=AW-842448825"
					strategy="afterInteractive"
				/>
				<Script id="google-ads-gtag-init" strategy="afterInteractive">
					{`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-842448825');`}
				</Script>
				<Toaster position="top-center" theme="light" />
				<Providers>
					<SectionsProvider>
						<BrandsProvider>
							<CartProvider>
								<LoginModalProvider>
									<Header />
									<div className={'content'}>
										<Nav />
									</div>
									{children}
									<Footer />
									<LoginModalRenderer />
								</LoginModalProvider>
							</CartProvider>
						</BrandsProvider>
					</SectionsProvider>
				</Providers>
			</body>
		</html>
	)
}
