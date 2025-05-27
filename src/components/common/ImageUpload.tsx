import { Upload } from 'lucide-react'
import { FieldError, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface ImageUploadProps {
	name: string
	label: string
	watch: UseFormWatch<any>
	setValue: UseFormSetValue<any>
	handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
	error?: FieldError
	maxImages?: number
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	name,
	label,
	watch,
	setValue,
	handleImageUpload,
	error,
	maxImages = 5
}) => {
	const images: string[] = watch(name) || []

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
						<div className='mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3'>
							{images.map((image, index) => (
								<div
									key={index}
									className='relative'
								>
									<img
										src={image}
										alt={`Preview ${index}`}
										className='max-h-40 w-full max-w-40 rounded-lg border object-cover'
									/>
									<button
										type='button'
										onClick={() => {
											const newImages = images.filter((_, i) => i !== index)
											setValue(name, newImages)
										}}
										className='bg-destructive hover:bg-destructive/80 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors duration-200'
									>
										✕
									</button>
									<p className='text-chart-1 mt-2 text-center text-sm'>
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
		</div>
	)
}

export default ImageUpload
