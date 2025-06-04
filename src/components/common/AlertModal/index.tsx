import clsx from 'clsx'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import React from 'react'

import AnimatedIcon from './AnimatedIcon'
import BaseModal from './BaseModal'

export type ModalState =
	| 'loading'
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'closed'

interface AlertModalProps {
	isOpen: boolean
	onClose: () => void
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
	modalState?: ModalState
}

const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	loadingMessage = 'Đang xử lý...',
	showCancel = false,
	onCancel,
	successTitle = 'Thành công',
	successMessage = 'Thao tác đã được thực hiện thành công!',
	successButtonText = 'Tuyệt vời',
	errorTitle = 'Có lỗi xảy ra',
	errorMessage = 'Vui lòng thử lại sau.',
	errorButtonText = 'Đóng',
	warningTitle = 'Cảnh báo',
	warningMessage = 'Vui lòng kiểm tra lại thông tin.',
	warningButtonText = 'Đã hiểu',
	infoTitle = 'Thông báo',
	infoMessage = 'Đây là thông tin quan trọng.',
	infoButtonText = 'Đã biết',
	modalState = 'loading'
}) => {
	const LoadingContent = () => (
		<div className='p-8 text-center'>
			<div
				className={clsx(
					'modal-enter mx-auto mb-6 flex h-20 w-20 items-center justify-center'
				)}
				style={{ animationDelay: '0.1s' }}
			>
				<div className='relative'>
					<div className='h-16 w-16 rounded-full border-4 border-gray-200'></div>
					<div className='border-r-primary loading absolute top-0 left-0 h-16 w-16 rounded-full border-4'></div>
				</div>
			</div>
			<h3
				className={clsx('modal-enter mb-4 text-2xl font-bold text-gray-900')}
				style={{ animationDelay: '0.2s' }}
			>
				Vui lòng đợi
			</h3>
			<p
				className={clsx(
					'modal-enter mb-8 text-lg leading-relaxed text-gray-600'
				)}
				style={{ animationDelay: '0.3s' }}
			>
				{loadingMessage}
			</p>
			{showCancel && onCancel && (
				<button
					onClick={onCancel}
					className={clsx(
						'rounded-2xl bg-gray-100 px-8 py-4 text-gray-700 hover:bg-gray-200',
						'button-ripple modal-enter font-semibold transition-all duration-300 hover:scale-105 active:scale-95'
					)}
					style={{ animationDelay: '0.4s' }}
				>
					Hủy
				</button>
			)}
		</div>
	)

	const SuccessContent = () => (
		<div className='relative p-8 text-center'>
			<div className='pointer-events-none absolute inset-0'>
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className={clsx(
							'float absolute h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-60'
						)}
						style={{
							left: `${20 + i * 12}%`,
							top: `${10 + (i % 2) * 20}%`,
							animationDelay: `${i * 0.5}s`
						}}
					/>
				))}
			</div>
			<AnimatedIcon
				className={clsx(
					'mx-auto flex h-20 w-20 items-center justify-center rounded-full',
					'mb-6 bg-gradient-to-br from-emerald-100 to-green-200 shadow-lg'
				)}
				type='pulse'
			>
				<CheckCircle className='h-10 w-10 text-emerald-600' />
			</AnimatedIcon>
			<h3
				className={clsx('modal-enter mb-4 text-2xl font-bold text-gray-900')}
				style={{ animationDelay: '0.2s' }}
			>
				{successTitle}
			</h3>
			<p
				className={clsx(
					'modal-enter mb-8 text-lg leading-relaxed text-gray-600'
				)}
				style={{ animationDelay: '0.3s' }}
			>
				{successMessage}
			</p>
			<button
				onClick={onClose}
				className={clsx(
					'w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 text-white',
					'font-semibold transition-all duration-300 hover:from-emerald-600 hover:to-green-700',
					'button-ripple modal-enter shadow-lg hover:scale-105 hover:shadow-emerald-200 active:scale-95'
				)}
				style={{ animationDelay: '0.4s' }}
			>
				{successButtonText}
			</button>
		</div>
	)

	const ErrorContent = () => (
		<div className='relative p-8 text-center'>
			<AnimatedIcon
				className={clsx(
					'mx-auto flex h-20 w-20 items-center justify-center rounded-full',
					'mb-6 bg-gradient-to-br from-red-100 to-rose-200 shadow-lg'
				)}
				type='shake'
			>
				<XCircle className='h-10 w-10 text-rose-600' />
			</AnimatedIcon>
			<h3
				className={clsx('modal-enter mb-4 text-2xl font-bold text-gray-900')}
				style={{ animationDelay: '0.2s' }}
			>
				{errorTitle}
			</h3>
			<p
				className={clsx(
					'modal-enter mb-8 text-lg leading-relaxed text-gray-600'
				)}
				style={{ animationDelay: '0.3s' }}
			>
				{errorMessage}
			</p>
			<button
				onClick={onClose}
				className={clsx(
					'w-full rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 px-6 py-4 text-white',
					'font-semibold transition-all duration-300 hover:from-rose-600 hover:to-red-700',
					'button-ripple modal-enter shadow-lg hover:scale-105 hover:shadow-rose-200 active:scale-95'
				)}
				style={{ animationDelay: '0.4s' }}
			>
				{errorButtonText}
			</button>
		</div>
	)

	const WarningContent = () => (
		<div className='relative p-8 text-center'>
			<AnimatedIcon
				className={clsx(
					'mx-auto flex h-20 w-20 items-center justify-center rounded-full',
					'mb-6 bg-gradient-to-br from-amber-100 to-yellow-200 shadow-lg'
				)}
				type='pulse'
			>
				<AlertCircle className='h-10 w-10 text-amber-600' />
			</AnimatedIcon>
			<h3
				className={clsx('modal-enter mb-4 text-2xl font-bold text-gray-900')}
				style={{ animationDelay: '0.2s' }}
			>
				{warningTitle}
			</h3>
			<p
				className={clsx(
					'modal-enter mb-8 text-lg leading-relaxed text-gray-600'
				)}
				style={{ animationDelay: '0.3s' }}
			>
				{warningMessage}
			</p>
			<button
				onClick={onClose}
				className={clsx(
					'w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-4 text-white',
					'font-semibold transition-all duration-300 hover:from-amber-600 hover:to-yellow-700',
					'button-ripple modal-enter shadow-lg hover:scale-105 hover:shadow-amber-200 active:scale-95'
				)}
				style={{ animationDelay: '0.4s' }}
			>
				{warningButtonText}
			</button>
		</div>
	)

	const InfoContent = () => (
		<div className='relative p-8 text-center'>
			<div className='pointer-events-none absolute inset-0'>
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className={clsx(
							'float absolute h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 opacity-40'
						)}
						style={{
							left: `${15 + i * 20}%`,
							top: `${15 + (i % 2) * 15}%`,
							animationDelay: `${i * 0.8}s`,
							animationDuration: '3s'
						}}
					/>
				))}
			</div>
			<AnimatedIcon
				className={clsx(
					'mx-auto flex h-20 w-20 items-center justify-center rounded-full',
					'mb-6 bg-gradient-to-br from-blue-100 to-cyan-200 shadow-lg'
				)}
				type='pulse'
			>
				<Info className='h-10 w-10 text-blue-600' />
			</AnimatedIcon>
			<h3
				className={clsx('modal-enter mb-4 text-2xl font-bold text-gray-900')}
				style={{ animationDelay: '0.2s' }}
			>
				{infoTitle}
			</h3>
			<p
				className={clsx(
					'modal-enter mb-8 text-lg leading-relaxed text-gray-600'
				)}
				style={{ animationDelay: '0.3s' }}
			>
				{infoMessage}
			</p>
			<button
				onClick={onClose}
				className={clsx(
					'w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4 text-white',
					'font-semibold transition-all duration-300 hover:from-blue-600 hover:to-cyan-700',
					'button-ripple modal-enter shadow-lg hover:scale-105 hover:shadow-blue-200 active:scale-95'
				)}
				style={{ animationDelay: '0.4s' }}
			>
				{infoButtonText}
			</button>
		</div>
	)

	const renderContent = () => {
		switch (modalState) {
			case 'success':
				return <SuccessContent />
			case 'error':
				return <ErrorContent />
			case 'warning':
				return <WarningContent />
			case 'info':
				return <InfoContent />
			case 'loading':
			default:
				return <LoadingContent />
		}
	}

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={modalState === 'loading' ? () => {} : onClose}
			showCloseButton={modalState !== 'loading'}
			backdropClose={modalState !== 'loading'}
		>
			{renderContent()}
		</BaseModal>
	)
}

export default AlertModal
