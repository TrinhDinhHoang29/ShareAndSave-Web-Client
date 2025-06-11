import {
	IApiResponse,
	IDetailTransactionParams,
	ITransaction,
	ITransactionRequest
} from '@/models/interfaces'

import axiosPrivate from '../client/private.client'

const transactionEndpoints = {
	common: 'transactions'
}

const transactionApi = {
	// async list(
	// 	params: IListTypeParams<EtransactionType>
	// ): Promise<IApiResponse<IPosttransactionResponse>> {
	// 	return axiosPrivate.get(transactionEndpoints.common, {
	// 		params
	// 	})
	// },
	async create(
		data: ITransactionRequest
	): Promise<IApiResponse<{ transition: ITransaction }>> {
		return axiosPrivate.post(transactionEndpoints.common, data)
	},
	async delete(
		postID: number
	): Promise<IApiResponse<{ transactionID: number }>> {
		return axiosPrivate.delete(transactionEndpoints.common + '/' + postID)
	},
	async detail(
		params: IDetailTransactionParams
	): Promise<IApiResponse<{ transactions: ITransaction[] }>> {
		return axiosPrivate.get(transactionEndpoints.common, {
			params
		})
	}
}

export default transactionApi
