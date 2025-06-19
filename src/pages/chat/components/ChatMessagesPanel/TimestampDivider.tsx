import React from 'react'

import { formatHoverTime } from '@/lib/utils'

const TimestampDivider = React.memo(({ timestamp }: { timestamp: string }) => (
	<div className='flex items-center justify-center py-4'>
		<div className='bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium'>
			{formatHoverTime(timestamp)}
		</div>
	</div>
))

export default TimestampDivider
