import { AnimatePresence, motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import React from 'react'

import defaultImage from '@/assets/images/default_img.webp'

interface ItemTableProps {
	allItems: {
		itemID: number
		name: string
		categoryName: string
		quantity: number
		image?: string
		alternativeImage?: string
	}[]
	onDelete: (itemID: number) => void
}

const ItemTable: React.FC<ItemTableProps> = ({ allItems, onDelete }) => {
	return (
		<div className='mt-4 overflow-x-auto'>
			<table className='border-border bg-card min-w-full rounded-lg border'>
				<thead>
					<tr className='bg-muted text-foreground'>
						<th className='border-border border-b px-4 py-2 text-left'>
							Hình ảnh
						</th>
						<th className='border-border border-b px-4 py-2 text-left'>Tên</th>
						<th className='border-border border-b px-4 py-2 text-left'>
							Danh mục
						</th>
						<th className='border-border border-b px-4 py-2 text-left'>
							Số lượng
						</th>
						<th className='border-border border-b px-4 py-2 text-left'>
							Hành động
						</th>
					</tr>
				</thead>
				<tbody>
					<AnimatePresence>
						{allItems.map(item => (
							<motion.tr
								key={item.itemID}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className='hover:bg-muted/50 transition-colors'
							>
								<td className='border-border border-b px-4 py-2'>
									<img
										src={item.image || item.alternativeImage || defaultImage}
										alt={item.name}
										className='h-12 w-12 rounded-md object-cover'
										onError={e => {
											e.currentTarget.src = defaultImage
											console.warn(
												`Failed to load image for ${item.name}, using default`
											)
										}}
									/>
								</td>
								<td className='border-border border-b px-4 py-2'>
									{item.name}
								</td>
								<td className='border-border border-b px-4 py-2'>
									{item.categoryName || '-'}
								</td>
								<td className='border-border border-b px-4 py-2'>
									{item.quantity}
								</td>
								<td className='border-border border-b px-4 py-2'>
									<button
										onClick={() => onDelete(item.itemID)}
										className='text-destructive hover:text-destructive/80 transition-colors'
									>
										<Trash2 className='h-4 w-4' />
									</button>
								</td>
							</motion.tr>
						))}
					</AnimatePresence>
				</tbody>
			</table>
		</div>
	)
}

export default ItemTable
