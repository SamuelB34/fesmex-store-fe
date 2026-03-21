'use client'

import { ReactNode } from 'react'
import styles from './ConfirmModal.module.scss'

interface ConfirmModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string | ReactNode
	confirmText?: string
	cancelText?: string
	isLoading?: boolean
}

export const ConfirmModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	isLoading = false,
}: ConfirmModalProps) => {
	if (!isOpen) return null

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>{title}</h2>
					<button
						className={styles.closeBtn}
						onClick={onClose}
						disabled={isLoading}
						aria-label="Cerrar"
					>
						×
					</button>
				</div>

				<div className={styles.body}>
					{typeof message === 'string' ? <p>{message}</p> : message}
				</div>

				<div className={styles.footer}>
					<button
						className={styles.cancelBtn}
						onClick={onClose}
						disabled={isLoading}
					>
						{cancelText}
					</button>
					<button
						className={styles.confirmBtn}
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading ? 'Procesando...' : confirmText}
					</button>
				</div>
			</div>
		</div>
	)
}
