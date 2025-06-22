import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { Package } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import Carousel from '@/components/common/Carousel'
import { useListItemWarehouseQuery } from '@/hooks/queries/use-item-warehouse-query'
import ItemWarehouseCard from '@/pages/item-warehouse/components/ITemWarehouseCard'
import ItemWarehouseCardSkeleton from '@/pages/item-warehouse/components/ItemWarehouseSkeletonCard'

const ItemWarehouseCarousel: React.FC = () => {
	const { data, isLoading } = useListItemWarehouseQuery({
		limit: 10
	})
	const navigate = useNavigate()
	const itemWarehouses = useMemo(() => data?.itemOldStocks, [data])

	return (
		<div className='px-4'>
			{isLoading ? (
				<div className='grid grid-cols-3 gap-6'>
					<ItemWarehouseCardSkeleton quantity={3} />
				</div>
			) : itemWarehouses && itemWarehouses.length > 0 ? (
				<Carousel
					itemHeight='h-[350px]'
					autoplay={false}
				>
					{itemWarehouses.map(item => (
						<ItemWarehouseCard
							key={item.item_id}
							className='h-full'
							item={item}
							onClick={slug => navigate('/kho-do-cu' + '/' + slug)}
						/>
					))}
				</Carousel>
			) : (
				<div className='flex flex-col items-center justify-center py-20 text-center'>
					<Package className='text-secondary/50 mb-4 h-16 w-16' />
					<p className='text-secondary/80 text-lg'>Hiện chưa có đồ cũ</p>
				</div>
			)}
		</div>
	)
}

export default ItemWarehouseCarousel
