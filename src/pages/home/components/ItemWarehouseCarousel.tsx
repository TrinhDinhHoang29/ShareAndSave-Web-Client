import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { Package } from 'lucide-react'
import { useMemo } from 'react'

import Carousel from '@/components/common/Carousel'
import { useListItemWarehouseQuery } from '@/hooks/queries/use-item-warehouse-query'
import ItemWarehouseCard from '@/pages/item-warehouse/components/ITemWarehouseCard'
import ItemWarehouseCardSkeleton from '@/pages/item-warehouse/components/ItemWarehouseSkeletonCard'

const ItemWarehouseCarousel: React.FC = () => {
	const { data, isLoading } = useListItemWarehouseQuery({
		limit: 10
	})
	const itemWarehouses = useMemo(() => data?.itemOldStocks, [data])

	return (
		<div className='px-4'>
			{isLoading ? (
				<div className='grid grid-cols-3 gap-6'>
					<ItemWarehouseCardSkeleton quantity={3} />
				</div>
			) : itemWarehouses && itemWarehouses.length > 0 ? (
				itemWarehouses.length >= 3 ? (
					<Carousel
						itemHeight='h-[350px]'
						autoplay={false}
					>
						{itemWarehouses.map(item => (
							<ItemWarehouseCard
								key={item.itemID}
								className='h-full'
								item={item}
							/>
						))}
					</Carousel>
				) : (
					<div className='grid grid-cols-3 gap-6'>
						{itemWarehouses.map(item => (
							<ItemWarehouseCard
								key={item.itemID}
								className='h-[350px]'
								item={item}
							/>
						))}
					</div>
				)
			) : (
				<div className='col-span-3'>
					<div className='flex flex-col items-center justify-center py-10 text-center'>
						<Package className='mb-4 h-16 w-16 text-gray-300' />
						<p className='text-secondary text-lg'>Hiện chưa có đồ cũ</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default ItemWarehouseCarousel
