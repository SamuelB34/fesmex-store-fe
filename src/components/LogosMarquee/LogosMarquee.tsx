'use client'

import Image from 'next/image'
import styles from './LogosMarquee.module.scss'

export interface Logo {
	id: string
	src: string
	alt: string
	width: number
	height: number
}

interface LogosMarqueeProps {
	logos: Logo[]
	direction: 'left' | 'right'
}

export const LogosMarquee = ({ logos, direction }: LogosMarqueeProps) => {
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
							<div key={`${logo.id}-${index}`} className={styles.logo}>
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
