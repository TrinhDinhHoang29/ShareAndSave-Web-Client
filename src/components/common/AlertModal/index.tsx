import clsx from 'clsx'
import {
	AlertCircle,
	CheckCircle,
	HelpCircle,
	Info,
	XCircle
} from 'lucide-react'
import React from 'react'

import AnimatedIcon from './AnimatedIcon'
import BaseModal from './BaseModal'

export type ModalState =
	| 'loading'
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'confirm'
	| 'closed'

interface AlertModalProps {
	isOpen: boolean
	onClose: () => void
	loadingMessage?: string
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
	modalState?: ModalState
}

const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	loadingMessage = 'Đang xử lý...',
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
	confirmTitle = 'Xác nhận',
	confirmMessage = 'Bạn có chắc chắn muốn thực hiện hành động này?',
	confirmButtonText = 'Xác nhận',
	cancelButtonText = 'Hủy',
	onConfirm,
	modalState = 'loading'
}) => {
	const LoadingContent = () => (
		<div className='p-8 text-center'>
			<div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center'>
				<div className='relative'>
					<div className='border-muted h-16 w-16 rounded-full border-4'></div>
					<div className='loading border-primary absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-transparent'></div>
				</div>
			</div>
			<h3 className='text-foreground mb-4 text-2xl font-bold'>Vui lòng đợi</h3>
			<p className='text-muted-foreground mb-8 text-lg leading-relaxed'>
				{loadingMessage}
			</p>
		</div>
	)

	const SuccessContent = () => (
		<div className='relative p-8 text-center'>
			{/* Tối ưu particles - giảm số lượng và đơn giản hóa animation */}
			<div className='pointer-events-none absolute inset-0'>
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className='bg-success absolute h-2 w-2 animate-pulse rounded-full opacity-30'
						style={{
							left: `${25 + i * 20}%`,
							top: `${15 + (i % 2) * 15}%`,
							animationDelay: `${i * 0.5}s`,
							animationDuration: '2s'
						}}
					/>
				))}
			</div>
			<AnimatedIcon
				className={clsx(
					'mx-auto flex h-20 w-20 items-center justify-center rounded-full',
					'bg-success/10 border-success/20 mb-6 border-2'
				)}
				type='pulse'
			>
				<CheckCircle className='text-success h-10 w-10' />
			</AnimatedIcon>
			<h3 className='text-foreground mb-4 text-2xl font-bold'>
				{successTitle}
			</h3>
			<p className='text-muted-foreground mb-8 text-lg leading-relaxed'>
				{successMessage}
			</p>
			<button
				onClick={onClose}
				className={clsx(
					'bg-success w-full rounded-2xl px-6 py-4 text-white',
					'hover:bg-chart-1/90 font-semibold transition-all duration-200'
				)}
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
					'bg-destructive/10 border-destructive/20 mb-6 border-2'
				)}
				type='shake'
			>
				<XCircle className='text-destructive h-10 w-10' />
			</AnimatedIcon>
			<h3 className='text-foreground mb-4 text-2xl font-bold'>{errorTitle}</h3>
			<p className='text-muted-foreground mb-8 text-lg leading-relaxed'>
				{errorMessage}
			</p>
			<button
				onClick={onClose}
				className={clsx(
					'bg-destructive w-full rounded-2xl px-6 py-4 text-white',
					'hover:bg-destructive/90 font-semibold transition-all duration-200'
				)}
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
					'mb-6 border-2 border-yellow-200 bg-yellow-100 dark:border-yellow-700/50 dark:bg-yellow-900/20'
				)}
				type='pulse'
			>
				<AlertCircle className='h-10 w-10 text-yellow-600 dark:text-yellow-400' />
			</AnimatedIcon>
			<h3 className='text-foreground mb-4 text-2xl font-bold'>
				{warningTitle}
			</h3>
			<p className='text-muted-foreground mb-8 text-lg leading-relaxed'>
				{warningMessage}
			</p>
			<button
				onClick={onClose}
				className={clsx(
					'w-full rounded-2xl bg-yellow-500 px-6 py-4 text-white hover:bg-yellow-600',
					'font-semibold transition-all duration-200'
				)}
			>
				{warningButtonText}
			</button>
		</div>
	)

	const InfoContent = () => (
		<div className='relative p-8 text-center'>
			{/* Đơn giản hóa particles */}
			<div className='pointer-events-none absolute inset-0'>
				{[...Array(2)].map((_, i) => (
					<div
						key={i}
						className='bg-primary absolute h-2 w-2 animate-pulse rounded-full opacity-20'
						style={{
							left: `${20 + i * 30}%`,
							top: `${20 + i * 20}%`,
							animationDelay: `${i * 0.8}s`,
							animationDuration: '3s'
						}}
					/>
				))}
			</div>
			<AnimatedIcon
				className={clsx(
					'mx-auto flex h-20 w-20 items-center justify-center rounded-full',
					'bg-primary/10 border-primary/20 mb-6 border-2'
				)}
				type='float'
			>
				<Info className='text-primary h-10 w-10' />
			</AnimatedIcon>
			<h3 className='text-foreground mb-4 text-2xl font-bold'>{infoTitle}</h3>
			<p className='text-muted-foreground mb-8 text-lg leading-relaxed'>
				{infoMessage}
			</p>
			<button
				onClick={onClose}
				className={clsx(
					'bg-primary text-primary-foreground w-full rounded-2xl px-6 py-4',
					'hover:bg-primary/90 font-semibold transition-all duration-200'
				)}
			>
				{infoButtonText}
			</button>
		</div>
	)

	const ConfirmContent = () => (
		<div className='relative p-8 text-center'>
			{/* Đơn giản hóa particles */}
			<div className='pointer-events-none absolute inset-0'>
				{[...Array(2)].map((_, i) => (
					<div
						key={i}
						className='bg-primary absolute h-2 w-2 animate-pulse rounded-full opacity-15'
						style={{
							left: `${25 + i * 30}%`,
							top: `${15 + i * 25}%`,
							animationDelay: `${i * 1}s`,
							animationDuration: '4s'
						}}
					/>
				))}
			</div>
			<AnimatedIcon
				className={clsx(
					'mx-auto flex h-20 w-20 items-center justify-center rounded-full',
					'bg-primary/10 border-primary/20 mb-6 border-2'
				)}
				type='pulse'
			>
				<HelpCircle className='text-primary h-10 w-10' />
			</AnimatedIcon>
			<h3 className='text-foreground mb-4 text-2xl font-bold'>
				{confirmTitle}
			</h3>
			<p className='text-muted-foreground mb-8 text-lg leading-relaxed'>
				{confirmMessage}
			</p>
			<div className='flex gap-4'>
				<button
					onClick={onClose}
					className={clsx(
						'bg-muted text-foreground flex-1 rounded-2xl px-6 py-4',
						'hover:bg-muted/80 font-semibold transition-all duration-200'
					)}
				>
					{cancelButtonText}
				</button>
				<button
					onClick={onConfirm}
					className={clsx(
						'bg-primary text-primary-foreground flex-1 rounded-2xl px-6 py-4',
						'hover:bg-primary/90 font-semibold transition-all duration-200'
					)}
				>
					{confirmButtonText}
				</button>
			</div>
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
			case 'confirm':
				return <ConfirmContent />
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
