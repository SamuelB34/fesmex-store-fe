"use client"

import { createContext, useCallback, useContext, useState } from 'react'

type LoginModalMode = 'login' | 'register'

interface LoginModalContextValue {
	isOpen: boolean
	mode: LoginModalMode
	openLogin: () => void
	openRegister: () => void
	close: () => void
}

const LoginModalContext = createContext<LoginModalContextValue | undefined>(undefined)

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false)
	const [mode, setMode] = useState<LoginModalMode>('login')

	const openLogin = useCallback(() => {
		setMode('login')
		setIsOpen(true)
	}, [])

	const openRegister = useCallback(() => {
		setMode('register')
		setIsOpen(true)
	}, [])

	const close = useCallback(() => setIsOpen(false), [])

	return (
		<LoginModalContext.Provider value={{ isOpen, mode, openLogin, openRegister, close }}>
			{children}
		</LoginModalContext.Provider>
	)
}

export function useLoginModal() {
	const context = useContext(LoginModalContext)
	if (!context) {
		throw new Error('useLoginModal must be used within LoginModalProvider')
	}
	return context
}
