import { Gift, Heart, Star, Users } from 'lucide-react'
import React, { ReactNode } from 'react'

import { EGoodDeedType, EGoodPOINTTYPE, ESettingKey } from '@/models/enums'
import { useSettingsStore } from '@/stores/settingStore'

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

const ScoringSystem: React.FC = () => {
	const { getSettingValue } = useSettingsStore()
	const configs: IGoodDeedUIConfig[] = []
	const oldItemValue = getSettingValue(ESettingKey.GOOD_POINT_GIVE_OLD_ITEM)
	const loseItemValue = getSettingValue(ESettingKey.GOOD_POINT_GIVE_LOSE_ITEM)
	const joinCampaignValue = getSettingValue(
		ESettingKey.GOOD_POINT_JOIN_CAMPAIGN
	)

	configs.push(
		getGoodDeedUIConfig(
			EGoodPOINTTYPE.GOOD_POINT_GIVE_OLD_ITEM,
			oldItemValue || '100'
		)
	)
	configs.push(
		getGoodDeedUIConfig(
			EGoodPOINTTYPE.GOOD_POINT_GIVE_LOSE_ITEM,
			loseItemValue || '200'
		)
	)
	configs.push(
		getGoodDeedUIConfig(
			EGoodPOINTTYPE.GOOD_POINT_JOIN_CAMPAIGN,
			joinCampaignValue || '300'
		)
	)

	if (!configs || configs.length === 0) {
		return (
			<div className='glass rounded-lg shadow-sm'>
				<div className='p-6'>
					<div className='py-8 text-center'>
						<p className='text-muted-foreground'>
							Chưa có dữ liệu hệ thống tính điểm
						</p>
					</div>
				</div>
			</div>
		)
	}

	// Tính toán ví dụ điểm dựa trên data thực tế
	const exampleCalculation = configs.reduce((acc, config, index) => {
		const multiplier = index === 0 ? 2 : 1 // Giả sử action đầu tiên làm 2 lần
		return acc + Number(config.points) * multiplier
	}, 0)

	return (
		<div className='glass rounded-lg shadow-sm'>
			<div className='p-6'>
				<div className='mb-6 flex items-center gap-3'>
					<div className='bg-accent/10 rounded-lg p-2'>
						<Star className='text-accent h-5 w-5' />
					</div>
					<h2 className='text-foreground text-lg font-semibold'>
						Hệ thống tính điểm
					</h2>
				</div>

				{/* Scoring Actions */}
				<div className='space-y-6'>
					<div className='grid grid-cols-1 gap-4'>
						{configs.map(action => (
							<div
								key={action.type}
								className={`space-y-3 rounded-lg p-4 transition-all duration-200 ${action.color}`}
							>
								<div className='flex items-center gap-3'>
									<div className='bg-card flex h-8 w-8 items-center justify-center rounded-full border'>
										{action.icon}
									</div>
									<div className='flex-1'>
										<h3 className='text-foreground text-sm font-medium'>
											{action.action}
										</h3>
										<p className='text-muted-foreground mt-1 text-xs'>
											{action.description}
										</p>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<span
										className={`text-lg font-bold ${
											Number(action.points) > 0 ? 'text-success' : 'text-error'
										}`}
									>
										{Number(action.points) > 0 ? '+' : ''}
										{action.points} điểm
									</span>
								</div>
							</div>
						))}
					</div>

					{/* Additional Info */}
					<div className='border-border bg-muted/30 rounded-lg border p-4'>
						<h3 className='text-foreground mb-3 font-medium'>
							Lưu ý quan trọng
						</h3>
						<div className='text-muted-foreground space-y-2 text-sm'>
							<p>• Điểm được cộng dồn theo mỗi hoạt động</p>
							<p>• Việc tốt được tính khi hoàn thành giao dịch</p>
							<p>• Xếp hạng cập nhật theo thời gian thực</p>
							<p>• Điểm số có thể thay đổi theo chính sách của hệ thống</p>
						</div>
					</div>

					{/* Dynamic Example */}
					<div className='border-primary/20 bg-primary/5 rounded-lg border p-4'>
						<h3 className='text-foreground mb-3 font-medium'>
							Ví dụ tính điểm
						</h3>
						<div className='text-muted-foreground space-y-2 text-sm'>
							<p className='text-foreground font-medium'>
								Hoạt động trong ngày:
							</p>
							{configs.map((config, index) => {
								const multiplier = index === 0 ? 2 : 1
								const totalPoints = Number(config.points) * multiplier
								return (
									<p key={config.type}>
										• {config.action}{' '}
										{multiplier > 1 ? `(${multiplier} lần)` : ''}:{' '}
										<span className='text-success font-medium'>
											+{totalPoints} điểm
										</span>
									</p>
								)
							})}
							<div className='border-border/50 mt-2 border-t pt-2'>
								<p className='text-foreground font-medium'>
									→ Tổng:{' '}
									<span className='text-success'>
										{exampleCalculation} điểm
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ScoringSystem
