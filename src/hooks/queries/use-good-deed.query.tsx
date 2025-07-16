import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Gift, Heart, Users } from 'lucide-react'
import { ReactNode } from 'react'

import goodDeedApi from '@/apis/modules/good-deed.api'
import { EGoodDeedType, EGoodPOINTTYPE } from '@/models/enums'
import { IDetailGoodDeed, IUserRankResponse } from '@/models/interfaces'

export const useUserRanksQuery = (
	userId: number,
	params: {
		limit?: number
		page?: number
	}
) => {
	return useInfiniteQuery<IUserRankResponse, Error>({
		queryKey: ['ranks', params, userId],
		queryFn: async ({ pageParam = 1 }) => {
			const queryParams = { ...params, page: Number(pageParam) }
			const res = await goodDeedApi.ranks(queryParams)
			if (!res.data || !res.data.userRanks) {
				throw new Error('Dữ liệu giao dịch không hợp lệ')
			}
			return res.data
		},
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length
			const totalPages = lastPage.totalPage || 0

			// If current page is less than total pages, return next page number
			if (currentPage < totalPages) {
				return currentPage + 1
			}

			// No more pages
			return undefined
		},
		enabled: !!userId,
		initialPageParam: 1,
		staleTime: 5 * 60 * 1000 // Dữ liệu tươi trong 5 phút
	})
}

export const useMyGoodDeedsQuery = (userId: number) => {
	return useQuery<IDetailGoodDeed[], Error>({
		queryKey: ['my-good-deeds', userId], // Bao gồm params trong queryKey
		queryFn: async () => {
			const response = await goodDeedApi.myGoodDeeds()
			// Nếu không có dữ liệu hoặc items không tồn tại, trả về mảng rỗng
			return response?.data?.goodDeeds || []
		},
		staleTime: 5 * 60 * 1000, // Dữ liệu được coi là "mới" trong 5 phút
		enabled: !!userId
	})
}

interface IGoodDeedUIConfig {
	icon: ReactNode
	action: string
	points: string
	description: string
	color: string
	type: EGoodDeedType
}

// Mapping từ string type sang enum type và UI config
const getGoodDeedUIConfig = (
	stringType: EGoodPOINTTYPE,
	points: string
): IGoodDeedUIConfig => {
	switch (stringType) {
		case EGoodPOINTTYPE.GOOD_POINT_GIVE_OLD_ITEM:
			return {
				icon: <Gift className='text-primary h-5 w-5' />,
				action: 'Tặng đồ cũ',
				points: points,
				description: 'Chia sẻ những món đồ không còn sử dụng',
				color: 'glass border-primary/20 hover:border-primary/40',
				type: EGoodDeedType.GOOD_DEED_TYPE_GIVE_OLD_ITEM
			}
		case EGoodPOINTTYPE.GOOD_POINT_GIVE_LOSE_ITEM:
			return {
				icon: <Heart className='text-accent h-5 w-5' />,
				action: 'Trả đồ thất lạc',
				points: points,
				description: 'Giúp người khác tìm lại đồ vật thất lạc',
				color: 'glass border-accent/20 hover:border-accent/40',
				type: EGoodDeedType.GOOD_DEED_TYPE_GIVE_LOSE_ITEM
			}
		case EGoodPOINTTYPE.GOOD_POINT_JOIN_CAMPAIGN:
			return {
				icon: <Users className='text-success h-5 w-5' />,
				action: 'Tham gia chiến dịch',
				points: points,
				description: 'Tham gia các hoạt động thiện nguyện tập thể',
				color: 'glass border-success/20 hover:border-success/40',
				type: EGoodDeedType.GOOD_DEED_TYPE_CAMPAGIN
			}
		default:
			return {
				icon: <Heart className='text-accent h-5 w-5' />,
				action: 'Hoạt động tốt',
				points: points,
				description: 'Hoạt động thiện nguyện',
				color: 'glass border-accent/20 hover:border-accent/40',
				type: EGoodDeedType.GOOD_DEED_TYPE_GIVE_OLD_ITEM
			}
	}
}

export const useGoodDeedSettingsQuery = () => {
	return useQuery<IGoodDeedUIConfig[], Error>({
		queryKey: ['good-deed-settings'],
		queryFn: async () => {
			// Gọi cả 3 API cùng lúc
			const [oldItemResponse, loseItemResponse, campaignResponse] =
				await Promise.all([
					goodDeedApi.getSettings(EGoodPOINTTYPE.GOOD_POINT_GIVE_OLD_ITEM),
					goodDeedApi.getSettings(EGoodPOINTTYPE.GOOD_POINT_GIVE_LOSE_ITEM),
					goodDeedApi.getSettings(EGoodPOINTTYPE.GOOD_POINT_JOIN_CAMPAIGN)
				])

			// Chuyển đổi response thành UI config objects
			const configs: IGoodDeedUIConfig[] = []

			if (oldItemResponse?.data?.setting) {
				configs.push(
					getGoodDeedUIConfig(
						EGoodPOINTTYPE.GOOD_POINT_GIVE_OLD_ITEM,
						oldItemResponse.data.setting.value || '100'
					)
				)
			}

			if (loseItemResponse?.data?.setting) {
				configs.push(
					getGoodDeedUIConfig(
						EGoodPOINTTYPE.GOOD_POINT_GIVE_LOSE_ITEM,
						loseItemResponse.data.setting.value || '200'
					)
				)
			}

			if (campaignResponse?.data?.setting) {
				configs.push(
					getGoodDeedUIConfig(
						EGoodPOINTTYPE.GOOD_POINT_JOIN_CAMPAIGN,
						campaignResponse.data.setting.value || '300'
					)
				)
			}

			return configs
		},
		staleTime: 5 * 60 * 1000, // 5 phút
		retry: 1
	})
}
