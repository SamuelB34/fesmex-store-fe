import styles from './Header.module.scss'
import { Chip } from '@/components/Chip/Chip'
import Image from 'next/image'

export const Header = () => {
	return (
		<div className={styles.header}>
			<div className={styles.header__content}>
				<div className={styles.header__left}>
					<div className={styles.pointer}>
						<Chip
							type={'secondary'}
							active={false}
							leftIcon={
								<Image
									src={'/icons/phone.svg'}
									alt={'phone'}
									height={24}
									width={24}
								/>
							}
							text={'(686) 561 4616'}
						/>
					</div>

					<div className={styles.pointer}>
						<Chip
							type={'secondary'}
							active={false}
							leftIcon={
								<Image
									src={'/icons/mail.svg'}
									alt={'mail'}
									height={24}
									width={24}
								/>
							}
							text={'contact@fesmex.com'}
						/>
					</div>
				</div>

				<div className={styles.header__right}>
					<div className={styles.pointer}>
						<Chip
							type={'secondary'}
							active={false}
							leftIcon={
								<Image
									src={'/icons/user.svg'}
									alt={'user'}
									height={24}
									width={24}
								/>
							}
							text={'Login'}
						/>
					</div>

					<span className={styles.text}>Regístrate</span>
				</div>
			</div>
		</div>
	)
}
