import * as z from 'zod'

export const personalInfoSchema = z.object({
	fullName: z.string().min(2, 'Họ và tên phải chứa ít nhất 2 ký tự'),
	email: z.string().email('Email không hợp lệ'),
	phoneNumber: z.string().min(10, 'Số điện thoại không hợp lệ')
})

export const postInfoSchema = z.object({
	images: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một hình ảnh'),
	description: z.string(),
	lostDate: z.string().optional(),
	lostLocation: z.string().optional(),
	category: z.string().optional(),
	condition: z.string().optional(),
	reward: z.string().optional(),
	foundLocation: z.string().optional(),
	foundDate: z.string().optional(),
	title: z.string().min(2, 'Tiêu đề phải chứa ít nhất 2 ký tự')
})

export const postTypeSchema = z.object({
	type: z.string()
})
