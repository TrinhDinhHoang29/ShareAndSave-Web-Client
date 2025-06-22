import CampaignCard from '@/pages/item-warehouse/components/CampaignCard'

// Demo Component
const CampaignList = () => {
	const sampleCampaigns = [
		{
			id: 1,
			title: 'Tặng sách cũ cho trẻ em vùng cao',
			description:
				'Chiến dịch thu thập sách cũ, đồ chơi và dụng cụ học tập để tặng cho trẻ em ở các vùng núi phía Bắc. Chúng tôi mong muốn mang tri thức và niềm vui đến với những em nhỏ thiếu thốn. Mọi cuốn sách dù cũ nhưng còn sử dụng được đều là những món quà ý nghĩa.',
			image:
				'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop',
			startDate: '2024-01-15',
			endDate: '2024-02-28',
			location: 'Lào Cai, Hà Giang, Cao Bằng',
			organizer: 'Hội sinh viên Hà Nội',
			targetItems: 1000,
			collectedItems: 750,
			participants: 89,
			status: 'active' as const,
			categories: [
				'Sách giáo khoa',
				'Truyện thiếu nhi',
				'Đồ chơi',
				'Dụng cụ học tập'
			]
		},
		{
			id: 2,
			title: 'Quần áo ấm cho mùa đông',
			description:
				'Thu thập quần áo cũ, chăn màn để hỗ trợ người vô gia cư và gia đình khó khăn vượt qua mùa đông giá lạnh. Những món đồ tuy đã qua sử dụng nhưng vẫn còn tốt sẽ được trao tặng đến đúng người cần.',
			image:
				'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
			startDate: '2024-02-01',
			endDate: '2024-03-15',
			location: 'TP. Hồ Chí Minh và các tỉnh lân cận',
			organizer: 'Nhóm tình nguyện Saigon',
			targetItems: 500,
			collectedItems: 320,
			participants: 156,
			status: 'active' as const,
			categories: ['Áo khoác', 'Quần dài', 'Chăn màn', 'Giày dép']
		},
		{
			id: 3,
			title: 'Máy tính cũ cho học sinh',
			description:
				'Quyên góp máy tính, laptop cũ để hỗ trợ học sinh có hoàn cảnh khó khăn trong việc học tập trực tuyến.',
			image:
				'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=300&fit=crop',
			startDate: '2024-03-01',
			endDate: '2024-04-30',
			location: 'Toàn quốc',
			organizer: 'Quỹ giáo dục Việt Nam',
			targetItems: 200,
			collectedItems: 45,
			participants: 23,
			status: 'upcoming' as const,
			categories: ['Laptop', 'Máy tính để bàn', 'Thiết bị phụ kiện']
		}
	]

	const handleCampaignClick = (campaign: any) => {
		console.log('Clicked campaign:', campaign.title)
	}

	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{sampleCampaigns.map(campaign => (
				<CampaignCard
					key={campaign.id}
					campaign={campaign}
					onClick={handleCampaignClick}
				/>
			))}
		</div>
	)
}

export default CampaignList
