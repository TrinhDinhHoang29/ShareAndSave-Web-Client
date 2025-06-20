import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FieldError } from 'react-hook-form'

interface ImageUploadProps {
	name: string
	label: string
	field: {
		value: string | string[] | undefined
		onChange: (value: string | string[] | undefined) => void
		onBlur: () => void
	}
	error?: FieldError
	maxImages?: number
	type?: 'single' | 'multiple'
	animationDelay?: number
}

const ImageUpload = ({
	name,
	label,
	field,
	error,
	maxImages = 4,
	type = 'multiple',
	animationDelay = 0.2
}: ImageUploadProps) => {
	const isSingle = type === 'single'
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
		return () => setIsMounted(false)
	}, [])

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) {
			console.warn('No files selected')
			return
		}

		const validFiles = Array.from(files).filter(file => {
			const isWebp =
				file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')
			if (isWebp) {
				console.warn(`File ${file.name} is .webp and will be skipped`)
				return false
			}
			return true
		})

		if (validFiles.length === 0) {
			console.warn('All selected files are .webp and were skipped')
			return
		}

		if (isSingle && validFiles[0]) {
			const reader = new FileReader()
			reader.onloadend = () => {
				const result = reader.result as string
				field.onChange(result)
				console.log('Uploaded single image:', result.substring(0, 50) + '...')
			}
			reader.onerror = () => console.error('Error reading file')
			reader.readAsDataURL(validFiles[0])
		} else if (!isSingle) {
			const newImages = validFiles.map(file => {
				const reader = new FileReader()
				return new Promise<string>((resolve, reject) => {
					reader.onloadend = () => resolve(reader.result as string)
					reader.onerror = reject
					reader.readAsDataURL(file)
				})
			})

			Promise.all(newImages)
				.then(imageUrls => {
					const currentImages: string[] = Array.isArray(field.value)
						? (field.value as string[])
						: []
					field.onChange([...currentImages, ...imageUrls].slice(0, maxImages))
					console.log('Uploaded multiple images:', imageUrls.length)
				})
				.catch(err => console.error('Error processing images:', err))
		}

		e.target.value = ''
	}

	const ImageOverlay = ({
		image,
		onClose
	}: {
		image: string
		onClose: () => void
	}) => {
		if (!isMounted) return null
		return createPortal(
			<div
				className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
				onClick={e => {
					if (e.target === e.currentTarget) onClose()
				}}
			>
				<div className='relative flex max-w-4xl items-center p-4'>
					<img
						src={image}
						alt='Preview'
						className='max-h-[500px] max-w-full rounded-lg bg-white object-contain shadow-2xl'
					/>
				</div>
				<button
					onClick={onClose}
					className='absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white hover:bg-red-600'
				>
					✕
				</button>
			</div>,
			document.body
		)
	}

	const renderUploadArea = () => (
		<>
			<Upload className='text-muted-foreground mx-auto mb-3 h-10 w-10' />
			<input
				type='file'
				accept='image/jpeg,image/jpg,image/png,image/gif' // Loại trừ .webp
				multiple={!isSingle}
				onChange={handleImageUpload}
				className='hidden'
				id={`image-upload-${name}`}
			/>
			<label
				htmlFor={`image-upload-${name}`}
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
	)

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: animationDelay, duration: 0.3 }}
		>
			<label className='text-foreground mb-2 block text-sm font-medium'>
				{label}
			</label>
			<div className='border-border bg-card hover:bg-muted/20 rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-200'>
				{isSingle ? (
					!field.value ? (
						renderUploadArea()
					) : (
						<div>
							<div className='group relative'>
								<img
									src={
										typeof field.value === 'string' ? field.value : undefined
									}
									alt='Preview'
									className='h-48 w-full cursor-pointer rounded-lg border object-cover'
									onClick={() =>
										setSelectedImage(
											typeof field.value === 'string' ? field.value : null
										)
									}
								/>
								<button
									type='button'
									onClick={() => {
										field.onChange(undefined)
										setSelectedImage(null)
										console.log('Image removed')
									}}
									className='bg-destructive hover:bg-destructive/80 absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'
								>
									✕
								</button>
								<p className='text-success mt-1 text-center text-xs'>
									✓ Hình ảnh đã được tải lên
								</p>
							</div>
						</div>
					)
				) : !field.value?.length ? (
					renderUploadArea()
				) : (
					<div>
						<div className='mb-4 grid grid-cols-2 gap-4'>
							{(field.value as string[]).map((image, index) => (
								<div
									key={index}
									className='group relative'
								>
									<img
										src={image}
										alt={`Preview ${index}`}
										className='h-48 w-full cursor-pointer rounded-lg border object-cover'
										onClick={() => setSelectedImage(image)}
									/>
									<button
										type='button'
										onClick={() => {
											const newImages = (field.value as string[]).filter(
												(_, i) => i !== index
											)
											field.onChange(newImages.length ? newImages : undefined)
											if (selectedImage === image) setSelectedImage(null)
											console.log('Removed image at index:', index)
										}}
										className='bg-destructive hover:bg-destructive/80 absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'
									>
										✕
									</button>
									<p className='text-success mt-1 text-center text-xs'>
										✓ Hình ảnh đã được tải lên
									</p>
								</div>
							))}
						</div>
						{field.value.length < maxImages && (
							<div>
								<input
									type='file'
									accept='image/jpeg,image/jpg,image/png,image/gif'
									multiple
									onChange={handleImageUpload}
									className='hidden'
									id={`image-upload-more-${name}`}
								/>
								<label
									htmlFor={`image-upload-more-${name}`}
									className='text-primary hover:text-primary/80 cursor-pointer font-medium'
								>
									Tải thêm hình ảnh ({field.value.length}/{maxImages})
								</label>
							</div>
						)}
					</div>
				)}
			</div>
			{error && (
				<p className='text-destructive mt-1 text-sm'>{error.message}</p>
			)}
			{selectedImage && (
				<ImageOverlay
					image={selectedImage}
					onClose={() => setSelectedImage(null)}
				/>
			)}
		</motion.div>
	)
}

export default ImageUpload
