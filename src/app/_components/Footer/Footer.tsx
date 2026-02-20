import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.scss'

const brands = [
	'Amatrol',
	'Belimo',
	'Bell & Gossett',
	'Big Ass Fans',
	'FlowCon',
	'Flygt',
	'Goulds Water Technology',
	'Marathon',
	'Ruskins',
	'SJE Rhombus',
	'Superior Tank',
	'Titus',
	'Watts',
]

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.footer__top}>
				<div className={styles.footer__brandInfo}>
					<div className={styles.footer__logo}>
						<Image
							src="/illustrations/fesmex-white.svg"
							alt="FESMEX logo"
							width={160}
							height={40}
							priority
						/>
					</div>
					<div className={styles.footer__address}>
						<span>Blvd. Adolfo López Mateos #2292-4</span>
						<span>Mexicali, B.C. México C.P. 21389</span>
					</div>
					<div className={styles.footer__contacts}>
						<Link className={styles.contactChip} href="tel:+526865614616">
							<Image
								src="/icons/phone.svg"
								alt="phone"
								width={18}
								height={18}
							/>
							<span>(686) 561 4616</span>
						</Link>
						<Link
							className={styles.contactChip}
							href="mailto:contact@fesmex.com"
						>
							<Image src="/icons/mail.svg" alt="email" width={18} height={18} />
							<span>contact@fesmex.com</span>
						</Link>
					</div>
				</div>

				<div className={styles.footer__brands}>
					<h3>Marcas</h3>
					<ul>
						{brands.map((brand) => (
							<li key={brand}>{brand}</li>
						))}
					</ul>
				</div>
			</div>

			<hr className={styles.footer__divider} />

			<div className={styles.footer__bottom}>
				<span>©2026 All Rights Reserved.</span>
				<div className={styles.footer__links}>
					<Link href="/privacy">Privacy Policy</Link>
					<Link href="/terms">Term of Use</Link>
				</div>
			</div>
		</footer>
	)
}
