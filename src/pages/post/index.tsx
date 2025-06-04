import React from 'react'

import { useAlertModalContext } from '@/context/alert-modal-context'

const PostPage: React.FC = () => {
	const { showSuccess } = useAlertModalContext()

	return (
		<button
			onClick={async () =>
				await showSuccess({
					successTitle: 'Thông tin hỗ trợ',
					successMessage: 'Bạn phải "Quan Tâm" mới được thực hiện "Trò chuyện"',
					successButtonText: 'Đã rõ'
				})
			}
		>
			Click
		</button>
	)
}

export default PostPage
