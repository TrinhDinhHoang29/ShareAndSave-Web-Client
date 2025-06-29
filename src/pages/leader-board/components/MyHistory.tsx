import { Calendar, History, Package } from 'lucide-react'
import React from 'react'

import Loading from '@/components/common/Loading'
import { useMyGoodDeedsQuery } from '@/hooks/queries/use-good-deed.query'
import { getAccessToken } from '@/lib/token'
import { EGoodDeedType } from '@/models/enums'

const MyHistory: React.FC = () => {
	const token = getAccessToken()
	const { data, isPending } = useMyGoodDeedsQuery(token || '')

	const getGoodDeedTypeName = (type: EGoodDeedType) => {
		switch (type) {
			case EGoodDeedType.GOOD_DEED_TYPE_GIVE_OLD_ITEM:
				return 'Tặng đồ cũ'
			case EGoodDeedType.GOOD_DEED_TYPE_GIVE_LOSE_ITEM:
				return 'Trả đồ thất lạc'
			case EGoodDeedType.GOOD_DEED_TYPE_CAMPAGIN:
				return 'Chiến dịch'
			default:
				return 'Hoạt động tốt'
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	if (isPending) {
		return <Loading text='Đang tải...' />
	}

	return data?.length === 0 ? (
		<div className='py-8 text-center'>
			<div className='bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
				<History className='text-muted-foreground h-8 w-8' />
			</div>
			<p className='text-muted-foreground'>Chưa có hoạt động nào</p>
		</div>
	) : (
		<div className='space-y-4'>
			{data
				?.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)
				.map(deed => (
					<div
						key={deed.id}
						className='glass border-border/30 hover:border-border/50 rounded-lg border p-4 transition-all duration-200 hover:shadow-md'
					>
						<div className='flex items-start gap-4'>
							<div className='bg-card flex h-10 w-10 items-center justify-center rounded-full border'>
								<History className='h-5 w-5' />
							</div>
							<div className='flex-1'>
								<div className='mb-2 flex items-center justify-between'>
									<h3 className='text-foreground font-medium'>
										{getGoodDeedTypeName(deed.goodDeedType)}
									</h3>
									<div className='flex items-center gap-2'>
										<span
											className={`text-sm font-bold ${
												deed.goodPoint > 0 ? 'text-success' : 'text-error'
											}`}
										>
											{deed.goodPoint > 0 ? '+' : ''}
											{deed.goodPoint} điểm
										</span>
										<div className='text-muted-foreground flex items-center gap-1 text-xs'>
											<Calendar className='h-3 w-3' />
											{formatDate(deed.createdAt)}
										</div>
									</div>
								</div>

								{deed.items.length > 0 && (
									<div className='mt-3'>
										<p className='text-muted-foreground mb-2 text-sm'>
											Vật phẩm liên quan:
										</p>
										<div className='flex flex-wrap gap-2'>
											{deed.items.map(item => (
												<div
													key={item.itemID}
													className='bg-muted/30 flex items-center gap-2 rounded-md px-3 py-1'
												>
													{item.itemImage ? (
														<img
															src={item.itemImage}
															alt={item.itemName}
															className='h-6 w-6 rounded object-cover'
														/>
													) : (
														<Package className='text-muted-foreground h-4 w-4' />
													)}
													<span className='text-foreground text-sm'>
														{item.itemName}
													</span>
													{item.quantity > 1 && (
														<span className='text-muted-foreground text-xs'>
															x{item.quantity}
														</span>
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				))}
		</div>
	)
}

export default MyHistory
