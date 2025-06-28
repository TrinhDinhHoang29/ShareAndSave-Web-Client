import { EPurposeOTP } from '@/models/enums'
import {
	IApiResponse,
	ILoginRequest,
	ILoginResponse,
	IUser
} from '@/models/interfaces'
import { RegisterFormData, ResetPasswordFormData } from '@/models/types'

import axiosPrivate from '../client/private.client'
import axiosPublic from '../client/public.client'

const authEndpoints = {
	login: 'client/login',
	logout: 'client/logout',
	refreshToken: 'refresh-token',
	getMe: 'client/get-me',
	update: 'clients',
	register: 'client/signup',
	sendOTP: 'client/send-otp',
	verifyOTP: 'client/verify-otp',
	verifySignup: 'client/verify-signup',
	resetPassword: 'client/reset-password'
}

const authApi = {
	async login(data: ILoginRequest): Promise<IApiResponse<ILoginResponse>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.post(authEndpoints.login, data)
		} catch (error) {
			throw error
		}
	},
	async register(data: RegisterFormData): Promise<IApiResponse<string>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.post(authEndpoints.register, data)
		} catch (error) {
			throw error
		}
	},
	async logout(): Promise<IApiResponse<ILoginResponse>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.post(authEndpoints.logout)
		} catch (error) {
			throw error
		}
	},
	async refreshToken(data: {
		refreshToken: string
	}): Promise<IApiResponse<{ jwt: string }>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.post(authEndpoints.refreshToken, data)
		} catch (error) {
			throw error
		}
	},
	async getMe(): Promise<IApiResponse<{ user: IUser }>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.get(authEndpoints.getMe)
		} catch (error) {
			throw error
		}
	},
	async update(
		clientID: number,
		data: IUser,
		signal?: AbortSignal
	): Promise<IApiResponse<{ client: IUser }>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.patch(
				authEndpoints.update + '/' + clientID,
				data,
				{
					signal
				}
			)
		} catch (error) {
			throw error
		}
	},
	async sendOTP(data: {
		email: string
		purpose: EPurposeOTP
	}): Promise<IApiResponse<string>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.post(authEndpoints.sendOTP, data)
		} catch (error) {
			throw error
		}
	},
	async verifyOTP(data: {
		email: string
		otp: string
		purpose: EPurposeOTP
	}): Promise<IApiResponse<{ verifyToken: string }>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.post(authEndpoints.verifyOTP, data)
		} catch (error) {
			throw error
		}
	},
	async verifySignup(data: RegisterFormData): Promise<IApiResponse<{}>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.post(authEndpoints.verifySignup, data)
		} catch (error) {
			throw error
		}
	},
	async resetPassword(data: ResetPasswordFormData): Promise<IApiResponse<{}>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.post(authEndpoints.resetPassword, data)
		} catch (error) {
			throw error
		}
	}
}

export default authApi
