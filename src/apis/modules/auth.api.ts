import {
	IApiResponse,
	ILoginRequest,
	ILoginResponse,
	IUser
} from '@/models/interfaces'

import axiosPrivate from '../client/private.client'
import axiosPublic from '../client/public.client'

const authEndpoints = {
	login: 'client/login',
	logout: 'client/logout',
	refreshToken: 'refresh-token',
	getMe: 'client/get-me',
	update: 'clients'
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
	}
	//   async list(params: {
	//     page?: number;
	//     limit?: number;
	//     filters?: FilterSearch[];
	//     sort?: keyof Irequest | "";
	//     order?: ESortOrderValue;
	//   }): Promise<IApiResponse<Irequest[]>> {
	//     return axiosPrivate.get(requestEndpoints.common, {
	//       params: { ...params, filters: JSON.stringify(params.filters) },
	//     });
	//   },
	//   async add(data: { ten: string }): Promise<IApiResponse> {
	//     // eslint-disable-next-line no-useless-catch
	//     try {
	//       return await axiosPrivate.auth(requestEndpoints.common, data);
	//     } catch (error) {
	//       throw error;
	//     }
	//   },
	//   async delete(id: number | string): Promise<IApiResponse> {
	//     // eslint-disable-next-line no-useless-catch
	//     try {
	//       return await axiosPrivate.delete(requestEndpoints.common + "/" + id);
	//     } catch (error) {
	//       throw error;
	//     }
	//   },
	//   async edit(data: {
	//     id: string | number;
	//     ten: string;
	//   }): Promise<IApiResponse> {
	//     // eslint-disable-next-line no-useless-catch
	//     try {
	//       return await axiosPrivate.put(requestEndpoints.common, data);
	//     } catch (error) {
	//       throw error;
	//     }
	//   },
}

export default authApi
