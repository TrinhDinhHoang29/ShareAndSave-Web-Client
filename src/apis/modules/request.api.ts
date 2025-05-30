import { ERequestStatus, ERequestType } from '@/models/enums'
import {
	IApiResponse,
	IRequest,
	IRequestResponse,
	IRequestSendItemRequest
} from '@/models/interfaces'

import axiosPublic from '../client/public.client'

const requestEndpoints = {
	sendOldItemL: 'requests' + '/' + 'send-old-item'
}

const requestApi = {
	async listRequests(
		page: number,
		itemsPerPage: number,
		type?: ERequestType,
		status?: ERequestStatus
	): Promise<IApiResponse<IRequestResponse>> {
		// Mock API response
		const mockRequests: IRequest[] = [
			{
				id: 1,
				type: ERequestType.SEND_LOSE,
				item: 'Ví tiền',
				status: ERequestStatus.PENDING,
				date: '15/03/2024',
				location: 'Thư viện',
				description: 'Ví da màu đen, chứa CMND và thẻ ngân hàng.',
				imageUrl: 'https://via.placeholder.com/80'
			},
			{
				id: 2,
				type: ERequestType.SEND_LOSE,
				item: 'Chìa khóa',
				status: ERequestStatus.APPROVE,
				date: '10/03/2024',
				location: 'Căn tin',
				description: 'Chìa khóa xe máy Honda.',
				imageUrl: 'https://via.placeholder.com/80'
			},
			{
				id: 3,
				type: ERequestType.SEND_LOSE,
				item: 'Điện thoại',
				status: ERequestStatus.REJECT,
				date: '05/03/2024',
				location: 'Phòng học A1',
				description: 'iPhone 8, màu trắng, hơi xước.',
				imageUrl: 'https://via.placeholder.com/80'
			},
			{
				id: 4,
				type: ERequestType.SEND_LOSE,
				item: 'Túi xách',
				status: ERequestStatus.PENDING,
				date: '12/03/2024',
				location: 'Sân trường',
				description: 'Túi xách vải màu xanh, chứa sổ tay và bút.',
				imageUrl: 'https://via.placeholder.com/80'
			},
			{
				id: 5,
				type: ERequestType.SEND_OLD,
				item: 'Sách giáo khoa',
				status: ERequestStatus.APPROVE,
				date: '08/03/2024',
				location: 'Lớp học B2',
				description: 'Sách Toán 12, còn mới 90%.',
				imageUrl: 'https://via.placeholder.com/80'
			},
			{
				id: 6,
				type: ERequestType.SEND_OLD,
				item: 'Laptop cũ',
				status: ERequestStatus.REJECT,
				date: '03/03/2024',
				location: 'Phòng máy tính',
				description: 'Laptop Dell, cần sửa ổ cứng.',
				imageUrl: 'https://via.placeholder.com/80'
			},
			{
				id: 7,
				type: ERequestType.SEND_LOSE,
				item: 'Đồng hồ',
				status: ERequestStatus.PENDING,
				date: '16/03/2024',
				location: 'Sân thể thao',
				description: 'Đồng hồ đeo tay Casio, mặt kính trầy nhẹ.',
				imageUrl: 'https://via.placeholder.com/80'
			}
		]

		const filtered: IRequest[] = mockRequests.filter(request => {
			const matchesType =
				!type || (type as unknown) === ERequestType.ALL || request.type === type
			const matchesStatus =
				!status ||
				(status as any) === ERequestStatus.ALL ||
				request.status === status
			return matchesType && matchesStatus
		})

		const startIndex = (page - 1) * itemsPerPage
		const paginatedData: IRequest[] = filtered.slice(
			startIndex,
			startIndex + itemsPerPage
		)
		const totalPages = Math.ceil(filtered.length / itemsPerPage)

		return {
			code: 200,
			message: 'Success',
			data: { data: paginatedData, totalPages }
		}

		// Actual API call (uncomment when backend is ready)
		// const response = await axiosPublic.get<IApiResponse<RequestResponse>>('/requests', {
		//   params: {
		//     page,
		//     limit: itemsPerPage,
		//     type: type !== ERequestType.ALL ? type : undefined,
		//     status: status !== ERequestStatus.ALL ? status : undefined,
		//   },
		// });
		// return response.data;
	},

	async getERequestStatus(
		requestId: string
	): Promise<IApiResponse<{ status: ERequestStatus }>> {
		// Mock implementation
		return {
			code: 200,
			message: 'Success',
			data: { status: ERequestStatus.PENDING }
		}
	},
	async sendOldItem(
		data: IRequestSendItemRequest,
		signal?: AbortSignal
	): Promise<IApiResponse<IRequestSendItemRequest>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.post(requestEndpoints.sendOldItemL, data, {
				signal
			})
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
	//       return await axiosPrivate.post(requestEndpoints.common, data);
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

export default requestApi
