import React, { createContext, useContext } from 'react'

import AlertModal, { ModalState } from '@/components/common/AlertModal'
import { useAlertModal } from '@/hooks/useAlertModal'

interface AlertModalConfig {
	loadingMessage?: string
	onCancel?: () => void
	successTitle?: string
	successMessage?: string
	successButtonText?: string
	errorTitle?: string
	errorMessage?: string
	errorButtonText?: string
	warningTitle?: string
	warningMessage?: string
	warningButtonText?: string
	infoTitle?: string
	infoMessage?: string
	infoButtonText?: string
	confirmTitle?: string
	confirmMessage?: string
	confirmButtonText?: string
	onConfirm?: () => void
}

interface AlertModalContextType {
	isOpen: boolean
	modalState: ModalState
	config: AlertModalConfig
	showLoading: (config?: Partial<AlertModalConfig>) => void
	showSuccess: (config?: Partial<AlertModalConfig>) => void
	showError: (config?: Partial<AlertModalConfig>) => void
	showWarning: (config?: Partial<AlertModalConfig>) => void
	showInfo: (config?: Partial<AlertModalConfig>) => void
	showConfirm: (config?: Partial<AlertModalConfig>) => void
	close: () => void
}

const AlertModalContext = createContext<AlertModalContextType | undefined>(
	undefined
)

export const AlertModalProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const modal = useAlertModal()

	return (
		<AlertModalContext.Provider value={modal}>
			{children}
			<AlertModal
				isOpen={modal.isOpen}
				onClose={modal.close}
				modalState={modal.modalState}
				{...modal.config}
			/>
		</AlertModalContext.Provider>
	)
}

export const useAlertModalContext = (): AlertModalContextType => {
	const context = useContext(AlertModalContext)
	if (!context) {
		throw new Error(
			'useAlertModalContext must be used within an AlertModalProvider'
		)
	}
	return context
}
