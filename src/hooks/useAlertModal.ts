import { useRef, useState } from 'react'

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
	infoTitle?: string
	infoMessage?: string
	infoButtonText?: string
	confirmTitle?: string
	confirmMessage?: string
	confirmButtonText?: string
	cancelButtonText?: string
	onConfirm?: () => void
}

interface AlertModalReturn {
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

export const useAlertModal = (): AlertModalReturn => {
	const [isOpen, setIsOpen] = useState(false)
	const [modalState, setModalState] = useState<ModalState>('loading')
	const [config, setConfig] = useState<AlertModalConfig>({})
	const debounceRef = useRef<NodeJS.Timeout | null>(null)

	const debounceAction = (action: () => void, delay: number = 300) => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current)
		}
		debounceRef.current = setTimeout(action, delay)
	}

	const showLoading = (loadingConfig: Partial<AlertModalConfig> = {}) => {
		debounceAction(() => {
			setConfig(loadingConfig)
			setModalState('loading')
			setIsOpen(true)
		}, 100)
	}

	const showSuccess = (successConfig: Partial<AlertModalConfig> = {}) => {
		debounceAction(() => {
			setConfig(prev => ({ ...prev, ...successConfig }))
			setModalState('success')
			setIsOpen(true)
		}, 100)
	}

	const showError = (errorConfig: Partial<AlertModalConfig> = {}) => {
		debounceAction(() => {
			setConfig(prev => ({ ...prev, ...errorConfig }))
			setModalState('error')
			setIsOpen(true)
		}, 100)
	}

	const showWarning = (warningConfig: Partial<AlertModalConfig> = {}) => {
		debounceAction(() => {
			setConfig(prev => ({ ...prev, ...warningConfig }))
			setModalState('warning')
			setIsOpen(true)
		}, 100)
	}

	const showInfo = (infoConfig: Partial<AlertModalConfig> = {}) => {
		debounceAction(() => {
			setConfig(prev => ({ ...prev, ...infoConfig }))
			setModalState('info')
			setIsOpen(true)
		}, 100)
	}

	const showConfirm = (confirmConfig: Partial<AlertModalConfig> = {}) => {
		debounceAction(() => {
			setConfig(prev => ({ ...prev, ...confirmConfig }))
			setModalState('confirm')
			setIsOpen(true)
		}, 100)
	}

	const close = () => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current)
		}
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
		showInfo,
		showConfirm,
		close
	}
}
