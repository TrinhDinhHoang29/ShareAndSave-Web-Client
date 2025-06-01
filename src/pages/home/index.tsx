import PrimaryButton from '@/components/common/PrimaryButton'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { formatDateToISO } from '@/lib/utils'

const Home = () => {
	const { showLoading, showSuccess, showError, close } = useAlertModalContext()
	const handleClick = async () => {
		try {
			showLoading({
				loadingMessage: 'Đang cập nhật hồ sơ...',
				showCancel: true,
				onCancel: () => {
					console.log('Update cancelled')
					close()
				}
			})

			// Simulate API call
			await new Promise((resolve, reject) =>
				setTimeout(
					() => reject(new Error('Không thể kết nối đến máy chủ')),
					2000
				)
			)

			// Format current timestamp (09:16 PM +07, May 28, 2025)
			const updatedAt = formatDateToISO('2025-05-28T21:16') // Converts to 2025-05-28T14:16:00Z
			console.log('Profile updated at:', updatedAt)

			showSuccess({
				successTitle: 'Cập nhật thành công!',
				successMessage: `Hồ sơ của bạn đã được cập nhật vào ${updatedAt}.`,
				successButtonText: 'Quay lại hồ sơ'
			})
		} catch (error) {
			showError({
				errorTitle: 'Lỗi cập nhật',
				errorMessage: `Không thể cập nhật hồ sơ: ${(error as Error).message}`,
				errorButtonText: 'Thử lại'
			})
		}
	}

	return (
		<>
			<PrimaryButton onClick={handleClick}>CLick here</PrimaryButton>
		</>
	)
}

export default Home
