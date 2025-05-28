import { useState } from 'react'

import { ModalState } from '@/components/common/AlertModal'

interface AlertModalConfig {
	loadingMessage?: string
	showCancel?: boolean
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
}

interface AlertModalReturn {
	isOpen: boolean
	modalState: ModalState
	config: AlertModalConfig
	showLoading: (config?: Partial<AlertModalConfig>) => void
	showSuccess: (config?: Partial<AlertModalConfig>) => void
	showError: (config?: Partial<AlertModalConfig>) => void
	showWarning: (config?: Partial<AlertModalConfig>) => void
	close: () => void
}

export const useAlertModal = (): AlertModalReturn => {
	const [isOpen, setIsOpen] = useState(false)
	const [modalState, setModalState] = useState<ModalState>('loading')
	const [config, setConfig] = useState<AlertModalConfig>({})

	const showLoading = (loadingConfig: Partial<AlertModalConfig> = {}) => {
		setConfig(loadingConfig)
		setModalState('loading')
		setIsOpen(true)
	}

	const showSuccess = (successConfig: Partial<AlertModalConfig> = {}) => {
		setConfig(prev => ({ ...prev, ...successConfig }))
		setModalState('success')
	}

	const showError = (errorConfig: Partial<AlertModalConfig> = {}) => {
		setConfig(prev => ({ ...prev, ...errorConfig }))
		setModalState('error')
	}

	const showWarning = (warningConfig: Partial<AlertModalConfig> = {}) => {
		setConfig(prev => ({ ...prev, ...warningConfig }))
		setModalState('warning')
	}

	const close = () => {
		setIsOpen(false)
		setTimeout(() => {
			setModalState('loading')
			setConfig({})
		}, 300)
	}

	return {
		isOpen,
		modalState,
		config,
		showLoading,
		showSuccess,
		showError,
		showWarning,
		close
	}
}
