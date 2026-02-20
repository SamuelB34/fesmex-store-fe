import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import './globals.scss'
import { Providers } from './providers'
import { Header } from '@/app/_components/Header/Header'
import { Nav } from '@/app/_components/Nav/Nav'
import { ReactNode } from 'react'
import { Footer } from '@/app/_components/Footer/Footer'
import { IndustrialHero } from '@/app/_components/IndustrialHero/IndustrialHero'

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
				<Header />
				<div className={'content'}>
					<Nav />
				</div>
				<Providers>{children}</Providers>

				<Footer />
			</body>
		</html>
	)
}
