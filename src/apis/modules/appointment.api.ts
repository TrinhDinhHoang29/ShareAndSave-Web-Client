import {
	IApiResponse,
	IAppointmentRequest,
	IAppointmentResponse
} from '@/models/interfaces'

import axiosPrivate from '../client/private.client'

const appointmentEndpoints = {
	list: 'client/appointments',
	common: 'appointments'
}

const appointmentApi = {
	async update(
		appointmentID: number,
		data: IAppointmentRequest,
		signal?: AbortSignal
	): Promise<IApiResponse<string>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.patch(
				appointmentEndpoints.common + '/' + appointmentID,
				data,
				{
					signal
				}
			)
		} catch (error) {
			throw error
		}
	},
	async list(params: {}): Promise<IApiResponse<IAppointmentResponse>> {
		return axiosPrivate.get(appointmentEndpoints.list, {
			params
		})
	}
}

export default appointmentApi
