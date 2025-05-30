import * as z from 'zod'

import { personalInfoSchema, postInfoSchema, postTypeSchema } from './schema'

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type PostInfo = z.infer<typeof postInfoSchema>
export type PostType = z.infer<typeof postTypeSchema>
