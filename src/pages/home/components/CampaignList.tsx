import { Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Carousel from '@/components/common/Carousel'
import { useListPostQuery } from '@/hooks/queries/use-post-query'
import { EPostType, ESortOrder } from '@/models/enums'
import CampaignCard from '@/pages/item-warehouse/components/CampaignCard'
import PostItemSkeleton from '@/pages/post/components/PostItemSkeleton'

const CampaignList = () => {
	const { data, isLoading } = useListPostQuery({
		limit: 10,
		type: EPostType.CAMPAIGN,
		sort: 'createdAt',
		order: ESortOrder.DESC
	})
	const navigate = useNavigate()
	const posts = data?.posts

	const handleCampaignClick = (campaign: any) => {
		navigate(`/bai-dang/${campaign.slug}`)
	}

	return (
		<div className='px-4'>
			{isLoading ? (
				<div className='grid grid-cols-3 gap-6'>
					<PostItemSkeleton quantity={3} />
				</div>
			) : posts && posts.length > 0 ? (
				posts.length >= 3 ? (
					<Carousel
						itemHeight='h-[570px]'
						autoplay={false}
					>
						{posts.map(campaign => (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
								onClick={handleCampaignClick}
								className='h-full'
							/>
						))}
					</Carousel>
				) : (
					<div className='grid grid-cols-3 gap-6'>
						{posts.map(campaign => (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
								onClick={handleCampaignClick}
								className='h-[570px]'
							/>
						))}
					</div>
				)
			) : (
				<div className='col-span-3'>
					<div className='flex flex-col items-center justify-center py-10 text-center'>
						<Package className='mb-4 h-16 w-16 text-gray-300' />
						<p className='text-secondary text-lg'>Hiện chưa có chiến dịch</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default CampaignList
