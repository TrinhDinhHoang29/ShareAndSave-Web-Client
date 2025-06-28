import React, { useEffect, useRef, useState } from 'react'

import Loading from '@/components/common/Loading'
import {
	useSendOTPMutation,
	useVerifyOTPMutation
} from '@/hooks/mutations/use-auth.mutation'
import { EPurposeOTP } from '@/models/enums'

interface OTPInputDialogProps {
	length?: number
	email: string
	onComplete: (verifyToken: string, purpose: EPurposeOTP, email: string) => void
	purpose: EPurposeOTP
	sendOTPDirectly?: boolean
}

const OTPInputDialog: React.FC<OTPInputDialogProps> = ({
	length = 6,
	email,
	onComplete,
	purpose,
	sendOTPDirectly = false
}) => {
	const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
	const [activeIndex, setActiveIndex] = useState<number>(0)
	const [timeLeft, setTimeLeft] = useState<number>(300) // 5 phút = 300 giây
	const [canResend, setCanResend] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [isBlocked, setIsBlocked] = useState<boolean>(false)
	const [blockTimeLeft, setBlockTimeLeft] = useState<number>(0)
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])
	const { mutate: sendOTPMutation } = useSendOTPMutation({
		onError: (message: string) => {
			setErrorMessage(message)
			setIsBlocked(true)
			setBlockTimeLeft(300) // 10 phút = 600 giây
			setCanResend(false)
			setTimeLeft(0)
		},
		onSuccess: () => {
			setErrorMessage('')
			setIsBlocked(false)
			setBlockTimeLeft(0)
		}
	})
	const { mutate: verifyOTPMutation, isPending } = useVerifyOTPMutation({
		onError: message => {
			setErrorMessage(message)

			// Kiểm tra nếu bị block do thử quá nhiều lần
			if (message.includes('đã thử quá') || message.includes('đợi 10 phút')) {
				setIsBlocked(true)
				setBlockTimeLeft(600) // 10 phút = 600 giây
				setCanResend(false)
				setTimeLeft(0)
			}

			// Clear OTP khi có lỗi để người dùng nhập lại
			clearOtp()
		},
		onSuccess: verifyToken => {
			setErrorMessage('')
			setIsBlocked(false)
			setBlockTimeLeft(0)
			onComplete(verifyToken, purpose, email)
		}
	})

	useEffect(() => {
		if (
			(email && purpose === EPurposeOTP.ACTIVE_ACCOUNT) ||
			(sendOTPDirectly && purpose === EPurposeOTP.RESET_PASSWORD)
		) {
			const data = {
				email,
				purpose
			}
			sendOTPMutation(data)
		}
	}, [purpose])

	// Auto focus vào input đầu tiên khi component mount
	useEffect(() => {
		const timer = setTimeout(() => {
			if (inputRefs.current[0] && !isPending && !isBlocked) {
				inputRefs.current[0].focus()
			}
		}, 100) // Delay nhỏ để đảm bảo component đã render xong

		return () => clearTimeout(timer)
	}, [])

	// Function to mask email
	const maskEmail = (email: string): string => {
		if (!email) return ''

		const [localPart, domain] = email.split('@')
		if (!localPart || !domain) return email

		let maskedLocal = ''
		if (localPart.length <= 2) {
			maskedLocal = '*'.repeat(localPart.length)
		} else if (localPart.length <= 4) {
			maskedLocal =
				localPart[0] +
				'*'.repeat(localPart.length - 2) +
				localPart[localPart.length - 1]
		} else {
			maskedLocal =
				localPart.slice(0, 2) +
				'*'.repeat(localPart.length - 4) +
				localPart.slice(-2)
		}

		return `${maskedLocal}@${domain}`
	}

	// Countdown timer for resend
	useEffect(() => {
		let interval: NodeJS.Timeout

		if (timeLeft > 0 && !canResend && !isBlocked) {
			interval = setInterval(() => {
				setTimeLeft(prev => {
					if (prev <= 1) {
						setCanResend(true)
						return 0
					}
					return prev - 1
				})
			}, 1000)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [timeLeft, canResend, isBlocked])

	// Countdown timer for block time
	useEffect(() => {
		let blockInterval: NodeJS.Timeout

		if (blockTimeLeft > 0 && isBlocked) {
			blockInterval = setInterval(() => {
				setBlockTimeLeft(prev => {
					if (prev <= 1) {
						setIsBlocked(false)
						setErrorMessage('')
						setTimeLeft(300)
						setCanResend(false)
						return 0
					}
					return prev - 1
				})
			}, 1000)
		}

		return () => {
			if (blockInterval) clearInterval(blockInterval)
		}
	}, [blockTimeLeft, isBlocked])

	const handleResend = () => {
		if (canResend && !isBlocked) {
			setTimeLeft(300) // Reset về 5 phút
			setCanResend(false)
			setErrorMessage('') // Clear error khi resend
			clearOtp()
			const data = {
				email,
				purpose
			}
			sendOTPMutation(data)
		}
	}

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, length)
	}, [length])

	useEffect(() => {
		const otpValue = otp.join('')

		if (otpValue.length === length) {
			setErrorMessage('') // Clear error trước khi verify
			setTimeout(() => {
				verifyOTPMutation({
					email,
					otp: otpValue,
					purpose
				})
			}, 100)
		}
	}, [otp, length, onComplete])

	const handleChange = (index: number, value: string) => {
		if (isPending || isBlocked) return

		const newOtp = [...otp]

		// Chỉ cho phép chữ thường và số
		if (!/^[a-z0-9]*$/i.test(value)) return

		// Chuyển về chữ thường
		const processedValue = value.toLowerCase().substring(value.length - 1)
		newOtp[index] = processedValue
		setOtp(newOtp)

		// Clear error message khi user bắt đầu nhập
		if (errorMessage && !isBlocked) {
			setErrorMessage('')
		}

		if (processedValue && index < length - 1) {
			setActiveIndex(index + 1)
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (isPending || isBlocked) {
			e.preventDefault()
			return
		}

		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			setActiveIndex(index - 1)
			inputRefs.current[index - 1]?.focus()
		}

		if (e.key === 'ArrowLeft' && index > 0) {
			setActiveIndex(index - 1)
			inputRefs.current[index - 1]?.focus()
		}

		if (e.key === 'ArrowRight' && index < length - 1) {
			setActiveIndex(index + 1)
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleFocus = (index: number) => {
		if (isPending || isBlocked) return

		setActiveIndex(index)

		const firstEmptyIndex = otp.findIndex(digit => digit === '')
		if (firstEmptyIndex !== -1 && firstEmptyIndex !== index) {
			setTimeout(() => {
				setActiveIndex(firstEmptyIndex)
				inputRefs.current[firstEmptyIndex]?.focus()
			}, 0)
		}
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		if (isPending || isBlocked) {
			e.preventDefault()
			return
		}

		e.preventDefault()
		const pastedData = e.clipboardData.getData('text')
		// Chỉ lấy chữ thường và số, chuyển về lowercase
		const pastedCode = pastedData
			.replace(/[^a-z0-9]/gi, '')
			.toLowerCase()
			.slice(0, length)

		if (pastedCode) {
			const newOtp = [...otp]
			pastedCode.split('').forEach((char, index) => {
				if (index < length) {
					newOtp[index] = char
				}
			})
			setOtp(newOtp)

			// Clear error message khi paste
			if (errorMessage && !isBlocked) {
				setErrorMessage('')
			}

			const nextIndex = Math.min(pastedCode.length, length - 1)
			setActiveIndex(nextIndex)
			inputRefs.current[nextIndex]?.focus()
		}
	}

	const clearOtp = () => {
		if (isPending || isBlocked) return

		setOtp(new Array(length).fill(''))
		setActiveIndex(0)
		inputRefs.current[0]?.focus()
	}

	return (
		<div className='bg-card border-border flex flex-col items-center space-y-5 rounded-b-lg border-b p-8 shadow-sm'>
			<div className='text-center'>
				<h2 className='text-foreground mb-2 text-2xl font-semibold'>
					Nhập mã OTP
				</h2>
				{email ? (
					<div className='space-y-1'>
						<p className='text-muted-foreground'>
							Mã OTP đã được gửi đến email:
						</p>
						<p className='text-primary bg-primary/10 inline-block rounded-md px-3 py-1 font-mono font-medium'>
							{maskEmail(email)}
						</p>
						<p className='text-muted-foreground text-sm'>
							Vui lòng kiểm tra hộp thư và nhập mã OTP gồm 6 ký tự (chữ và số)
						</p>
					</div>
				) : (
					<p className='text-muted-foreground'>
						Vui lòng nhập mã OTP gồm 6 ký tự được gửi đến email của bạn
					</p>
				)}
			</div>

			<div className='flex space-x-3'>
				{otp.map((digit, index) => (
					<input
						key={index}
						ref={el => {
							inputRefs.current[index] = el
						}}
						type='text'
						inputMode='text'
						autoComplete='one-time-code'
						value={digit}
						onChange={e => handleChange(index, e.target.value)}
						onKeyDown={e => handleKeyDown(index, e)}
						onFocus={() => handleFocus(index)}
						onPaste={handlePaste}
						disabled={isPending || isBlocked}
						className={`bg-input h-12 w-12 rounded-md border-2 text-center text-xl font-semibold transition-all duration-200 ${
							isPending || isBlocked
								? 'bg-muted text-muted-foreground cursor-not-allowed'
								: 'focus:ring-ring focus:border-primary focus:ring-2 focus:outline-none'
						} ${
							activeIndex === index && !isPending && !isBlocked
								? 'border-primary bg-card shadow-sm'
								: errorMessage
									? 'border-destructive'
									: 'border-border hover:border-border/80'
						} ${
							digit
								? errorMessage
									? 'border-destructive bg-destructive/10 text-destructive'
									: 'border-primary bg-card text-foreground'
								: 'text-muted-foreground'
						} `}
						maxLength={1}
					/>
				))}
			</div>

			{/* Error Message Display */}
			{errorMessage && (
				<div className='text-center'>
					<p
						className={`rounded-md border px-4 py-2 text-sm ${
							isBlocked
								? 'border-orange-200 bg-orange-50 text-orange-700'
								: 'text-destructive bg-destructive/10 border-destructive/20'
						}`}
					>
						{errorMessage}
					</p>
				</div>
			)}

			<div className='text-center'>
				{isBlocked ? (
					<p className='text-sm text-orange-600'>
						Tài khoản tạm thời bị khóa. Vui lòng đợi{' '}
						<span className='font-medium'>
							{Math.floor(blockTimeLeft / 60)}:
							{String(blockTimeLeft % 60).padStart(2, '0')}
						</span>
					</p>
				) : canResend ? (
					<button
						onClick={handleResend}
						disabled={isPending || isBlocked}
						className={`text-sm font-medium underline transition-colors duration-200 ${
							isPending || isBlocked
								? 'text-muted-foreground cursor-not-allowed'
								: 'text-primary hover:text-primary/80'
						}`}
					>
						Gửi lại mã OTP
					</button>
				) : (
					<p className='text-muted-foreground text-sm'>
						Gửi lại mã sau{' '}
						<span className='text-primary font-medium'>
							{Math.floor(timeLeft / 60)}:
							{String(timeLeft % 60).padStart(2, '0')}
						</span>
					</p>
				)}
			</div>

			{isPending && (
				<div className='flex items-center gap-2'>
					<Loading size='sm' />
					<span className='text-muted-foreground'>Đang xử lý...</span>
				</div>
			)}
		</div>
	)
}

export default OTPInputDialog
