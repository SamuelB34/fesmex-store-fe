'use client'

import Image from 'next/image'
import styles from './LogosMarquee.module.scss'

export interface Logo {
	id: string
	src: string
	alt: string
	width: number
	height: number
	name?: string
}

interface LogosMarqueeProps {
	logos: Logo[]
	direction: 'left' | 'right'
	onBrandClick?: (brandName: string) => void
}

export const LogosMarquee = ({ logos, direction, onBrandClick }: LogosMarqueeProps) => {
	return (
		<div className={styles.container}>
			<div
				className={`${styles.marquee} ${direction === 'right' ? styles.reverse : ''}`}
			>
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className={styles.marqueeContent}
						aria-hidden={index > 0}
					>
						{logos.map((logo) => (
							<div
								key={`${logo.id}-${index}`}
								className={`${styles.logo} ${onBrandClick && logo.name ? 'cursor-pointer' : ''}`}
								onClick={() => onBrandClick && logo.name && onBrandClick(logo.name)}
								role={onBrandClick && logo.name ? 'button' : undefined}
								tabIndex={onBrandClick && logo.name ? 0 : undefined}
								onKeyDown={(e) => {
									if (onBrandClick && logo.name && (e.key === 'Enter' || e.key === ' ')) {
										onBrandClick(logo.name)
									}
								}}
							>
								<Image
									src={logo.src}
									alt={logo.alt}
									width={logo.width}
									height={logo.height}
									style={{ height: 'auto', width: 'auto' }}
								/>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	)
}
