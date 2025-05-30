import { Upload } from 'lucide-react'
import React, { useState } from 'react'
import { createPortal } from 'react-dom' // Import createPortal
import { FieldError, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface ImageUploadProps {
	name: string
	label: string
	watch: UseFormWatch<any>
	setValue: UseFormSetValue<any>
	error?: FieldError
	maxImages?: number
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	name,
	label,
	watch,
	setValue,
	error,
	maxImages = 4
}) => {
	const images: string[] = watch(name) || []
	const [selectedImage, setSelectedImage] = useState<string | null>(null) // State để theo dõi ảnh được chọn

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		const newImages = files.map(file => {
			const reader = new FileReader()
			return new Promise<string>(resolve => {
				reader.onloadend = () => resolve(reader.result as string)
				reader.readAsDataURL(file)
			})
		})

		Promise.all(newImages).then(imageUrls => {
			const currentImages = watch(name) || []
			setValue(name, [...currentImages, ...imageUrls].slice(0, maxImages))
		})
	}

	// Component Overlay tách biệt để sử dụng Portal
	const ImageOverlay = ({
		image,
		onClose
	}: {
		image: string
		onClose: () => void
	}) => {
		return createPortal(
			<div
				className='bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black/50'
				onClick={e => {
					if (e.target === e.currentTarget) onClose() // Đóng khi click ra ngoài
				}}
			>
				<div className='max-h-4xl relative flex max-w-4xl items-center justify-center p-4'>
					<img
						src={image}
						alt='Selected view'
						className='max-h-full max-w-full rounded-lg bg-white object-contain shadow-2xl'
					/>
				</div>
				<button
					onClick={onClose} // Đóng khi click nút ✕
					className='absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white hover:bg-red-600'
				>
					✕
				</button>
			</div>,
			document.body // Đặt overlay trực tiếp vào body
		)
	}

	return (
		<div>
			<label className='text-foreground mb-2 block text-sm font-medium'>
				{label}
			</label>
			<div className='border-border bg-card hover:bg-muted/20 rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-200'>
				{!images.length ? (
					<>
						<Upload className='text-muted-foreground mx-auto mb-3 h-10 w-10' />
						<input
							type='file'
							accept='image/*'
							multiple
							onChange={handleImageUpload}
							className='hidden'
							id='image-upload'
						/>
						<label
							htmlFor='image-upload'
							className='cursor-pointer'
						>
							<span className='text-primary hover:text-primary/80 font-medium'>
								Tải lên hình ảnh
							</span>
							<br />
							<span className='text-muted-foreground text-sm'>
								Hoặc kéo thả vào đây
							</span>
						</label>
					</>
				) : (
					<div>
						<div className='mb-4 grid grid-cols-2 gap-4'>
							{images.map((image, index) => (
								<div
									key={index}
									className='group relative'
								>
									<img
										src={image}
										alt={`Preview ${index}`}
										className='h-48 w-full cursor-pointer rounded-lg border object-cover'
										onClick={() => setSelectedImage(image)} // Kích hoạt overlay khi click
									/>
									<button
										type='button'
										onClick={() => {
											const newImages = images.filter((_, i) => i !== index)
											setValue(name, newImages)
											if (selectedImage === image) setSelectedImage(null) // Đóng nếu ảnh bị xóa
										}}
										className='bg-destructive hover:bg-destructive/80 absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'
									>
										✕
									</button>
									<p className='text-chart-1 mt-1 text-center text-xs'>
										✓ Hình ảnh đã được tải lên
									</p>
								</div>
							))}
						</div>
						{images.length < maxImages && (
							<div>
								<input
									type='file'
									accept='image/*'
									multiple
									onChange={handleImageUpload}
									className='hidden'
									id='image-upload-more'
								/>
								<label
									htmlFor='image-upload-more'
									className='text-primary hover:text-primary/80 cursor-pointer font-medium'
								>
									Tải thêm hình ảnh ({images.length}/{maxImages})
								</label>
							</div>
						)}
					</div>
				)}
			</div>
			{error && (
				<p className='text-destructive mt-1 text-sm'>{error.message}</p>
			)}

			{/* Sử dụng Portal để hiển thị overlay toàn màn hình */}
			{selectedImage && (
				<ImageOverlay
					image={selectedImage}
					onClose={() => setSelectedImage(null)}
				/>
			)}
		</div>
	)
}

export default ImageUpload
