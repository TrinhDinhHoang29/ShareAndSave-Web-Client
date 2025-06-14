import { ESortOrder } from '@/models/enums'
import {
	IApiResponse,
	ITransaction,
	ITransactionParams,
	ITransactionRequest,
	ITransactionResponse
} from '@/models/interfaces'

import axiosPrivate from '../client/private.client'

const transactionEndpoints = {
	common: 'transactions'
}

const transactionApi = {
	async create(
		data: ITransactionRequest,
		signal?: AbortSignal
	): Promise<IApiResponse<{ transaction: ITransaction }>> {
		return axiosPrivate.post(transactionEndpoints.common, data, {
			signal
		})
	},
	async delete(
		postID: number
	): Promise<IApiResponse<{ transactionID: number }>> {
		return axiosPrivate.delete(transactionEndpoints.common + '/' + postID)
	},
	async list(
		params: ITransactionParams
	): Promise<IApiResponse<ITransactionResponse>> {
		return axiosPrivate.get(transactionEndpoints.common, {
			params
		})
	},
	async update(
		transactionID: number,
		data: ITransactionRequest,
		signal?: AbortSignal
	): Promise<IApiResponse<{ transaction: ITransaction }>> {
		return axiosPrivate.patch(
			transactionEndpoints.common + '/' + transactionID,
			data,
			{
				signal
			}
		)
	}
}

export default transactionApi
