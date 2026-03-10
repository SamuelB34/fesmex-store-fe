'use client'

import styles from './Header.module.scss'
import { Chip } from '@/components/Chip/Chip'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/shared/auth/AuthProvider'
import { useLoginModal } from '@/shared/login-modal/LoginModalProvider'

export const Header = () => {
	const { user, logout } = useAuth()
	const { openLogin, openRegister } = useLoginModal()

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
					{user ? (
						<div className={styles.values}>
							<Link href="/account" className={styles.row}>
								<Image
									src={'/icons/user.svg'}
									alt={'user'}
									width={24}
									height={24}
								/>
								<span className={styles.text}>Mi perfil</span>
							</Link>
							<div className={styles.separator}></div>
							<span className={styles.row} onClick={logout}>
								<Image
									src={'/icons/exit.svg'}
									alt={'exit'}
									width={24}
									height={24}
								/>
								Salir
							</span>
						</div>
					) : (
						<>
							<div className={styles.pointer} onClick={openLogin}>
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

							<button
								type="button"
								className={styles.text}
								onClick={openRegister}
							>
								Regístrate
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
