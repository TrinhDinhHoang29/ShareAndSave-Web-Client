import * as z from 'zod'

//Post
export const personalInfoSchema = z.object({
	fullName: z.string().min(2, 'Họ và tên phải chứa ít nhất 2 ký tự'),
	email: z.string().email('Email không hợp lệ'),
	phoneNumber: z.string().min(10, 'Số điện thoại không hợp lệ')
})

export const postInfoSchema = z.object({
	images: z.array(z.string()).optional(),
	description: z.string(),
	lostDate: z.string().optional(),
	lostLocation: z.string().optional(),
	category: z.string().optional(),
	condition: z.string().optional(),
	reward: z.string().optional(),
	foundLocation: z.string().optional(),
	foundDate: z.string().optional(),
	title: z.string().min(2, 'Tiêu đề phải chứa ít nhất 2 ký tự'),
	newItems: z
		.array(
			z.object({
				id: z.string().optional(),
				quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
				categoryID: z.number().optional(),
				name: z.string().min(1, 'Tên không được để trống')
			})
		)
		.optional(),
	oldItems: z
		.array(
			z.object({
				id: z.string().optional(),
				itemID: z.number().optional(),
				quantity: z.number().min(1, 'Số lượng phải lớn hơn 0')
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
		confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu')
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Mật khẩu không khớp',
		path: ['confirmPassword']
	})

//Login
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email hoặc số điện thoại là bắt buộc')
		.refine(value => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			const phoneRegex = /^(0|\+84)[3-9]\d{8}$/
			return emailRegex.test(value) || phoneRegex.test(value)
		}, 'Vui lòng nhập email hoặc số điện thoại hợp lệ'),
	password: z
		.string()
		.min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
		.max(50, 'Mật khẩu không được quá 50 ký tự')
})
