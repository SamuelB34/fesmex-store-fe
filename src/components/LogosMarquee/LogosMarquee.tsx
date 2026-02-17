'use client'

import Marquee from 'react-fast-marquee'
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
			<div className={styles.row}>
				<Marquee speed={40} pauseOnHover gradient={false} direction={direction}>
					{logos.map((logo) => (
						<div key={logo.id} className={styles.logo}>
							<Image
								src={logo.src}
								alt={logo.alt}
								width={logo.width}
								height={logo.height}
							/>
						</div>
					))}
				</Marquee>
			</div>
		</div>
	)
}
