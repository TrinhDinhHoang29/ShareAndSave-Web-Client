import * as z from 'zod'

export const personalInfoSchema = z.object({
	fullName: z.string().min(2, 'Họ và tên phải chứa ít nhất 2 ký tự'),
	email: z.string().email('Email không hợp lệ'),
	phone: z.string().min(10, 'Số điện thoại không hợp lệ')
})

export const itemInfoSchema = z.object({
	image: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một hình ảnh'),
	description: z.string()
})

export const appointmentSchema = z.object({
	date: z.string().min(1, 'Vui lòng chọn một ngày'),
	location: z.string().min(5, 'Vui lòng nhập địa điểm hẹn'),
	anonymous: z.boolean()
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type ItemInfo = z.infer<typeof itemInfoSchema>
export type Appointment = z.infer<typeof appointmentSchema>
