import { Trash2 } from 'lucide-react'
import React from 'react'

interface ItemTableProps {
	allItems: {
		itemID: number
		name: string
		categoryName: string
		quantity: number
	}[]
	onDelete: (itemID: number) => void
}

const ItemTable: React.FC<ItemTableProps> = ({ allItems, onDelete }) => {
	return (
		<div className='mt-4 overflow-x-auto'>
			<table className='border-border bg-card min-w-full rounded-lg border'>
				<thead>
					<tr className='bg-muted text-foreground'>
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
					{allItems.map(item => (
						<tr
							key={item.itemID}
							className='hover:bg-muted/50 transition-colors'
						>
							<td className='border-border border-b px-4 py-2'>{item.name}</td>
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
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default ItemTable
