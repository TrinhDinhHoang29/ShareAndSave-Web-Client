import { Gift, MoveRight, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { getTypeInfo } from '@/models/constants'
import { EPostType } from '@/models/enums'

import AccomodateCard from './components/AccomodateCard'
import BannerCarousel from './components/BannerCarousel'
import CampaignList from './components/CampaignList'
import Heading from './components/Heading'
import ItemWarehouseCarousel from './components/ItemWarehouseCarousel'
import NoticeCard from './components/NoticeCard'
import PostLostItemCarousel from './components/PostLostItemCarousel'
import PostOldItems from './components/PostOldItems'
import PostOther from './components/PostOther'
import SubBannerView from './components/SubBannerView'

const Home = () => {
	const [selectedLostITemType, setSelectedLostITemType] = useState<EPostType>(
		EPostType.SEEK_LOSE_ITEM
	)
	return (
		<div className='mb-12 space-y-10'>
			<BannerCarousel />
			<NoticeCard />
			<div className='container mx-auto space-y-5'>
				<Heading
					title='Đồ thất lạc'
					className='flex items-center'
				>
					<Link
						to='dang-bai'
						className='bg-primary text-primary-foreground rounded-md p-2 underline underline-offset-1'
					>
						<Plus />
					</Link>
				</Heading>
				<div className='flex items-center gap-4'>
					<button
						onClick={() => setSelectedLostITemType(EPostType.FOUND_ITEM)}
						className={`flex items-center justify-center space-x-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
							selectedLostITemType === EPostType.FOUND_ITEM
								? 'bg-primary text-primary-foreground shadow-md'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground border'
						}`}
					>
						<Search className='h-4 w-4' />
						<span>{getTypeInfo(EPostType.FOUND_ITEM).label}</span>
					</button>
					<button
						onClick={() => setSelectedLostITemType(EPostType.SEEK_LOSE_ITEM)}
						className={`flex items-center justify-center space-x-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
							selectedLostITemType === EPostType.SEEK_LOSE_ITEM
								? 'bg-primary text-primary-foreground shadow-md'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground border'
						}`}
					>
						<Gift className='h-4 w-4' />
						<span>{getTypeInfo(EPostType.SEEK_LOSE_ITEM).label}</span>
					</button>
				</div>
				<PostLostItemCarousel type={selectedLostITemType} />
			</div>
			<div className='relative container mx-auto space-y-5'>
				<Heading
					title={getTypeInfo(EPostType.GIVE_AWAY_OLD_ITEM).label}
					className='flex items-center'
				>
					<Link
						to='dang-bai'
						className='bg-primary text-primary-foreground rounded-md p-2 underline underline-offset-1'
					>
						<Plus />
					</Link>
				</Heading>
				<PostOldItems />
				<button className='text-secondary absolute right-10 -bottom-8 flex items-center gap-2 text-base'>
					Xem thêm
					<MoveRight className='animate-move h-4 w-4' />
				</button>
			</div>
			<div className='container mx-auto space-y-5'>
				<Heading subtitle={getTypeInfo(EPostType.OTHER).label} />
				<PostOther />
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
			<div className='container mx-auto space-y-5'>
				<Heading title='Một số hình ảnh nổi bật' />
				<SubBannerView />
			</div>
		</div>
	)
}

export default Home
