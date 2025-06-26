import clsx from 'clsx'

const TriangleCornerBadge = ({
	position = 'right'
}: {
	position?: 'left' | 'right'
}) => (
	<div
		className={clsx(
			'border-t-primary absolute top-0 z-30 h-0 w-0 border-t-[60px]',
			position === 'left'
				? 'left-0 rounded-tl-xl border-r-[60px] border-r-transparent'
				: 'right-0 rounded-tr-xl border-l-[60px] border-l-transparent'
		)}
	>
		<span
			className={clsx(
				'absolute -translate-x-1/2 -translate-y-1/2 transform text-[10px] font-semibold whitespace-nowrap text-white drop-shadow-md',
				position === 'left'
					? '-top-[40px] left-[20px] -rotate-45'
					: '-top-[40px] -right-[20px] rotate-45'
			)}
		>
			Của bạn
		</span>
	</div>
)

export default TriangleCornerBadge
