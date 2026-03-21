'use client'

import { Login } from '@/app/_components/Login/Login'
import { RegisterModal } from '@/app/_components/RegisterModal/RegisterModal'
import { useLoginModal } from '@/shared/login-modal/LoginModalProvider'

export const LoginModalRenderer = () => {
	const { isOpen, mode } = useLoginModal()

	if (!isOpen) {
		return null
	}

	return mode === 'register' ? <RegisterModal /> : <Login />
}
