import { Link } from 'react-router-dom'

import { getTypeInfo } from '@/models/constants'
import { EPostType } from '@/models/enums'

import AccomodateCard from './components/AccomodateCard'
import CampaignList from './components/CampaignList'
import Heading from './components/Heading'
import InstructionBanner from './components/InstructionBanner'
import ItemWarehouseCarousel from './components/ItemWarehouseCarousel'
import NoticeCard from './components/NoticeCard'
import PostCarousel from './components/PostCarousel'
import PostOldItems from './components/PostOldItems'
import PostSeekLostItem from './components/PostSeekLostItem'

const Home = () => {
	return (
		<div className='mb-12 space-y-10'>
			<InstructionBanner />
			<NoticeCard />
			<div className='container mx-auto space-y-5'>
				<Heading title='Bài đăng'>
					<Link
						to='bai-dang'
						className='text-primary/90 underline underline-offset-1'
					>
						Xem tất cả
					</Link>
				</Heading>
				<Heading subtitle='Mới nhất' />
				<PostCarousel />
				<Heading subtitle={getTypeInfo(EPostType.GIVE_AWAY_OLD_ITEM).label} />
				<PostOldItems />
				<Heading subtitle={getTypeInfo(EPostType.SEEK_LOSE_ITEM).label} />
				<PostSeekLostItem />
			</div>
			<AccomodateCard />
			<div className='container mx-auto space-y-5'>
				<Heading title='Kho đồ cũ'>
					<Link
						to='kho-do-cu'
						className='text-primary/90 underline underline-offset-1'
					>
						Xem tất cả
					</Link>
				</Heading>
				<ItemWarehouseCarousel />
			</div>
			<div className='container mx-auto space-y-5'>
				<Heading title='Chiến dịch'>
					<Link
						to='#'
						className='text-primary/90 underline underline-offset-1'
					>
						Xem tất cả
					</Link>
				</Heading>
				<CampaignList />
			</div>
		</div>
	)
}

export default Home
