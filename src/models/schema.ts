import * as z from 'zod'

//Post
export const personalInfoSchema = z.object({
	fullName: z.string().min(2, 'Họ và tên phải chứa ít nhất 2 ký tự'),
	email: z.string().email('Email không hợp lệ'),
	phoneNumber: z
		.string()
		.min(1, 'Số điện thoại là bắt buộc')
		.regex(/^(0|\+84)[3-9]\d{8}$/, 'Số điện thoại không đúng định dạng')
})

export const postInfoSchema = z.object({
	images: z
		.array(z.string())
		.min(1, 'Vui lòng chọn ít nhất 1 ảnh')
		.refine(val => val && val.length > 0, 'Vui lòng chọn ít nhất 1 ảnh'),
	description: z.string(),
	lostDate: z.string().optional(),
	lostLocation: z.string().optional(),
	category: z.string().optional(),
	condition: z.string().optional(),
	reward: z.string().optional(),
	foundLocation: z.string().optional(),
	foundDate: z.string().optional(),
	title: z
		.string()
		.min(2, 'Tiêu đề phải chứa ít nhất 2 ký tự')
		.transform(val => val.trim()) // Loại bỏ khoảng trắng ở đầu và cuối
		.refine(val => val.length >= 2, {
			message: 'Tiêu đề phải chứa ít nhất 2 ký tự'
		}),
	newItems: z
		.array(
			z.object({
				itemID: z.number(),
				quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
				categoryID: z.number(),
				name: z.string().min(1, 'Tên không được để trống'),
				categoryName: z.string(),
				image: z
					.string()
					.refine(
						val => {
							if (!val) return true
							const isWebp = val.includes('image/webp') || val.endsWith('.webp')
							return !isWebp
						},
						{
							message: 'Không chấp nhận ảnh định dạng .webp'
						}
					)
					.optional(),
				alternativeImage: z.string().optional()
			})
		)
		.optional(),
	oldItems: z
		.array(
			z.object({
				itemID: z.number(),
				quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
				categoryName: z.string(),
				categoryID: z.number(),
				name: z.string().min(1, 'Tên không được để trống'),
				image: z
					.string()
					.refine(
						val => {
							if (!val) return true
							const isWebp = val.includes('image/webp') || val.endsWith('.webp')
							return !isWebp
						},
						{
							message: 'Không chấp nhận ảnh định dạng .webp'
						}
					)
					.optional(),
				alternativeImage: z.string().optional()
			})
		)
		.optional()
})

export const postTypeSchema = z.object({
	type: z.string()
})

// Register
export const registerSchema = z
	.object({
		fullName: z
			.string()
			.min(2, 'Họ tên phải có ít nhất 2 ký tự')
			.max(50, 'Họ tên không được quá 50 ký tự')
			.regex(
				/^[a-zA-ZÀ-ỹ\s]+$/,
				'Họ tên chỉ được chứa chữ cái và khoảng trắng'
			),
		phoneNumber: z
			.string()
			.min(1, 'Số điện thoại là bắt buộc')
			.regex(/^(0|\+84)[3-9]\d{8}$/, 'Số điện thoại không đúng định dạng'),
		email: z
			.string()
			.min(1, 'Email là bắt buộc')
			.email('Email không đúng định dạng'),
		password: z
			.string()
			.min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
			.max(50, 'Mật khẩu không được quá 50 ký tự')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
			),
		rePassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
		verifyToken: z.string().optional()
	})
	.refine(data => data.password === data.rePassword, {
		message: 'Mật khẩu không khớp',
		path: ['rePassword']
	})

export const resetPasswordSchema = z
	.object({
		email: z
			.string()
			.min(1, 'Email là bắt buộc')
			.email('Email không đúng định dạng')
			.optional(),
		currentPassword: z
			.string()
			.min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
			.max(50, 'Mật khẩu không được quá 50 ký tự')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
			)
			.optional(),
		password: z
			.string()
			.min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
			.max(50, 'Mật khẩu không được quá 50 ký tự')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
			),
		rePassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
		verifyToken: z.string().optional()
	})
	.refine(data => data.password === data.rePassword, {
		message: 'Mật khẩu không khớp',
		path: ['rePassword']
	})

export const verifyEmailSchema = z.object({
	email: z
		.string()
		.min(1, 'Email là bắt buộc')
		.email('Email không đúng định dạng')
})

//Login
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email là bắt buộc')
		.refine(value => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			const phoneRegex = /^(0|\+84)[3-9]\d{8}$/
			return emailRegex.test(value) || phoneRegex.test(value)
		}, 'Vui lòng nhập email hợp lệ'),
	password: z
		.string()
		.min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
		.max(50, 'Mật khẩu không được quá 50 ký tự')
})

export const userProfileSchema = z.object({
	fullName: z
		.string()
		.min(1, 'Họ và tên không được để trống')
		.min(2, 'Họ và tên phải có ít nhất 2 ký tự')
		.max(50, 'Họ và tên không được quá 50 ký tự'),
	majorID: z.number().min(1, 'Vui lòng chọn chuyên ngành'), // Đảm bảo majorID phải >= 1
	phoneNumber: z
		.string()
		.min(1, 'Số điện thoại không được để trống')
		.regex(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
	address: z
		.string()
		.min(1, 'Địa chỉ không được để trống')
		.min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
		.max(200, 'Địa chỉ không được quá 200 ký tự'),
	avatar: z
		.string()
		.optional()
		.refine(
			val => {
				if (!val) return true
				const isWebp = val.includes('image/webp') || val.endsWith('.webp')
				return !isWebp
			},
			{
				message: 'Không chấp nhận ảnh định dạng .webp'
			}
		),
	status: z.number(),
	goodPoint: z.number()
})
