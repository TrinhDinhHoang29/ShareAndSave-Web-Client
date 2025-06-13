import * as z from 'zod'

import {
	loginSchema,
	personalInfoSchema,
	postInfoSchema,
	postTypeSchema,
	registerSchema,
	userProfileSchema
} from './schema'

//Post
export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type PostInfo = z.infer<typeof postInfoSchema>
export type PostType = z.infer<typeof postTypeSchema>

//Register
export type RegisterFormData = z.infer<typeof registerSchema>

//Login
export type LoginFormData = z.infer<typeof loginSchema>

export type UserProfileFormData = z.infer<typeof userProfileSchema>
